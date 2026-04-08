// pages/payment-result.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const FONT = "'Inter', 'Noto Sans SC', sans-serif";

export default function PaymentResult() {
  const router  = useRouter();
  const { orderId, status_id, msg } = router.query;
  const [count, setCount] = useState(4);
  const success = !status_id || status_id === "1";

  useEffect(() => {
    if (!router.isReady) return;
    const t = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(t);
          router.push(success ? `/?confirmed=1&orderId=${orderId || ""}` : "/");
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [router.isReady]);

  return (
    <div style={{
      minHeight: "100vh", background: "#faf8f5",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: 32, textAlign: "center",
      fontFamily: FONT,
    }}>
      {success ? (
        <>
          <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
          <div style={{ fontWeight: 900, fontSize: 22, color: "#1a0a00", marginBottom: 6 }}>支付成功</div>
          <div style={{ fontSize: 14, color: "#888", marginBottom: 6 }}>Payment Successful</div>
          {orderId && <div style={{ fontSize: 12, color: "#aaa", marginBottom: 24 }}>订单号 {orderId}</div>}
          <div style={{ fontSize: 12, color: "#bbb" }}>{count} 秒后跳转…</div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 52, marginBottom: 16 }}>❌</div>
          <div style={{ fontWeight: 900, fontSize: 22, color: "#1a0a00", marginBottom: 6 }}>支付未完成</div>
          <div style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>
            {msg || "Payment not completed"}
          </div>
          <button
            onClick={() => router.back()}
            style={{
              background: "linear-gradient(135deg, #8b0000, #e63946)",
              color: "#fff", border: "none", borderRadius: 14,
              padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer",
            }}
          >
            返回重试
          </button>
        </>
      )}
    </div>
  );
}
