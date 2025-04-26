"use client";

import Navbar from "../components/Navbar";
import SimplexMethod from "../components/SimplexMethod";

export default function Problema3() {
  // Problema do Plano Alimentar
  const titulo = "Plano Alimentar Balanceado";
  const descricao =
    "Uma nutricionista deseja montar um plano alimentar diário balanceado para ganho de massa muscular com o menor custo possível.";

  const variaveis = [
    { nome: "x₁", descricao: "Porções de peito de frango", valor: 0 },
    { nome: "x₂", descricao: "Porções de arroz integral", valor: 0 },
    { nome: "x₃", descricao: "Porções de brócolis", valor: 0 },
    { nome: "x₄", descricao: "Porções de ovos", valor: 0 },
  ];

  const restricoes = [
    {
      coeficientes: [25, 3, 2, 6],
      tipo: ">=" as const,
      valorLimite: 150,
      descricao: "Mínimo de proteína (g)",
    },
    {
      coeficientes: [0, 22, 4, 1],
      tipo: ">=" as const,
      valorLimite: 100,
      descricao: "Mínimo de carboidrato (g)",
    },
    {
      coeficientes: [0, 22, 4, 1],
      tipo: "<=" as const,
      valorLimite: 200,
      descricao: "Máximo de carboidrato (g)",
    },
    {
      coeficientes: [3, 1, 0, 5],
      tipo: "<=" as const,
      valorLimite: 70,
      descricao: "Máximo de gordura (g)",
    },
    {
      coeficientes: [1, 1, 1, 1],
      tipo: "<=" as const,
      valorLimite: 15,
      descricao: "Máximo de porções totais",
    },
  ];

  const funcaoObjetivo = {
    coeficientes: [5, 2, 1.5, 1.8],
    tipo: "min" as const,
    descricao: "Minimizar o custo total da dieta (R$)",
  };

  const resultadoOtimo = {
    valoresOtimos: [6, 4.7, 0, 0.3],
    valorFuncaoObjetivo: 39.94,
  };

  return (
    <main>
      <Navbar />
      <div className="py-10">
        <div className="container mx-auto px-4">
          <SimplexMethod
            titulo={titulo}
            descricao={descricao}
            variaveis={variaveis}
            restricoes={restricoes}
            funcaoObjetivo={funcaoObjetivo}
            resultadoOtimo={resultadoOtimo}
          />
        </div>
      </div>
    </main>
  );
}
