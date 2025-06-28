import React, { useEffect, useState } from "react";
import axios from "axios";

// const API_BASE_URL = "http://localhost:8000"; 
const API_BASE_URL = "https://himanshukush.pythonanywhere.com"; 
// const API_BASE_URL = "http://localhost:3000"; 



// Countdown component
function CountdownTimer({ expiry }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(expiry);
      const diff = end - now;

      if (diff <= 0) {
        setTime("⛔ Subscription expired");
        clearInterval(timer);
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTime(`${d}d ${h}h ${m}m ${s}s left`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiry]);

  return <div className="alert alert-info text-center mt-3">⏰ {time}</div>;
}

function Subscription() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [isPremium, setIsPremium] = useState(false);
  const [expiry, setExpiry] = useState(null);
  const [history, setHistory] = useState([]);

  const plans = [
    { name: "Weekly", days: 7, amount: 99 },
    { name: "Monthly", days: 30, amount: 299 },
    { name: "Yearly", days: 365, amount: 999 },
  ];

  useEffect(() => {
    if (userId) loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders?userId=${userId}`);
      const data = res.data || [];
      setHistory(data);

      const active = data.find((o) => new Date(o.expiryDate) > new Date());
      setIsPremium(!!active);
      setExpiry(active?.expiryDate);
    } catch (err) {
      console.error("Error fetching subscription history", err);
    }
  };

  const handlePayment = async (plan) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/create-order/`, {
        user: userId,
        amount: plan.amount,
      });

      const { order_id, amount, currency, razorpay_key } = res.data;

      const options = {
        key: razorpay_key,
        amount,
        currency,
        name: "Premium Subscription",
        description: `${plan.name} Plan`,
        order_id,
        prefill: { name: user.name, email: user.email },
        theme: { color: "#3399cc" },
        handler: async function (response) {
          const now = new Date();
          const expiryDate = new Date();
          expiryDate.setDate(now.getDate() + plan.days);

          const orderData = {
            user: userId,
            name: `${plan.name} Subscription`,
            amount: plan.amount,
            plan: plan.name.toLowerCase(),
            status: "active",
            startDate: now.toISOString(),
            expiryDate: expiryDate.toISOString(),
            transactionId: response.razorpay_payment_id,
          };

          const saveRes = await axios.post(`${API_BASE_URL}/orders/`, orderData);
          if (saveRes.status === 201) {
            alert("✅ Payment successful!");
            loadOrders();
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("❌ Payment failed. Try again.");
      console.log(err);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">💳 Premium Plans</h2>

      {isPremium ? (
        <>
          <div className="alert alert-success text-center">
            ✅ You are a premium user!
            <br />
            🗓️ Valid till: <strong>{new Date(expiry).toLocaleDateString()}</strong>
          </div>
          <CountdownTimer expiry={expiry} />
        </>
      ) : (
        <div className="row justify-content-center">
          {plans.map((plan) => (
            <div className="col-md-3" key={plan.name}>
              <div className="card text-center shadow-sm mb-4">
                <div className="card-body">
                  <h5>{plan.name}</h5>
                  <p>₹{plan.amount}</p>
                  <button className="btn btn-success" onClick={() => handlePayment(plan)}>
                    Buy {plan.name}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5">
        <h4>📜 History</h4>
        <ul className="list-group">
          {history.length === 0 ? (
            <li className="list-group-item">No transactions yet.</li>
          ) : (
            history.map((h, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between">
                <span>
                  <strong>{h.plan.toUpperCase()}</strong> | ₹{h.amount}
                  <br />
                  {new Date(h.startDate).toLocaleDateString()} →{" "}
                  {new Date(h.expiryDate).toLocaleDateString()}
                </span>
                <span className="text-muted small">Txn ID: {h.transactionId}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default Subscription;
