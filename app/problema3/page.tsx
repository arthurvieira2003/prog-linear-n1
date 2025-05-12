"use client";

import Navbar from "../components/Navbar";
import SimplexMethod from "../components/SimplexMethod";

export default function Problema3() {
  // Problema do Plano Alimentar
  const titulo = "Plano Alimentar Balanceado";
  const descricao =
    "Uma nutricionista deseja montar um plano alimentar diário balanceado para ganho de massa muscular com o menor custo possível.";

  const variaveis = [
    {
      nome: "x₁",
      descricao: "Porções de peito de frango",
      valor: 0,
      detalhes:
        "Quantidade de porções de peito de frango na dieta. Cada porção fornece 25g de proteína, 0g de carboidrato e 3g de gordura. Custo: R$5,00 por porção.",
    },
    {
      nome: "x₂",
      descricao: "Porções de arroz integral",
      valor: 0,
      detalhes:
        "Quantidade de porções de arroz integral na dieta. Cada porção fornece 3g de proteína, 22g de carboidrato e 1g de gordura. Custo: R$2,00 por porção.",
    },
    {
      nome: "x₃",
      descricao: "Porções de brócolis",
      valor: 0,
      detalhes:
        "Quantidade de porções de brócolis na dieta. Cada porção fornece 2g de proteína, 4g de carboidrato e 0g de gordura. Custo: R$1,50 por porção.",
    },
    {
      nome: "x₄",
      descricao: "Porções de ovos",
      valor: 0,
      detalhes:
        "Quantidade de porções de ovos na dieta. Cada porção fornece 6g de proteína, 1g de carboidrato e 5g de gordura. Custo: R$1,80 por porção.",
    },
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
    valoresOtimos: [5.45, 4.55, 0, 0],
    valorFuncaoObjetivo: 36.36,
  };

  return (
    <main>
      <Navbar />
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-white text-xl font-semibold">
            Problema 3: {titulo}
          </h1>
          <div className="flex items-center">
            <img
              src="/assets/catolica-logo.svg"
              alt="Logo da Católica"
              className="h-12 filter brightness-0 invert"
              style={{ maxWidth: "100%" }}
            />
          </div>
        </div>
      </div>
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
