"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";

const LoginPage = () => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    console.log("User:", user);
    console.log("Loading:", loading);
    if (!loading && user) {
      router.push("/Dashboard");
    }
  }, [user, loading, router]);

  if (loading) return <p>Завантаження...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
