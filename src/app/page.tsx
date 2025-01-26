"use client";

import Image from "next/image";
import hero from "../../public/landingPage-new.png";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Main() {
  return (
    <div className="h-screen w-screen flex justify-between items-center bg-white px-36">
      <div className="flex flex-col  gap-4">
        <div className="text-7xl font-bold text-slate-700 w-[600px]">
          Welcome to the Ai Learning Platform
        </div>
        <div className="text-2xl font-semibold text-slate-600 w-[600px]">
          Study smarter, not harder: Chat with your notes and prove your
          knowledge through AI-guided exams
        </div>
        <Link href="/auth">
          <button className="flex items-center gap-2 bg-slate-700 text-white px-6 py-3 rounded-full text-xl font-semibold mt-4 w-fit group hover:bg-slate-800 transition-all">
            Let&apos;s Start
            <ArrowRightIcon className="w-5 h-5 animate-[arrow-move_1s_ease-in-out_infinite] group-hover:animate-none transition-transform group-hover:translate-x-1" />
          </button>
        </Link>
      </div>
      <div>
        <Image src={hero} alt="Hero Image" width={700} height={700} priority />
      </div>
    </div>
  );
}
