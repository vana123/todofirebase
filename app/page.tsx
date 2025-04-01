"use client";

import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { AuthContext, AuthProvider } from "@/contexts/AuthContext";
import { useContext } from "react";

export default function Home() {
  return (
    <>
      <HomeContent />
    </>
  );
}

function HomeContent() {
  const { user, loading } = useContext(AuthContext);

  return (
    <div className="grid place-items-center h-screen">
      <RegisterForm />
      <LoginForm />
      <button onClick={() => console.log(user, loading)}>test</button>
    </div>
  );
}
