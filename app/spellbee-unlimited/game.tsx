"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { geistSans } from "@/lib/fonts";
import SpellBeeUnlimited from "@/components/spellbee-unlimited";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function GamePage() {
  return (
    <motion.main
      className={`${geistSans.className} mx-auto flex max-w-4xl flex-col items-center px-4 pt-10`}
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
    >
      <motion.div className="mb-6" variants={fadeInUp}>
        <Link href="/">
          <Button variant="link">← Back Home</Button>
        </Link>
      </motion.div>
      <motion.main
        className="w-full rounded-t-lg border p-4 py-6 shadow-lg sm:py-12 relative"
        variants={fadeInUp}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-md bg-yellow-400 px-3 py-1 text-xs font-bold text-black shadow-md">
          UNLIMITED
        </div>
        <div className="text-center">
          <motion.h2
            className="text-2xl font-bold sm:text-3xl"
            variants={fadeInUp}
          >
            Spell Bee
          </motion.h2>
          <motion.p className="mt-2 text-sm text-gray-500" variants={fadeInUp}>
            Make as many words as you can using the letters provided with
            unlimited play
          </motion.p>
        </div>
      </motion.main>
      <div className="py-16">
        <SpellBeeUnlimited />
      </div>
    </motion.main>
  );
}
