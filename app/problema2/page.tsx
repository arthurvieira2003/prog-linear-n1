"use client";

import Navbar from "../components/Navbar";
import SimplexMethod from "../components/SimplexMethod";

export default function Problema2() {
  // Problema de Organização de Turnos de Médicos
  const titulo = "Organização de Turnos de Médicos";
  const descricao =
    "O hospital precisa organizar turnos de médicos para três setores (Pronto Atendimento, UTI e Clínica Geral) minimizando os custos totais.";

  const variaveis = [
    {
      nome: "x₁",
      descricao: "Médicos no turno da manhã",
      valor: 0,
      detalhes:
        "Quantidade de médicos contratados para o turno da manhã. Custo: R$4000 por médico. Cada médico contribui com 20h no PA, 10h na UTI e 10h na Clínica Geral.",
    },
    {
      nome: "x₂",
      descricao: "Médicos no turno da tarde",
      valor: 0,
      detalhes:
        "Quantidade de médicos contratados para o turno da tarde. Custo: R$4500 por médico. Cada médico contribui com 15h no PA, 20h na UTI e 5h na Clínica Geral.",
    },
    {
      nome: "x₃",
      descricao: "Médicos no turno da noite",
      valor: 0,
      detalhes:
        "Quantidade de médicos contratados para o turno da noite. Custo: R$5000 por médico. Cada médico contribui com 10h no PA, 15h na UTI e 15h na Clínica Geral.",
    },
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
    valoresOtimos: [1, 8, 10],
    valorFuncaoObjetivo: 90000,
  };

  return (
    <main>
      <Navbar />
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-white text-xl font-semibold">
            Problema 2: {titulo}
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
