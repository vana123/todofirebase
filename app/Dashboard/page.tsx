"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthContext } from "@/contexts/AuthContext";
import { auth } from "@/firebase/config";
import { db } from "@/firebase/config";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
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
        where("viewers", "array-contains", user.email)
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

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цей To-Do?")) {
      return;
    }
    try {
      await deleteDoc(doc(db, "todos", id));
      console.log("To-Do видалено");
    } catch (error) {
      console.error("Помилка видалення:", error);
    }
  };


  return (
    <div>
      <nav className="flex between items-center justify-between p-4 bg-gray-800 text-white">
        <h1>Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="">
            <Link href="/todo/new">
              <button className="p-2 bg-blue-500 text-white rounded">
                Створити нове To-Do
              </button>
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 bg-red-500 text-white rounded pointer"
          >
            Вийти з акаунту
          </button>

        </div>
      </nav>

      <h2 className="text-lg font-semibold mt-4">To-Do (Admin)</h2>
      {adminTodos.length === 0 ? (
        <p>Немає To-Do, створених вами як Admin.</p>
      ) : (
        <div className="grid grid-cols-auto gap-4 mt-4 p-4">
          {adminTodos.map((todo) => (
            <div key={todo.id} className="border rounded-2xl p-2 m-2 max-w-2xl">
              <Link href={`/todo/${todo.id}`} className="hover:underline">
                {todo.title}
              </Link>
              <button
                onClick={() => handleDelete(todo.id)}
                className="mt-2 p-1 bg-red-500 text-white rounded text-xs"
              >
                Видалити
              </button>
              <p className="text-xs text-gray-400">{todo.description}</p>
              {todo.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center p-1">
                  <div>
                    <p className="text-xs font-medium">{item.title}</p>
                  </div>
                  <div className="flex justify-end">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      className="h-4 w-4"
                      readOnly
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <h2 className="text-lg font-semibold mt-4">To-Do (Viewer)</h2>
      {viewerTodos.length === 0 ? (
        <p>Немає To-Do, створених вами як Admin.</p>
      ) : (
        <div className="grid grid-cols-auto gap-4 mt-4 p-4">
          {viewerTodos.map((todo) => (
            <div key={todo.id} className="border rounded-2xl p-2 m-2 max-w-2xl">
              <Link href={`/todo/${todo.id}`} className="hover:underline">
                {todo.title}
              </Link>
              <p className="text-xs text-gray-400">{todo.description}</p>
              {todo.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center p-1">
                  <div>
                    <p className="text-xs font-medium">{item.title}</p>
                  </div>
                  <div className="flex justify-end">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      className="h-4 w-4"
                      readOnly
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
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
