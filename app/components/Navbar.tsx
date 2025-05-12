"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Início" },
    { href: "/problema1", label: "Problema 1" },
    { href: "/problema2", label: "Problema 2" },
    { href: "/problema3", label: "Problema 3" },
  ];

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link
            href="/"
            className="flex items-center text-2xl font-display font-bold text-primary-600 mb-4 md:mb-0"
          >
            <div className="w-14 h-14 mr-3 flex-shrink-0">
              <img
                src="/assets/catolica-logo.svg"
                alt="Logo da Católica"
                className="w-full h-full"
                style={{
                  filter:
                    "invert(22%) sepia(12%) saturate(6308%) hue-rotate(327deg) brightness(83%) contrast(85%)",
                }}
              />
            </div>
            <span>Programação Linear</span>
          </Link>

          <ul className="flex space-x-8">
            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative font-medium ${
                      isActive
                        ? "text-primary-600"
                        : "text-gray-600 hover:text-primary-500"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute left-0 right-0 bottom-[-6px] h-1 bg-primary-600 rounded-full"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
