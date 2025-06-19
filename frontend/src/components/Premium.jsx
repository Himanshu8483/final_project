import React, { useState, useEffect } from "react";
import axios from "axios";

// CountdownTimer Component
function CountdownTimer({ expiryDate }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const expiry = new Date(expiryDate);
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("⛔ Subscription expired");
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s left`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  return (
    <div className="alert alert-info text-center mt-3">
      ⏰ {timeLeft}
    </div>
  );
}

// Main Subscription Component
function Subscription() {
  const user = JSON.parse(localStorage.getItem("user")); // assumed to be stored after login
  const userId = user?.id;
  const [isPremium, setIsPremium] = useState(false);
  const [expiryDate, setExpiryDate] = useState(null);

  const plans = [
    { name: "Weekly", days: 7, amount: 99 },
    { name: "Monthly", days: 30, amount: 299 },
    { name: "Yearly", days: 365, amount: 999 },
  ];

  useEffect(() => {
    if (userId) {
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/orders?userId=${userId}&status=active`);
      const valid = res.data.find(order => new Date(order.expiryDate) > new Date());
      if (valid) {
        setIsPremium(true);
        setExpiryDate(valid.expiryDate);
      }
    } catch (err) {
      console.error("Error checking subscription:", err);
    }
  };

  const handleSubscribe = async (plan) => {
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + plan.days);

    const data = {
      userId,
      name: `${plan.name} Subscription`,
      amount: plan.amount,
      plan: plan.name.toLowerCase(),
      status: "active",
      startDate: now.toISOString(),
      expiryDate: expiry.toISOString(),
    };

    try {
      const res = await axios.post("http://localhost:3000/orders", data);
      if (res.status === 201) {
        alert(`${plan.name} plan activated!`);
        setIsPremium(true);
        setExpiryDate(data.expiryDate);
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  if (!userId) {
    return <div className="text-center mt-4 text-danger">Please log in to buy a subscription</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">🪙 Choose Your Subscription Plan</h2>

      {isPremium && expiryDate ? (
        <>
          <div className="alert alert-success text-center">
            ✅ You are a premium user!
          </div>
          <CountdownTimer expiryDate={expiryDate} />
        </>
      ) : (
        <div className="row justify-content-center">
          {plans.map((plan) => (
            <div className="col-md-3" key={plan.name}>
              <div className="card text-center shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title">{plan.name}</h5>
                  <p className="card-text">₹{plan.amount}</p>
                  <button
                    className="btn btn-success"
                    onClick={() => handleSubscribe(plan)}
                  >
                    Buy {plan.name}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Subscription;
