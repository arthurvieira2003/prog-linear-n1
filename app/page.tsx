"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const problemCards = [
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
          className="relative w-32 h-32"
        >
          <div className="absolute top-0 left-1/2 w-6 h-6 bg-primary-500 rounded-full transform -translate-x-1/2"></div>
          <div className="absolute top-1/2 right-0 w-6 h-6 bg-primary-600 rounded-full transform -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-6 h-6 bg-primary-700 rounded-full transform -translate-x-1/2"></div>
          <div className="absolute top-1/2 left-0 w-6 h-6 bg-primary-800 rounded-full transform -translate-y-1/2"></div>
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
          className="grid grid-cols-3 gap-2"
        >
          <div className="h-8 w-8 bg-secondary-400 rounded"></div>
          <div className="h-16 w-8 bg-secondary-500 rounded"></div>
          <div className="h-12 w-8 bg-secondary-600 rounded"></div>
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
          className="flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, delay: 0, repeat: Infinity }}
            className="w-8 h-8 bg-yellow-500 rounded-full"
          ></motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
            className="w-8 h-8 bg-green-500 rounded-full"
          ></motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, delay: 0.4, repeat: Infinity }}
            className="w-8 h-8 bg-red-500 rounded-full"
          ></motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, delay: 0.6, repeat: Infinity }}
            className="w-8 h-8 bg-blue-500 rounded-full"
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
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Partículas de fundo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary-300 opacity-30"
            initial={{
              width: Math.random() * 20 + 10,
              height: Math.random() * 20 + 10,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Header com animação de entrada */}
      <header className="relative overflow-hidden py-20 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-secondary-600/90 skew-y-[-2deg] transform origin-top-right"></div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-white">
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
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Uma abordagem matemática poderosa para otimização de recursos e
              tomada de decisões
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-10"
            >
              <motion.a
                href="#casos"
                className="bg-white text-primary-600 px-8 py-3 rounded-full font-medium text-lg inline-flex items-center shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Explorar Casos
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Apresentação dos problemas */}
      <section id="casos" className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-display font-bold mb-4 text-center text-gray-800"
            >
              Casos Práticos
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto"
            >
              Explore exemplos reais onde a programação linear pode ser aplicada
              para encontrar soluções ótimas para problemas complexos.
            </motion.p>

            {/* Cards dos problemas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {problemCards.map((card, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    y: -10,
                    transition: { duration: 0.3 },
                  }}
                  className={`card relative overflow-hidden ${
                    activeIndex === index
                      ? "ring-4 ring-offset-4 ring-primary-400/50"
                      : ""
                  }`}
                >
                  {/* Indicador de ativo */}
                  {activeIndex === index && (
                    <motion.div
                      className="absolute inset-0 border-4 border-primary-400 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {/* Background gradiente */}
                  <div
                    className={`absolute inset-0 opacity-5 bg-gradient-to-br ${
                      card.color === "primary"
                        ? "from-primary-300 to-primary-600"
                        : "from-secondary-300 to-secondary-600"
                    }`}
                  />

                  {/* Círculo decorativo */}
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gray-100 opacity-10" />

                  {/* Conteúdo do card */}
                  <div className="relative z-10">
                    <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg flex items-center justify-center mb-6 overflow-hidden">
                      {card.icon}
                    </div>

                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    <p className="text-gray-600 mb-6 h-20">
                      {card.description}
                    </p>

                    <Link href={card.href}>
                      <motion.span
                        className={`btn ${
                          card.color === "primary"
                            ? "btn-primary"
                            : "btn-secondary"
                        } inline-flex items-center`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Explorar
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
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

      {/* Seção sobre programação linear */}
      <section className="py-16 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-display font-bold mb-8 text-center">
              O que é Programação Linear?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-primary-500 rounded-lg mb-4 flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Otimização</h3>
                <p className="text-gray-300">
                  Maximiza ou minimiza uma função objetivo linear sujeita a
                  restrições lineares.
                </p>
              </motion.div>

              <motion.div
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-secondary-500 rounded-lg mb-4 flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Restrições</h3>
                <p className="text-gray-300">
                  Limitações representadas por desigualdades ou igualdades
                  lineares que a solução deve satisfazer.
                </p>
              </motion.div>

              <motion.div
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-primary-500 rounded-lg mb-4 flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Aplicações</h3>
                <p className="text-gray-300">
                  Amplamente usada em logística, finanças, produção industrial,
                  transportes e alocação de recursos.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-2xl font-display font-semibold mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Apresentação sobre Programação Linear
            </motion.h2>

            <motion.p
              className="text-gray-400 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Criado para demonstrar aplicações práticas de otimização
              matemática em problemas reais
            </motion.p>

            <motion.div
              className="flex justify-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              {problemCards.map((card, index) => (
                <Link key={index} href={card.href}>
                  <motion.span
                    className="text-gray-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    {card.title}
                  </motion.span>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </footer>
    </main>
  );
}
