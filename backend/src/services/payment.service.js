import { PrismaClient } from '@prisma/client';
import DemoPaymentProvider from '../providers/DemoPaymentProvider.js';
import * as membershipService from './memberships.service.js';

const prisma = new PrismaClient();

// In a real app, you'd instantiate based on config/env
const provider = new DemoPaymentProvider();

/**
 * Initiate a checkout session for a membership plan
 */
export const createCheckoutSession = async (memberId, planId) => {
  const plan = await prisma.membershipPlan.findUnique({ where: { id: planId } });
  if (!plan) throw new Error('PLAN_NOT_FOUND');
  if (!plan.active) throw new Error('PLAN_INACTIVE');

  // Check if member already has this plan active
  const existingMembership = await prisma.membership.findFirst({
    where: { memberId, status: 'ACTIVE' }
  });

  let type = 'NEW_MEMBERSHIP';
  if (existingMembership) {
    if (existingMembership.planId === planId) {
      throw new Error('MEMBERSHIP_ALREADY_ACTIVE');
    }
    // We'll treat this as an upgrade/downgrade checkout
    type = plan.priceMonthly > (existingMembership.plan?.priceMonthly || 0) ? 'UPGRADE' : 'DOWNGRADE_ADJUSTMENT';
  }

  // Create PENDING payment
  const payment = await prisma.payment.create({
    data: {
      memberId,
      planId,
      provider: 'DEMO',
      type,
      amount: plan.priceMonthly,
      currency: 'BDT',
      status: 'PENDING',
      idempotencyKey: `checkout_${memberId}_${Date.now()}`,
    }
  });

  // Call provider to get URL
  const session = await provider.createPayment({
    paymentId: payment.id,
    amount: payment.amount,
    currency: payment.currency,
  });

  // Optional: update payment with provider session info if we added fields for it
  await prisma.payment.update({
    where: { id: payment.id },
    data: { providerReference: session.providerSessionId }
  });

  return {
    paymentId: payment.id,
    checkoutUrl: session.checkoutUrl,
    expiresAt: session.expiresAt
  };
};

/**
 * Webhook handler
 */
export const handleWebhook = async (providerName, req) => {
  // We only support DEMO right now
  const result = await provider.handleWebhook(req);
  if (!result.isValid) {
    throw new Error('INVALID_WEBHOOK');
  }

  return await processPaymentResult(
    result.paymentId, 
    result.providerTransactionId, 
    result.status, 
    result.amount, 
    result.currency
  );
};

/**
 * Verify a payment manually (e.g. user returns to success page)
 */
export const verifyPayment = async (paymentId) => {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) throw new Error('PAYMENT_NOT_FOUND');
  
  if (payment.status === 'PAID') return payment; // Already processed

  if (!payment.providerReference) {
    throw new Error('PAYMENT_NOT_INITIATED_WITH_PROVIDER');
  }

  // In a real provider, we might verify using the provider's API.
  // For demo, if we don't have a transaction ID yet, it means the webhook hasn't fired
  // or the user hasn't completed it. Demo provider might just return FAILED if we verify early.
  // We'll assume the frontend will pass the transactionId if it's verifying directly,
  // but usually webhooks do the heavy lifting.
  return payment;
};

/**
 * Core business logic to mark payment as paid and activate membership
 */
export const processPaymentResult = async (paymentId, providerTransactionId, status, amount, currency) => {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId }, include: { plan: true } });
  if (!payment) throw new Error('PAYMENT_NOT_FOUND');

  if (payment.status === 'PAID') {
    return payment; // Idempotent
  }

  if (status !== 'PAID') {
    // Mark as failed/expired
    return await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        providerTransactionId,
        failedAt: new Date()
      }
    });
  }

  // Verify amount matches!
  if (amount !== payment.amount || currency !== payment.currency) {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'FAILED',
        providerTransactionId,
        failureCode: 'AMOUNT_MISMATCH',
        failedAt: new Date()
      }
    });
    throw new Error('PAYMENT_AMOUNT_MISMATCH');
  }

  // It's verified! Wrap in transaction
  return await prisma.$transaction(async (tx) => {
    // 1. Mark Payment Paid
    const updatedPayment = await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: 'PAID',
        providerTransactionId,
        paidAt: new Date()
      }
    });

    // 2. Activate/Upgrade Membership
    const membership = await membershipService.activateOrUpdateMembershipTx(
      tx,
      payment.memberId,
      payment.planId,
      payment.type
    );

    // Link payment to membership
    await tx.payment.update({
      where: { id: paymentId },
      data: { membershipId: membership.id }
    });

    // 3. Create Invoice
    const invoiceNumber = `SG-INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`;
    await tx.invoice.create({
      data: {
        invoiceNumber,
        memberId: payment.memberId,
        paymentId: payment.id,
        membershipId: membership.id,
        amount: payment.amount,
        currency: payment.currency,
        status: 'PAID',
        paidAt: new Date()
      }
    });

    return updatedPayment;
  });
};
