"use client";

import Navbar from "../components/Navbar";
import ProgramacaoLinear from "../components/ProgramacaoLinear";
import SimplexMethod from "../components/SimplexMethod";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Problema2() {
  // Problema de Organização de Turnos de Médicos
  const titulo = "Organização de Turnos de Médicos";
  const descricao =
    "O hospital precisa organizar turnos de médicos para três setores (Pronto Atendimento, UTI e Clínica Geral) minimizando os custos totais.";

  const variaveis = [
    { nome: "x₁", descricao: "Médicos no turno da manhã", valor: 0 },
    { nome: "x₂", descricao: "Médicos no turno da tarde", valor: 0 },
    { nome: "x₃", descricao: "Médicos no turno da noite", valor: 0 },
  ];

  const restricoes = [
    {
      coeficientes: [20, 15, 10],
      tipo: ">=" as const,
      valorLimite: 240,
      descricao: "Mínimo de horas para o Pronto Atendimento",
    },
    {
      coeficientes: [10, 20, 15],
      tipo: ">=" as const,
      valorLimite: 320,
      descricao: "Mínimo de horas para a UTI",
    },
    {
      coeficientes: [10, 5, 15],
      tipo: ">=" as const,
      valorLimite: 200,
      descricao: "Mínimo de horas para a Clínica Geral",
    },
  ];

  const funcaoObjetivo = {
    coeficientes: [4000, 4500, 5000],
    tipo: "min" as const,
    descricao: "Minimizar o custo total com médicos (R$)",
  };

  const resultadoOtimo = {
    valoresOtimos: [8, 12, 4],
    valorFuncaoObjetivo: 106000,
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
