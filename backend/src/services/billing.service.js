import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getInvoices = async (memberId) => {
  return await prisma.invoice.findMany({
    where: { memberId },
    orderBy: { issuedAt: 'desc' },
    include: {
      payment: {
        include: {
          plan: true
        }
      }
    }
  });
};

export const getInvoiceById = async (memberId, invoiceId) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      payment: {
        include: {
          plan: true
        }
      }
    }
  });

  if (!invoice) throw new Error('INVOICE_NOT_FOUND');
  if (invoice.memberId !== memberId) throw new Error('FORBIDDEN');

  return invoice;
};
