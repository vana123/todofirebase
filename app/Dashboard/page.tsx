"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Ласкаво просимо у ваш особистий кабінет!</p>
    </div>
  );
};

const DashboardPage = () => (
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
);

export default DashboardPage;
