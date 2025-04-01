"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthContext } from "@/contexts/AuthContext";
import { auth } from "@/firebase/config";
import { db } from "@/firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Todo } from "@/interface/todoT";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [adminTodos, setAdminTodos] = useState<Todo[]>([]);
  const [viewerTodos, setViewerTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (!loading && user) {
      // Запит для документів, де ви є Admin
      const adminQuery = query(
        collection(db, "todos"),
        where("admin", "==", user.uid)
      );
      const unsubscribeAdmin = onSnapshot(adminQuery, (snapshot) => {
        const adminData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Todo[];
        setAdminTodos(adminData);
      });

      // Запит для документів, де вас є серед Viewer
      const viewerQuery = query(
        collection(db, "todos"),
        where("viewers", "array-contains", user.uid)
      );
      const unsubscribeViewer = onSnapshot(viewerQuery, (snapshot) => {
        const viewerData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Todo[];
        setViewerTodos(viewerData);
      });

      return () => {
        unsubscribeAdmin();
        unsubscribeViewer();
      };
    }

  }, [loading, user]);

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
      <nav className="flex between items-center justify-between p-4 bg-gray-800 text-white">
        <h1>Dashboard</h1>
        <button
          onClick={handleLogout}
          className="p-2 bg-red-500 text-white rounded pointer"
        >
          Вийти з акаунту
        </button>
      </nav>
      <h2 className="text-lg font-semibold mt-4">To-Do (Admin)</h2>
      {adminTodos.length === 0 ? (
        <p>Немає To-Do, створених вами як Admin.</p>
      ) : (
        <ul>
          {adminTodos.map((todo) => (
            <li key={todo.id} className="border p-2 my-2">
              {/* При кліку переходимо на сторінку редагування/перегляду */}
              <Link href={`/todo/${todo.id}`} className="hover:underline">
                {todo.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const DashboardPage = () => (
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
);

export default DashboardPage;
