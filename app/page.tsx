import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { AuthProvider } from "@/contexts/AuthContext";
import Image from "next/image";

export default function Home() {
  return (
    <AuthProvider>
      <div className="grid place-items-center h-screen">
        <RegisterForm />
        <LoginForm />
      </div>
    </AuthProvider>
  );
}
