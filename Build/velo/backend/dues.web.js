// Annual landowner dues: builds the payment on the server so the amount can't be changed in the browser.
import { Permissions, webMethod } from 'wix-web-module';
import wixPayBackend from 'wix-pay-backend';
import wixData from 'wix-data';

// Reconfirm these each dues cycle (design document, section 9).
const DUES = 400;
const FEES = {
  ach: { rate: 0.008, fixed: 0, label: 'ACH processing fee (0.8%)' },
  card: { rate: 0.029, fixed: 0.30, label: 'Card processing fee (2.9% + $0.30)' },
};
const FUNDS = ['Road maintenance and snow plow fund', 'River and erosion fund'];
const COLLECTION = 'DuesPayments';

const cents = (n) => Math.round(n * 100) / 100;

export const createDuesPayment = webMethod(Permissions.Anyone, async (form) => {
  const parcel = String(form.parcel || '').trim().slice(0, 40);
  const owner = String(form.owner || '').trim().slice(0, 120);
  const email = String(form.email || '').trim().slice(0, 160);
  const phone = String(form.phone || '').trim().slice(0, 40);
  const method = FEES[form.method] ? form.method : null;
  const gift = cents(Math.min(Math.max(Number(form.gift) || 0, 0), 10000));
  const fund = gift > 0 ? form.fund : '';

  if (!parcel || !owner || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !method) {
    throw new Error('Some required details are missing.');
  }
  if (gift > 0 && !FUNDS.includes(fund)) {
    throw new Error('Choose a fund for the optional contribution.');
  }

  const fee = cents(DUES * FEES[method].rate + FEES[method].fixed);
  const items = [
    { name: `Annual landowner dues, parcel ${parcel}`, price: DUES },
    { name: FEES[method].label, price: fee },
  ];
  if (gift > 0) items.push({ name: `Optional support: ${fund}`, price: gift });
  const total = cents(items.reduce((sum, i) => sum + i.price, 0));

  const [firstName, ...rest] = owner.split(/\s+/);
  const payment = await wixPayBackend.createPayment({
    items,
    amount: total,
    currency: 'USD',
    userInfo: { firstName, lastName: rest.join(' '), email, phone },
  });

  await wixData.insert(COLLECTION, {
    title: parcel,
    parcelNumber: parcel,
    ownerName: owner,
    email,
    phone,
    paymentMethod: method,
    duesAmount: DUES,
    processingFee: fee,
    supportFund: fund,
    supportAmount: gift,
    total,
    paymentId: payment.id,
    status: 'Started',
  }, { suppressAuth: true });

  return { paymentId: payment.id, parcel, email, method, fee, fund, gift, total };
});
