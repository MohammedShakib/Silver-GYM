import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class NotificationService {
  static async processEvent(event) {
    const { eventType } = event;
    
    switch(eventType) {
      case 'PAYMENT_SUCCESSFUL':
        await this.handlePaymentSuccessful(event);
        break;
      case 'PAYMENT_FAILED':
        await this.handlePaymentFailed(event);
        break;
      case 'MEMBERSHIP_ACTIVATED':
        await this.handleMembershipActivated(event);
        break;
      case 'MEMBERSHIP_RENEWAL_DUE':
        await this.handleMembershipRenewalDue(event);
        break;
      case 'CHECKIN_SUCCESSFUL':
        await this.handleCheckInSuccessful(event);
        break;
      case 'PAYOUT_PAID':
        await this.handlePayoutPaid(event);
        break;
      case 'SUPPORT_CASE_UPDATED':
        await this.handleSupportCaseUpdated(event);
        break;
      case 'GYM_APPLICATION_APPROVED':
        await this.handleGymApplicationApproved(event);
        break;
      default:
        console.log(`[NotificationService] No handler for event ${eventType}`);
    }
  }
  
  static async createNotification(userId, { type, category, title, message, actionUrl, actionLabel, priority = 'NORMAL' }, channels = ['IN_APP', 'EMAIL']) {
    let prefs = await prisma.notificationPreference.findUnique({ where: { userId } });
    if (!prefs) {
       prefs = { 
         membershipEmail: true, paymentEmail: true, checkInEmail: false, 
         partnerOpsEmail: true, payoutEmail: true, supportEmail: true, inAppEnabled: true 
       };
    }

    const notification = await prisma.notification.create({
      data: { userId, type, category, title, message, actionUrl, actionLabel, priority }
    });

    if (channels.includes('EMAIL')) {
      const canSendEmail = this.canSendEmail(category, prefs);
      if (canSendEmail) {
        await prisma.notificationDelivery.create({
          data: {
            notificationId: notification.id,
            userId,
            channel: 'EMAIL',
            provider: process.env.EMAIL_PROVIDER || 'DEV',
            status: 'QUEUED'
          }
        });
      } else {
        await prisma.notificationDelivery.create({
          data: {
            notificationId: notification.id,
            userId,
            channel: 'EMAIL',
            provider: 'NONE',
            status: 'SKIPPED'
          }
        });
      }
    }
    
    return notification;
  }
  
  static canSendEmail(category, prefs) {
    switch (category) {
      case 'MEMBERSHIP': return prefs.membershipEmail !== false;
      case 'PAYMENT': return prefs.paymentEmail !== false;
      case 'CHECKIN': return prefs.checkInEmail === true;
      case 'PARTNER': return prefs.partnerOpsEmail !== false;
      case 'PAYOUT': return prefs.payoutEmail !== false;
      case 'SUPPORT': return prefs.supportEmail !== false;
      case 'ACCOUNT':
      case 'SECURITY':
      case 'SYSTEM':
        return true; 
      default: return true;
    }
  }

  static async handlePaymentSuccessful(event) {
    const { userId, amount, reference, planName, date } = event.payload;
    await this.createNotification(userId, {
      type: 'PAYMENT_SUCCESSFUL',
      category: 'PAYMENT',
      title: 'Payment successful',
      message: `Your payment of ৳${amount} for ${planName} was successful.`,
      actionUrl: '/member/membership',
      actionLabel: 'View Membership'
    }, ['IN_APP', 'EMAIL']);
  }
  
  static async handlePaymentFailed(event) {
    const { userId, amount, planName } = event.payload;
    await this.createNotification(userId, {
      type: 'PAYMENT_FAILED',
      category: 'PAYMENT',
      title: 'Payment failed',
      message: `Your payment of ৳${amount} for ${planName} failed.`,
      actionUrl: '/member/membership',
      actionLabel: 'Retry Payment',
      priority: 'HIGH'
    }, ['IN_APP', 'EMAIL']);
  }
  
  static async handleMembershipActivated(event) {
    const { userId, planName, renewalDate } = event.payload;
    await this.createNotification(userId, {
      type: 'MEMBERSHIP_ACTIVATED',
      category: 'MEMBERSHIP',
      title: 'Membership Activated',
      message: `Your ${planName} plan is now active. Renews on ${renewalDate}.`,
      actionUrl: '/member/pass',
      actionLabel: 'Open My Pass'
    }, ['IN_APP', 'EMAIL']);
  }
  
  static async handleMembershipRenewalDue(event) {
    const { userId, planName, renewalDate, amount } = event.payload;
    const formattedDate = new Date(renewalDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    await this.createNotification(userId, {
      type: 'MEMBERSHIP_RENEWAL_DUE',
      category: 'MEMBERSHIP',
      title: 'Membership Renewal Reminder',
      message: `Your ${planName} plan renews on ${formattedDate} for ৳${amount}.`,
      actionUrl: '/member/membership',
      actionLabel: 'View Membership'
    }, ['IN_APP', 'EMAIL']);
  }
  
  static async handleCheckInSuccessful(event) {
    const { userId, gymName, time, visitsRemaining } = event.payload;
    await this.createNotification(userId, {
      type: 'CHECKIN_SUCCESSFUL',
      category: 'CHECKIN',
      title: `Checked in at ${gymName}`,
      message: `${time} · ${visitsRemaining} visits remaining`,
      actionUrl: '/member/activity',
      actionLabel: 'View Activity'
    }, ['IN_APP', 'EMAIL']);
  }
  
  static async handlePayoutPaid(event) {
    const { userId, amount, gymName, reference } = event.payload;
    await this.createNotification(userId, {
      type: 'PAYOUT_PAID',
      category: 'PAYOUT',
      title: 'Payout completed',
      message: `৳${amount} was marked paid for ${gymName}.`,
      actionUrl: '/partner/payouts',
      actionLabel: 'View Payout'
    }, ['IN_APP', 'EMAIL']);
  }
  
  static async handleSupportCaseUpdated(event) {
    const { userId, reference, actionUrl } = event.payload;
    await this.createNotification(userId, {
      type: 'SUPPORT_CASE_UPDATED',
      category: 'SUPPORT',
      title: 'Your support case has been updated',
      message: `Case ${reference} has a new reply.`,
      actionUrl: actionUrl || '/member/profile',
      actionLabel: 'View Case'
    }, ['IN_APP', 'EMAIL']);
  }
  
  static async handleGymApplicationApproved(event) {
    const { userId, gymName } = event.payload;
    await this.createNotification(userId, {
      type: 'GYM_APPLICATION_APPROVED',
      category: 'APPLICATION',
      title: 'Your gym application was approved',
      message: `${gymName} can now complete partner setup.`,
      actionUrl: '/partner',
      actionLabel: 'Open Partner Dashboard',
      priority: 'HIGH'
    }, ['IN_APP', 'EMAIL']);
  }
}

export default NotificationService;
