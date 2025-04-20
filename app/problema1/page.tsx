"use client";

import Navbar from "../components/Navbar";
import ProgramacaoLinear from "../components/ProgramacaoLinear";
import SimplexMethod from "../components/SimplexMethod";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Problema1() {
  // Problema da Campanha de Vacinação
  const titulo = "Campanha de Vacinação";
  const descricao =
    "A Secretaria de Saúde deseja maximizar o total de pessoas vacinadas por dia distribuindo postos móveis em quatro regiões da cidade.";

  const variaveis = [
    { nome: "x₁", descricao: "Postos na Região 1", valor: 0 },
    { nome: "x₂", descricao: "Postos na Região 2", valor: 0 },
    { nome: "x₃", descricao: "Postos na Região 3", valor: 0 },
    { nome: "x₄", descricao: "Postos na Região 4", valor: 0 },
  ];

  const restricoes = [
    {
      coeficientes: [4, 5, 8, 7],
      tipo: "<=" as const,
      valorLimite: 60,
      descricao: "Limite de profissionais disponíveis",
    },
    {
      coeficientes: [30, 25, 40, 20],
      tipo: "<=" as const,
      valorLimite: 500,
      descricao: "Limite de combustível disponível (litros)",
    },
    {
      coeficientes: [100, 80, 120, 60],
      tipo: "<=" as const,
      valorLimite: 1000,
      descricao: "Limite de kits de vacinação disponíveis",
    },
  ];

  const funcaoObjetivo = {
    coeficientes: [120, 100, 150, 90],
    tipo: "max" as const,
    descricao: "Maximizar o número total de pessoas vacinadas por dia",
  };

  const resultadoOtimo = {
    valoresOtimos: [7, 0, 0, 4],
    valorFuncaoObjetivo: 1200,
  };

  const [metodoAtivo, setMetodoAtivo] = useState<"grafico" | "simplex">(
    "grafico"
  );

  return (
    <main>
      <Navbar />
      <div className="py-10">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-center">
            <div className="bg-white rounded-full shadow-md inline-flex p-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMetodoAtivo("grafico")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  metodoAtivo === "grafico"
                    ? "bg-primary-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Método Gráfico
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMetodoAtivo("simplex")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  metodoAtivo === "simplex"
                    ? "bg-primary-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Método Simplex
              </motion.button>
            </div>
          </div>

          {metodoAtivo === "grafico" ? (
            <ProgramacaoLinear
              titulo={titulo}
              descricao={descricao}
              variaveis={variaveis}
              restricoes={restricoes}
              funcaoObjetivo={funcaoObjetivo}
              resultadoOtimo={resultadoOtimo}
            />
          ) : (
            <SimplexMethod
              titulo={titulo}
              descricao={descricao}
              variaveis={variaveis}
              restricoes={restricoes}
              funcaoObjetivo={funcaoObjetivo}
              resultadoOtimo={resultadoOtimo}
            />
          )}
        </div>
      </div>
    </main>
  );
}
