// Pay Dues page: relays the embedded form to the backend and opens the Wix payment window.
import wixPayFrontend from 'wix-pay-frontend';
import { createDuesPayment } from 'backend/dues.web';

$w.onReady(() => {
  const form = $w('#duesForm');

  form.onMessage(async (event) => {
    if (!event.data || event.data.type !== 'bva-pay') return;
    try {
      const details = await createDuesPayment(event.data.form);
      const result = await wixPayFrontend.startPayment(details.paymentId, { showThankYouPage: false });
      // Display only; the ledger is updated by wixPay_onPaymentUpdate in backend/events.js.
      form.postMessage({
        type: 'bva-pay-result',
        result: { ...details, status: result.status, reference: result.payment ? result.payment.id : details.paymentId },
      });
    } catch (err) {
      form.postMessage({ type: 'bva-pay-result', error: err.message || 'Something went wrong.' });
    }
  });
});
