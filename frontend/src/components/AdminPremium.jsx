import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPremium() {
  const [orders, setOrders] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPremiumData();
  }, []);

  const fetchPremiumData = async () => {
    setLoading(true);
    try {
      const ordersRes = await axios.get("http://localhost:8000/orders/?status=active/");
      setOrders(ordersRes.data);

      const usersRes = await axios.get("http://localhost:8000/users/");
      const userMap = {};
      usersRes.data.forEach((user) => {
        userMap[user.id] = user;
      });
      setUsersMap(userMap);
    } catch (err) {
      console.error("Error fetching premium data:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

  const breakdown = orders.reduce((acc, order) => {
    acc[order.plan] = (acc[order.plan] || 0) + order.amount;
    return acc;
  }, {});

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">💼 Admin Premium Dashboard</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card bg-success text-white p-3">
                <h5>Total Revenue</h5>
                <h3>₹{totalRevenue}</h3>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card p-3">
                <h5>Plan Breakdown</h5>
                <ul className="list-group">
                  {["weekly", "monthly", "yearly"].map((plan) => (
                    <li key={plan} className="list-group-item d-flex justify-content-between">
                      <span className="text-capitalize">{plan}</span>
                      <strong>₹{breakdown[plan] || 0}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">🧑‍💼 Active Subscribers</div>
            <div className="table-responsive">
              <table className="table table-bordered mb-0">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Amount (₹)</th>
                    <th>Start Date</th>
                    <th>Expiry Date</th>
                    <th>Transaction Id</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
orders.map((order) => {
  const user = usersMap[order.user] || {}; // use userId
  // const user = usersMap[order.userId] || {}; // use userId
  return (
    <tr key={order.id}>
      <td>
        {user.name || "Unknown"}
        <br />
        <small className="text-muted">{user.email}</small>
      </td>
      <td className="text-capitalize">{order.plan}</td>
      <td>{order.amount}</td>
      <td>{new Date(order.startDate).toLocaleDateString()}</td>
      <td>{new Date(order.expiryDate).toLocaleDateString()}</td>
      <td>{order.transactionId}</td>
    </tr>
  );
})

                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-danger">
                        No active subscriptions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminPremium;
