"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

// Definir a interface para as partículas
interface Particle {
  id: number;
  width: number;
  height: number;
  top: string;
  left: string;
  topEnd: string;
  leftEnd: string;
  duration: number;
}

// Definir a interface para os cards de problemas
interface ProblemCard {
  title: string;
  description: string;
  href: string;
  color: "primary" | "secondary";
  icon: React.ReactNode;
}

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setIsLoaded(true);

    // Gerar partículas aleatórias apenas no lado do cliente
    const generateParticles = () => {
      const particlesArray: Particle[] = [];
      for (let i = 0; i < 10; i++) {
        particlesArray.push({
          id: i,
          width: Math.random() * 15 + 5,
          height: Math.random() * 15 + 5,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          topEnd: `${Math.random() * 100}%`,
          leftEnd: `${Math.random() * 100}%`,
          duration: Math.random() * 15 + 15,
        });
      }
      setParticles(particlesArray);
    };

    generateParticles();

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const problemCards: ProblemCard[] = [
    {
      title: "Campanha de Vacinação",
      description:
        "Distribuição otimizada de postos móveis para maximizar a quantidade de pessoas vacinadas",
      href: "/problema1",
      color: "primary",
      icon: (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="relative w-24 h-24"
        >
          <div className="absolute top-0 left-1/2 w-5 h-5 bg-primary-500 rounded-full transform -translate-x-1/2"></div>
          <div className="absolute top-1/2 right-0 w-5 h-5 bg-primary-600 rounded-full transform -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-5 h-5 bg-primary-700 rounded-full transform -translate-x-1/2"></div>
          <div className="absolute top-1/2 left-0 w-5 h-5 bg-primary-800 rounded-full transform -translate-y-1/2"></div>
        </motion.div>
      ),
    },
    {
      title: "Turnos de Médicos",
      description:
        "Organização de turnos para minimizar custos e atender às necessidades de diferentes setores",
      href: "/problema2",
      color: "secondary",
      icon: (
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="grid grid-cols-3 gap-1"
        >
          <div className="h-7 w-7 bg-secondary-400 rounded"></div>
          <div className="h-14 w-7 bg-secondary-500 rounded"></div>
          <div className="h-10 w-7 bg-secondary-600 rounded"></div>
        </motion.div>
      ),
    },
    {
      title: "Plano Alimentar",
      description:
        "Criação de dieta balanceada de menor custo para ganho de massa muscular",
      href: "/problema3",
      color: "primary",
      icon: (
        <motion.div
          className="flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.5, delay: 0, repeat: Infinity }}
            className="w-7 h-7 bg-yellow-500 rounded-full"
          ></motion.div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
            className="w-7 h-7 bg-green-500 rounded-full"
          ></motion.div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.5, delay: 0.4, repeat: Infinity }}
            className="w-7 h-7 bg-red-500 rounded-full"
          ></motion.div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.5, delay: 0.6, repeat: Infinity }}
            className="w-7 h-7 bg-blue-500 rounded-full"
          ></motion.div>
        </motion.div>
      ),
    },
  ];

  // Variantes para animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Partículas de fundo (geradas apenas no cliente) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {isLoaded &&
          particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-primary-300 opacity-30"
              initial={{
                width: particle.width,
                height: particle.height,
                top: particle.top,
                left: particle.left,
              }}
              animate={{
                top: [particle.top, particle.topEnd],
                left: [particle.left, particle.leftEnd],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
      </div>

      <div className="flex flex-col md:flex-row h-screen">
        {/* Header lateral (40% da tela) */}
        <header className="relative w-full md:w-5/12 md:h-screen py-10 md:py-0 flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-secondary-600/90"></div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl mx-auto md:mx-0 text-center md:text-left"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">
                <span className="relative">
                  <span className="relative z-10">Programação Linear</span>
                  <motion.span
                    className="absolute bottom-1 left-0 right-0 h-3 bg-secondary-400/30 z-0 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </span>
              </h1>
              <motion.p
                className="text-lg md:text-xl text-white/90 max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Otimização matemática para solução de problemas complexos com o
                método Simplex
              </motion.p>
            </motion.div>
          </div>
        </header>

        {/* Seção de cards (60% da tela) */}
        <section className="w-full md:w-7/12 md:h-screen flex items-center py-10 md:py-0">
          <div className="container mx-auto px-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-3xl mx-auto"
            >
              <motion.h2
                variants={itemVariants}
                className="text-2xl md:text-3xl font-display font-bold mb-3 text-center md:text-left text-gray-800"
              >
                Casos Práticos
              </motion.h2>

              {/* Cards dos problemas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {problemCards.map((card, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{
                      y: -5,
                      transition: { duration: 0.2 },
                    }}
                    className={`card bg-white shadow-md rounded-xl overflow-hidden ${
                      activeIndex === index ? "ring-2 ring-primary-400/80" : ""
                    }`}
                  >
                    {/* Conteúdo do card */}
                    <div className="relative z-10 p-5 flex flex-col h-full">
                      <div className="h-28 flex items-center justify-center mb-4">
                        {card.icon}
                      </div>

                      <h3 className="text-lg font-semibold mb-2">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 mb-6 text-sm flex-grow">
                        {card.description}
                      </p>

                      <Link href={card.href} className="mt-auto">
                        <motion.span
                          className={`inline-flex items-center px-4 py-2 rounded-lg text-white
                            ${
                              card.color === "primary"
                                ? "bg-primary-600 hover:bg-primary-700"
                                : "bg-secondary-600 hover:bg-secondary-700"
                            }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Explorar
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.span>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
