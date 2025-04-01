"use client";

import EditToDo from "@/components/EditToDo";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewTodo() {
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
  return (<>
    <nav className="flex between items-center justify-between p-4 bg-gray-800 text-white">
      <Link href="/Dashboard">
        <h1>Dashboard</h1>
      </Link>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLogout}
          className="p-2 bg-red-500 text-white rounded pointer"
        >
          Вийти з акаунту
        </button>

      </div>
    </nav>
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <EditToDo />
    </div>
  </>
  );
}