// app/components/LogoutButton.tsx
"use client";

import { logout } from "@/app/authentication";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return <Button className="hover:cursor-pointer" onClick={handleLogout}>Logout</Button>;
}
