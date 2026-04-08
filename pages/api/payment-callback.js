// pages/api/payment-callback.js
// Toyyibpay POSTs here after payment. Must return 200 or Toyyibpay retries.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { refno, status, reason, billcode, amount } = req.body;

  if (status === "1") {
    // Payment confirmed — update your database here
    // e.g. await db.orders.update({ id: refno }, { status: "paid" })
    console.info(`[Payment] ✅ Order ${refno} paid RM ${(parseInt(amount) / 100).toFixed(2)}`);
  } else {
    console.info(`[Payment] ❌ Order ${refno} — ${reason} (status ${status})`);
  }

  return res.status(200).end();
}
