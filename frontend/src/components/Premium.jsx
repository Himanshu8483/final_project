
import React, { useEffect, useState } from "react";
import axios from "axios";

// Countdown component
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

  return <div className="alert alert-info text-center mt-3">⏰ {timeLeft}</div>;
}

// Main Component
function Subscription() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [isPremium, setIsPremium] = useState(false);
  const [expiryDate, setExpiryDate] = useState(null);
  const [history, setHistory] = useState([]);

  const plans = [
    { name: "Weekly", days: 7, amount: 99 },
    { name: "Monthly", days: 30, amount: 299 },
    { name: "Yearly", days: 365, amount: 999 },
  ];

  useEffect(() => {
    if (userId) fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/orders?userId=${userId}`);
      const allOrders = res.data || [];
      setHistory(allOrders);

      const active = allOrders.find((order) => new Date(order.expiryDate) > new Date());
      if (active) {
        setIsPremium(true);
        setExpiryDate(active.expiryDate);
      } else {
        setIsPremium(false);
        setExpiryDate(null);
      }
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    }
  };

  const handleRazorpayPayment = async (plan) => {
  try {
    const res = await axios.post("http://localhost:8000/create-order/", {
      user: user.id,
      amount: plan.amount
    });

    const { order_id, amount, currency, razorpay_key } = res.data;

    const options = {
      key: razorpay_key,
      amount: amount,
      currency: currency,
      name: "Premium Subscription",
      description: `${plan.name} Plan`,
      order_id: order_id,
      handler: async function (response) {
        // Save order in your database
        const now = new Date();
        const expiry = new Date();
        expiry.setDate(now.getDate() + plan.days);

        const orderData = {
          user: user.id,
          name: `${plan.name} Subscription`,
          amount: plan.amount,
          plan: plan.name.toLowerCase(),
          status: "active",
          startDate: now.toISOString(),
          expiryDate: expiry.toISOString(),
          transactionId: response.razorpay_payment_id,
        };

        try {
          const saveRes = await axios.post("http://localhost:8000/orders/", orderData);
          if (saveRes.status === 201) {
            alert("✅ Payment successful!");
            fetchSubscription();
          }
        } catch (err) {
          alert("❌ Payment succeeded but failed to save order.");
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    alert("❌ Failed to initiate Razorpay payment.");
    console.error(error);
  }
};

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">💳 Premium Subscription Plans</h2>

      {isPremium ? (
        <>
<div className="alert alert-success text-center">
  ✅ You are a premium user!<br />
  🗓️ Subscription valid till: <strong>{new Date(expiryDate).toLocaleDateString()}</strong>
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
                    onClick={() => handleRazorpayPayment(plan)}
                  >
                    Buy {plan.name}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transaction History */}
      <div className="mt-5">
        <h4>📜 Subscription History</h4>
        <ul className="list-group">
          {history.length === 0 ? (
            <li className="list-group-item">No transactions found.</li>
          ) : (
            history.map((h, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{h.plan.toUpperCase()}</strong> | ₹{h.amount} |{" "}
                  {new Date(h.startDate).toLocaleDateString()} to{" "}
                  {new Date(h.expiryDate).toLocaleDateString()}
                </div>
                <div className="text-muted small">Txn ID: {h.transactionId}</div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default Subscription;




// import React, { useEffect, useState } from "react";
// import axios from "axios";

// // Countdown component
// function CountdownTimer({ expiryDate }) {
//   const [timeLeft, setTimeLeft] = useState("");

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = new Date();
//       const expiry = new Date(expiryDate);
//       const diff = expiry - now;

//       if (diff <= 0) {
//         setTimeLeft("⛔ Subscription expired");
//         clearInterval(interval);
//       } else {
//         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//         const minutes = Math.floor((diff / (1000 * 60)) % 60);
//         const seconds = Math.floor((diff / 1000) % 60);
//         setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s left`);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [expiryDate]);

//   return <div className="alert alert-info text-center mt-3">⏰ {timeLeft}</div>;
// }

// // Main Component
// function Subscription() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const userId = user?.id;

//   const [isPremium, setIsPremium] = useState(false);
//   const [expiryDate, setExpiryDate] = useState(null);
//   const [history, setHistory] = useState([]);

//   const plans = [
//     { name: "Weekly", days: 7, amount: 99 },
//     { name: "Monthly", days: 30, amount: 299 },
//     { name: "Yearly", days: 365, amount: 999 },
//   ];

//   useEffect(() => {
//     if (userId) fetchSubscription();
//   }, []);

//   const fetchSubscription = async () => {
//     try {
//       const res = await axios.get(`http://localhost:8000/orders?userId=${userId}`);
//       const allOrders = res.data || [];
//       setHistory(allOrders);

//       const active = allOrders.find((order) => new Date(order.expiryDate) > new Date());
//       if (active) {
//         setIsPremium(true);
//         setExpiryDate(active.expiryDate);
//       } else {
//         setIsPremium(false);
//         setExpiryDate(null);
//       }
//     } catch (err) {
//       console.error("Error fetching subscriptions:", err);
//     }
//   };

//   const handleMockPayment = async (plan) => {
//     const now = new Date();
//     const expiry = new Date();
//     expiry.setDate(now.getDate() + plan.days);

//     const order = {
//       // userId, // for db.json
//       user: user.id,  // for django
//       name: `${plan.name} Subscription`,
//       amount: plan.amount,
//       plan: plan.name.toLowerCase(),
//       status: "active",
//       startDate: now.toISOString(),
//       expiryDate: expiry.toISOString(),
//       transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
//     };
// console.log("🧾 Order object:", order);

//     try {
//       const res = await axios.post("http://localhost:8000/orders/", order);
//       if (res.status === 201) {
//         alert(`✅ ${plan.name} plan activated successfully!`);
//         fetchSubscription(); // refresh
//       }
//     } catch (err) {
//       alert("❌ Failed to create subscription.");
//     }
//   };

//   if (!userId) {
//     return <div className="text-center mt-4 text-danger">⚠️ Please log in to buy a subscription</div>;
//   }

//   return (
//     <div className="container my-5">
//       <h2 className="text-center mb-4">💳 Premium Subscription Plans</h2>

//       {isPremium ? (
//         <>
// <div className="alert alert-success text-center">
//   ✅ You are a premium user!<br />
//   🗓️ Subscription valid till: <strong>{new Date(expiryDate).toLocaleDateString()}</strong>
// </div>

//           <CountdownTimer expiryDate={expiryDate} />
//         </>
//       ) : (
//         <div className="row justify-content-center">
//           {plans.map((plan) => (
//             <div className="col-md-3" key={plan.name}>
//               <div className="card text-center shadow-sm mb-4">
//                 <div className="card-body">
//                   <h5 className="card-title">{plan.name}</h5>
//                   <p className="card-text">₹{plan.amount}</p>
//                   <button
//                     className="btn btn-success"
//                     onClick={() => handleMockPayment(plan)}
//                   >
//                     Buy {plan.name}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Transaction History */}
//       <div className="mt-5">
//         <h4>📜 Subscription History</h4>
//         <ul className="list-group">
//           {history.length === 0 ? (
//             <li className="list-group-item">No transactions found.</li>
//           ) : (
//             history.map((h, i) => (
//               <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
//                 <div>
//                   <strong>{h.plan.toUpperCase()}</strong> | ₹{h.amount} |{" "}
//                   {new Date(h.startDate).toLocaleDateString()} to{" "}
//                   {new Date(h.expiryDate).toLocaleDateString()}
//                 </div>
//                 <div className="text-muted small">Txn ID: {h.transactionId}</div>
//               </li>
//             ))
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default Subscription;
