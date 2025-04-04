"use client";

import { useState } from "react";
import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Успішний вхід!");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded"
      />
      <button type="submit" className="p-2 bg-green-500 text-white rounded">
        Увійти
      </button>
      {error && <p className="text-red-500">{error}</p>}
      <div className="text-center mt-4">
        <p>
          Немає акаунта?{" "}
          <Link href="/Register" className="text-blue-500 hover:underline">
            Зареєструватися
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
