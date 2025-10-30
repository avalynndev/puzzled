"use client";

import { motion } from "motion/react";
import { Indie_Flower } from "next/font/google";

const indieFlower = Indie_Flower({ subsets: ["latin"], weight: "400" });

export function Hero() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <motion.div
        className={`mx-auto flex max-w-3xl items-center justify-center rounded-2xl bg-muted/30 p-6 text-6xl sm:text-7xl pb-6 ${indieFlower.className} border dark:border-none`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        PUZZLED
      </motion.div>

      <motion.p
        className="mx-auto mt-6 max-w-2xl text-balance text-muted-foreground sm:text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        a tiny website by{" "}
        <span className="font-medium text-foreground">avalynndev</span>
      </motion.p>
    </section>
  );
}
