// pages/api/create-bill.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { orderId, customerName, customerPhone, pickupDate, pickupTime, items, total } = req.body;

  if (!orderId || !customerName || !customerPhone || !total) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const categoryCode = process.env.TOYYIBPAY_CATEGORY_CODE;
  const secretKey    = process.env.TOYYIBPAY_SECRET_KEY;

  if (!categoryCode || !secretKey) {
    return res.status(500).json({ error: "Payment config missing" });
  }

  const itemSummary    = items.map((i) => `${i.name} x${i.qty}`).join(", ");
  const billDesc       = `双瑜记 ${pickupDate} ${pickupTime} | ${itemSummary}`.slice(0, 100);
  const amountInSen    = Math.round(total * 100);
  const baseUrl        = process.env.NEXT_PUBLIC_BASE_URL || "https://shuangyuji.vercel.app";
  const callbackUrl    = `${baseUrl}/api/payment-callback`;
  const returnUrl      = `${baseUrl}/payment-result?orderId=${orderId}`;

  try {
    const params = new URLSearchParams({
      userSecretKey:           secretKey,
      categoryCode:            categoryCode,
      billName:                `SYJ-${orderId}`,
      billDescription:         billDesc,
      billPriceSetting:        "1",
      billPayorInfo:           "1",
      billAmount:              String(amountInSen),
      billReturnUrl:           returnUrl,
      billCallbackUrl:         callbackUrl,
      billExternalReferenceNo: orderId,
      billTo:                  customerName,
      billPhone:               customerPhone,
      billEmail:               "",
      billSplitPayment:        "0",
      billSplitPaymentArgs:    "",
      billPaymentChannel:      "0",
      billContentEmail:        "",
      billChargeToCustomer:    "1",
    });

    const response = await fetch("https://toyyibpay.com/index.php/api/createBill", {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    params.toString(),
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch {
      return res.status(502).json({ error: "Invalid response from payment gateway" });
    }

    if (!Array.isArray(data) || !data[0]?.BillCode) {
      return res.status(502).json({ error: data[0]?.msg || "Bill creation failed" });
    }

    return res.status(200).json({
      paymentUrl: `https://toyyibpay.com/${data[0].BillCode}`,
      billCode:   data[0].BillCode,
    });

  } catch {
    return res.status(500).json({ error: "Network error contacting payment gateway" });
  }
}
