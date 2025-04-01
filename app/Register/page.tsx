"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import RegisterForm from "@/components/RegisterForm";

const RegisterPage = () => {
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

  return <RegisterForm />;
};

export default RegisterPage;
