import React, { useState, useEffect } from "react";
import axios from "axios";

function Premium() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const [isPremium, setIsPremium] = useState(false);
const [expiryDate, setExpiryDate] = useState(null);

  const plans = [
    { name: "Weekly", days: 7, amount: 99 },
    { name: "Monthly", days: 30, amount: 299 },
    { name: "Yearly", days: 365, amount: 999 }
  ];

  useEffect(() => {
    if (userId) checkSubscription();
  }, []);

  const checkSubscription = async () => {
    const res = await axios.get(`http://localhost:3000/orders?userId=${userId}&status=active`);
    const valid = res.data.find(order => new Date(order.expiryDate) > new Date());
if (valid) {
  setIsPremium(true);
  setExpiryDate(valid.expiryDate);
}
  };

  const handleSubscribe = async (plan) => {
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + plan.days);

    const data = {
      userId,
      name: plan.name + " Subscription",
      amount: plan.amount,
      status: "active",
      plan: plan.name.toLowerCase(),
      startDate: now.toISOString(),
      expiryDate: expiry.toISOString()
    };

    const res = await axios.post("http://localhost:3000/orders", data);
    if (res.status === 201) {
      alert(`${plan.name} plan activated!`);
      setIsPremium(true);
    }
  };

  if (!userId) return <p>Please login to subscribe</p>;

  return (
    <div className="container text-center mt-4">
      <h2>Choose Your Subscription</h2>

      {isPremium ? (
        <div className="alert alert-success">🎉 You already have an active subscription</div>
      ) : (
        <div className="d-flex justify-content-center gap-3 mt-4">
          {plans.map(plan => (
            <div key={plan.name} className="card p-3" style={{ width: "200px" }}>
              <h5>{plan.name}</h5>
              <p>₹{plan.amount}</p>
              <button className="btn btn-success" onClick={() => handleSubscribe(plan)}>
                Buy {plan.name}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Premium;
