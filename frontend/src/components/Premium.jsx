import React, { useEffect, useState } from "react";
import axios from "axios";

function Premium() {
  const [premiumStatus, setPremiumStatus] = useState(null);
  const userId = 1; // simulate current user

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/orders?userId=${userId}&status=active`);
      const activeOrder = res.data.find(order => new Date(order.expiryDate) > new Date());

      if (activeOrder) {
        setPremiumStatus(activeOrder);
      } else {
        setPremiumStatus(null); // expired
      }
    } catch (err) {
      console.error("Error checking premium status", err);
    }
  };

  const handlePayment = async () => {
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + 7); // 7-day premium

    const orderData = {
      userId,
      name: "Premium Upgrade",
      amount: 499,
      status: "active",
      startDate: now.toISOString(),
      expiryDate: expiry.toISOString()
    };

    try {
      const res = await axios.post("http://localhost:3000/orders", orderData);
      if (res.status === 201) {
        alert("Premium activated!");
        setPremiumStatus(res.data);
      }
    } catch (err) {
      alert("Payment failed.");
    }
  };

  return (
    <div className="container text-center my-5">
      <h2 className="mb-3">Premium Upgrade</h2>

      {premiumStatus ? (
        <div className="alert alert-success">
          🎉 You are a Premium User until <strong>{new Date(premiumStatus.expiryDate).toLocaleDateString()}</strong>
        </div>
      ) : (
        <>
          <p>Highlight your job postings for ₹499 (valid for 7 days)</p>
          <button className="btn btn-success" onClick={handlePayment}>
            Buy Premium
          </button>
        </>
      )}
    </div>
  );
}

export default Premium;
