"use client";

import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { AuthContext, AuthProvider } from "@/contexts/AuthContext";
import {useRouter} from "next/navigation";
import { useContext, useEffect } from "react";

export default function Home() {
  return (
    <>
      <HomeContent />
    </>
  );
}

function HomeContent() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  
   useEffect(() => {
      console.log("User:", user);
      console.log("Loading:", loading);
      if (!loading && user) {
        router.push("/Dashboard");
      }
    }, [user, loading, router]);

  return (
    <div className="grid place-items-center h-screen">
      <RegisterForm />
      <LoginForm />
    </div>
  );
}
