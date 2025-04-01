"use client";

import { useState } from "react";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Оновлюємо профіль, додаючи ім'я користувача
      await updateProfile(userCredential.user, { displayName: name });
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Ім'я"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded"
      />
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
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Зареєструватися
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default RegisterForm;
