// pages/api/create-bill.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    orderId,
    customerName,
    customerPhone,
    pickupDate,
    pickupTime,
    items,
    total,
  } = req.body;

  if (!orderId || !customerName || !customerPhone || !total) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const categoryCode = process.env.TOYYIBPAY_CATEGORY_CODE;
  const secretKey = process.env.TOYYIBPAY_SECRET_KEY;

  if (!categoryCode || !secretKey) {
    return res.status(500).json({ error: "Payment config missing" });
  }

  // 🔥 safer description (simple)
  const itemSummary = (items || []).map((i) => `${i.nameEn || i.name} x${i.qty}`).join(", ");
  const billDesc    = `Shuangyu pickup ${pickupDate} ${pickupTime} | ${itemSummary}`.slice(0, 100);

  const amountInSen = Math.round(total * 100);

  // 🔥 MUST BE YOUR REAL DOMAIN
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://shuangyu-nxxzhmo6j-shuangyu.vercel.app";

  const callbackUrl = `${baseUrl}/api/payment-callback`;
  const returnUrl = `${baseUrl}/payment-result?orderId=${orderId}`;

  try {
    const params = new URLSearchParams({
      userSecretKey: secretKey,
      categoryCode: categoryCode,

      // ✅ FIXED
      billName: "Shuangyu Order",
      billDescription: billDesc,

      billPriceSetting: "1",
      billPayorInfo: "1",
      billAmount: amountInSen.toString(),

      billReturnUrl: returnUrl,
      billCallbackUrl: callbackUrl,

      billExternalReferenceNo: orderId,

      // ✅ REQUIRED FIELDS
      billTo: customerName,
      billPhone: customerPhone,
      billEmail: "customer@email.com", // MUST NOT BE EMPTY

      billPaymentChannel: "0",
      billChargeToCustomer: "1",
    });

    const response = await fetch(
      "https://toyyibpay.com/index.php/api/createBill",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res
        .status(502)
        .json({ error: "Invalid response from payment gateway" });
    }

    if (!Array.isArray(data) || !data[0]?.BillCode) {
      return res
        .status(502)
        .json({ error: data?.[0]?.msg || "Bill creation failed" });
    }

    return res.status(200).json({
      paymentUrl: `https://toyyibpay.com/${data[0].BillCode}`,
      billCode: data[0].BillCode,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Network error contacting payment gateway",
    });
  }
}
