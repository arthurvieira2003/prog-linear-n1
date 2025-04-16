"use client";

import Navbar from "../components/Navbar";
import ProgramacaoLinear from "../components/ProgramacaoLinear";

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
    valoresOtimos: [5, 3, 3, 2],
    valorFuncaoObjetivo: 1470,
  };

  return (
    <main>
      <Navbar />
      <div className="py-10">
        <div className="container mx-auto px-4">
          <ProgramacaoLinear
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
