"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Ви вийшли з акаунту");
      router.push("/login");
    } catch (error) {
      console.error("Помилка виходу:", error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Ласкаво просимо у ваш особистий кабінет!</p>
      <button
        onClick={handleLogout}
        className="mt-4 p-2 bg-red-500 text-white rounded"
      >
        Вийти з акаунту
      </button>
    </div>
  );
};

const DashboardPage = () => (
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
);

export default DashboardPage;
