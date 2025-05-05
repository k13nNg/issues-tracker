// app/components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginButton() {
  const router = useRouter();

  const handleLogout = async () => {
    router.push("/login");
  };

  return <Button className="hover:cursor-pointer" onClick={handleLogout}>Login</Button>;
}
