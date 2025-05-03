// "use client"
import Image from "next/image";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { getSession } from "./authentication";
import { useRouter } from 'next/navigation';

export default async function Home() {
  // const router = useRouter();
  const session = await getSession();

  return (
    <div className="flex items-center justify-center grow ">

      <div className="text-center flex flex-col gap-5">
        <p className="text-2xl md:text-3xl lg:text-5xl text-primary">Welcome to Fixora!</p>
        <p className="text-base md:text-xl lg:text-2xl text-ring">All your tech issues, tamed.</p>
        {
          (session === null) ? (
            <Link href = "/login">
              <Button className="hover:cursor-pointer">Log in <FiArrowRight/></Button>
            </Link>
          ) : (
            (session.user.role === "USER") ? (
              <Link href = "/tickets">
                <Button className="hover:cursor-pointer">View your tickets <FiArrowRight/></Button>
              </Link>
            ) : (
              <Link href = "/admin">
                <Button className="hover:cursor-pointer">Go to Dashboard <FiArrowRight/></Button>
              </Link>
            )
          )

        }
        

      </div>

    </div>
  );
}
