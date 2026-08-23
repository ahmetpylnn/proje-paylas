'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[68vh] flex items-center justify-center overflow-hidden border-b border-[var(--card-border)]">

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6 text-[var(--foreground)]"
        >
          Projelerimi keşfet.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[var(--muted)] text-lg leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Ahmet Paylan tarafından geliştirilen yazılım projelerini, deneysel çalışmaları ve kişisel projeleri keşfet.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-md transition-colors"
          >
            Projeleri Keşfet
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--card-bg)] hover:bg-[var(--elevated-bg)] text-[var(--foreground)] font-semibold rounded-md border border-[var(--card-border)] transition-colors"
          >
            Hakkımda
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
