// Records the provider's payment status. Only this event marks dues as paid; ACH stays Pending until it settles.
import wixData from 'wix-data';

export async function wixPay_onPaymentUpdate(event) {
  const { items } = await wixData.query('DuesPayments')
    .eq('paymentId', event.payment.id)
    .find({ suppressAuth: true });
  if (!items.length) return;

  const record = items[0];
  record.status = event.status;
  record.transactionId = event.transactionId;
  if (event.status === 'Successful') record.paidDate = new Date();
  await wixData.update('DuesPayments', record, { suppressAuth: true });
}
