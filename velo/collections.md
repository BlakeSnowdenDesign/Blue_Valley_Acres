# CMS collections

## DuesPayments (permissions: Admin only)

| Field | Key | Type |
|---|---|---|
| Title (parcel) | `title` | Text |
| Parcel number | `parcelNumber` | Text |
| Owner name | `ownerName` | Text |
| Email | `email` | Text |
| Phone | `phone` | Text |
| Payment method | `paymentMethod` | Text (`ach` / `card`) |
| Dues amount | `duesAmount` | Number |
| Processing fee | `processingFee` | Number |
| Support fund | `supportFund` | Text |
| Support amount | `supportAmount` | Number |
| Total | `total` | Number |
| Wix payment id | `paymentId` | Text |
| Status | `status` | Text (`Started`, then the Wix Pay status) |
| Transaction id | `transactionId` | Text |
| Paid date | `paidDate` | Date |

Rows are inserted by `backend/dues.web.js` when a payment starts and updated by `backend/events.js` when Wix Pay reports the result.
