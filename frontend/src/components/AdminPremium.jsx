import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

function AdminPremium() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPremiumData();
  }, []);

  const fetchPremiumData = async () => {
    setLoading(true);
    try {
      const [ordersRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/orders/`),
        axios.get(`${API_BASE_URL}/users/`)
      ]);
      setOrders(ordersRes.data || []);
      setUsers(usersRes.data || []);
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

  const getActiveOrderForUser = (userId) => {
    const userOrders = orders.filter(
      (order) => order.user === userId && new Date(order.expiryDate) > new Date()
    );
    return userOrders.length > 0
      ? userOrders.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0]
      : null;
  };

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
            <div className="card-header bg-dark text-white">🧑‍💼 All Users & Subscriptions</div>
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
                  {users.filter(user => user.role === "employer").length > 0 ? (
                    users
                      .filter(user => user.role === "employer")
                      .map((user) => {
                        const order = getActiveOrderForUser(user.id);
                        return (
                          <tr key={user.id}>
                            <td>
                              {user.name}
                              <br />
                              <small className="text-muted">{user.email}</small>
                            </td>
                            <td className="text-capitalize">{order?.plan || "N/A"}</td>
                            <td>{order?.amount || "—"}</td>
                            <td>{order ? new Date(order.startDate).toLocaleDateString() : "—"}</td>
                            <td>{order ? new Date(order.expiryDate).toLocaleDateString() : "—"}</td>
                            <td>{order?.transactionId || "—"}</td>
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-danger">
                        No employers found.
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
