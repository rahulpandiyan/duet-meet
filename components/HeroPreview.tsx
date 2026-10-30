"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroPreview() {
  return (
    <motion.div
      className="relative w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xl bg-white group"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Image
        src="/hero-preview.webp"
        alt="Duet simultaneous multi-screen sharing preview"
        width={1672}
        height={941}
        priority
        unoptimized
        className="w-full h-auto object-cover block rounded-2xl"
      />
    </motion.div>
  );
}
