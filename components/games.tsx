"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { LockIcon } from "lucide-react";

import { games } from "@/data/games";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Games() {
  return (
    <>
      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 md:px-24 md:grid-cols-2 lg:px-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {games.map((element, index) => (
          <motion.div key={index} variants={itemVariants}>
            {!element.isDisabled ? (
              <Link href={`/${element.id}`}>
                <motion.div
                  className="border border-border md:border-none group relative flex h-48 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-card shadow-sm transition-all duration-300 hover:shadow-md"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Image
                    src={element.backgroundUrl}
                    alt={element.title}
                    height={200}
                    width={400}
                    className="max-h-full max-w-full object-contain transition-opacity duration-300 group-hover:opacity-90"
                  />
                  <div className="absolute bottom-3 md:hidden lg:block left-3 rounded-md bg-background/80 px-2 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
                    {element.title}
                  </div>
                </motion.div>
              </Link>
            ) : (
              <motion.div className="cursor-not-allowed opacity-50 border border-border md:border-none relative flex h-48 items-center justify-center overflow-hidden rounded-lg bg-card shadow-sm">
                <Image
                  src={element.backgroundUrl}
                  alt={element.title}
                  height={200}
                  width={400}
                  className="max-h-full max-w-full object-contain"
                />
                <div className="absolute bottom-3 md:hidden lg:block left-3 rounded-md bg-background/80 px-2 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
                  {element.title}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-xs">
                  <LockIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
