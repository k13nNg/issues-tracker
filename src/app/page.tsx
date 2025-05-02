"use client"
import Image from "next/image";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center grow ">

      <div className="text-center flex flex-col gap-5">
        <p className="text-2xl md:text-3xl lg:text-5xl text-primary">Welcome to Fixora!</p>
        <p className="text-base md:text-xl lg:text-2xl text-ring">All your tech issues, tamed.</p>
        <div>
          <Button className="hover:cursor-pointer" onClick={() => router.push('/login')}>Log in <FiArrowRight/></Button>
        </div>
      </div>

    </div>
  );
}
