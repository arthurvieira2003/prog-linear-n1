"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chart } from "react-chartjs-2";
import "chart.js/auto";

type Variavel = {
  nome: string;
  descricao: string;
  valor: number;
  cor?: string;
};

type Restricao = {
  coeficientes: number[];
  tipo: "<=" | ">=" | "=";
  valorLimite: number;
  descricao: string;
  cor?: string;
};

type FuncaoObjetivo = {
  coeficientes: number[];
  tipo: "max" | "min";
  descricao: string;
};

type ResultadoOtimizacao = {
  valoresOtimos: number[];
  valorFuncaoObjetivo: number;
};

type ProblemaProps = {
  titulo: string;
  descricao: string;
  variaveis: Variavel[];
  restricoes: Restricao[];
  funcaoObjetivo: FuncaoObjetivo;
  resultadoOtimo?: ResultadoOtimizacao;
};

// Cores para usar nas visualizações
const CORES = [
  "rgb(59, 130, 246)", // Azul
  "rgb(16, 185, 129)", // Verde
  "rgb(239, 68, 68)", // Vermelho
  "rgb(245, 158, 11)", // Amarelo
  "rgb(139, 92, 246)", // Roxo
  "rgb(236, 72, 153)", // Rosa
];

export default function ProgramacaoLinear({
  titulo,
  descricao,
  variaveis,
  restricoes,
  funcaoObjetivo,
  resultadoOtimo,
}: ProblemaProps) {
  // Estados
  const [mostrarModeloMatematico, setMostrarModeloMatematico] = useState(false);
  const [mostrarVisualizacao, setMostrarVisualizacao] = useState(false);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [valoresVariaveis, setValoresVariaveis] = useState<number[]>(
    variaveis.map(() => 0)
  );
  const [historico, setHistorico] = useState<
    { valores: number[]; objetivo: number }[]
  >([]);
  const [aba, setAba] = useState<"simulador" | "grafico" | "evolucao">(
    "simulador"
  );
  const [animationInProgress, setAnimationInProgress] = useState(false);

  // Refs
  const chartRef = useRef<any>(null);
  const chartEvolucaoRef = useRef<any>(null);
  const chartVariaveisRef = useRef<any>(null);

  // Atribuir cores às variáveis e restrições se não tiverem sido atribuídas
  useEffect(() => {
    variaveis.forEach((variavel, index) => {
      if (!variavel.cor) {
        variavel.cor = CORES[index % CORES.length];
      }
    });

    restricoes.forEach((restricao, index) => {
      if (!restricao.cor) {
        restricao.cor = CORES[(index + variaveis.length) % CORES.length];
      }
    });
  }, [variaveis, restricoes]);

  // Função para simular a busca gradual pela solução ótima
  const simularOtimizacao = () => {
    if (animationInProgress || !resultadoOtimo) return;

    setAnimationInProgress(true);
    setHistorico([]);

    // Valores iniciais aleatórios
    const iniciais = variaveis.map(() => Math.floor(Math.random() * 3));
    setValoresVariaveis(iniciais);

    const passos = 15; // Número de passos para a animação
    const historicoPontos: { valores: number[]; objetivo: number }[] = [
      {
        valores: [...iniciais],
        objetivo: calcularFuncaoObjetivo(iniciais),
      },
    ];

    // Simular passos de otimização
    let contador = 0;
    const intervalo = setInterval(() => {
      contador++;

      // Interpolar entre valores iniciais e ótimos
      const novoValores = variaveis.map((_, i) => {
        const inicial = iniciais[i];
        const otimo = resultadoOtimo.valoresOtimos[i];
        return inicial + (otimo - inicial) * (contador / passos);
      });

      setValoresVariaveis(novoValores.map((v) => Math.round(v * 10) / 10));
      historicoPontos.push({
        valores: [...novoValores],
        objetivo: calcularFuncaoObjetivo(novoValores),
      });
      setHistorico([...historicoPontos]);

      if (contador >= passos) {
        clearInterval(intervalo);
        setValoresVariaveis([...resultadoOtimo.valoresOtimos]);
        setAnimationInProgress(false);
      }
    }, 300);

    return () => clearInterval(intervalo);
  };

  // Função para atualizar o valor de uma variável
  const atualizarVariavel = (index: number, valor: number) => {
    const novosValores = [...valoresVariaveis];
    novosValores[index] = valor;
    setValoresVariaveis(novosValores);

    // Adicionar ao histórico
    setHistorico((prev) => [
      ...prev,
      {
        valores: [...novosValores],
        objetivo: calcularFuncaoObjetivo(novosValores),
      },
    ]);
  };

  // Função para verificar se os valores atuais satisfazem todas as restrições
  const verificarRestricoes = (valores = valoresVariaveis): boolean[] => {
    return restricoes.map((restricao) => {
      const valorCalculado = restricao.coeficientes.reduce(
        (sum, coef, index) => sum + coef * valores[index],
        0
      );

      if (restricao.tipo === "<=")
        return valorCalculado <= restricao.valorLimite;
      if (restricao.tipo === ">=")
        return valorCalculado >= restricao.valorLimite;
      return valorCalculado === restricao.valorLimite;
    });
  };

  // Função para calcular o valor da função objetivo com os valores fornecidos
  const calcularFuncaoObjetivo = (valores = valoresVariaveis): number => {
    return funcaoObjetivo.coeficientes.reduce(
      (sum, coef, index) => sum + coef * valores[index],
      0
    );
  };

  // Calcular o percentual de atendimento para cada restrição
  const calcularPercentualAtendimento = (
    valores = valoresVariaveis
  ): number[] => {
    return restricoes.map((restricao, index) => {
      const valorCalculado = restricao.coeficientes.reduce(
        (sum, coef, idx) => sum + coef * valores[idx],
        0
      );

      if (restricao.tipo === "<=") {
        // Para restrições <=, 100% quando valor == 0, 0% quando valor == limite*1.5
        return Math.max(
          0,
          Math.min(
            100,
            (1 - valorCalculado / (restricao.valorLimite * 1.5)) * 100
          )
        );
      } else if (restricao.tipo === ">=") {
        // Para restrições >=, 0% quando valor == 0, 100% quando valor >= limite
        return Math.min(100, (valorCalculado / restricao.valorLimite) * 100);
      } else {
        // Para restrições =, 100% quando igual, 0% quando difere em mais de 50%
        const diferenca = Math.abs(valorCalculado - restricao.valorLimite);
        const maxDiferenca = restricao.valorLimite * 0.5;
        return Math.max(0, Math.min(100, (1 - diferenca / maxDiferenca) * 100));
      }
    });
  };

  // Preparar os dados para o gráfico de radar
  const dadosRadar = {
    labels: restricoes.map((_, idx) => `Restrição ${idx + 1}`),
    datasets: [
      {
        label: "Atendimento",
        data: calcularPercentualAtendimento(),
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgb(59, 130, 246)",
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(59, 130, 246)",
      },
    ],
  };

  // Opções para o gráfico de radar
  const opcoesRadar: any = {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: function (value: any) {
            return value + "%";
          },
        },
        pointLabels: {
          font: {
            size: 12,
          },
        },
        angleLines: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return context.dataset.label + ": " + context.raw + "%";
          },
        },
      },
    },
  };

  // Preparar dados para o gráfico de evolução da função objetivo
  const dadosEvolucao = {
    labels: historico.map((_, idx) => (idx === 0 ? "Inicial" : `Passo ${idx}`)),
    datasets: [
      {
        label: `Evolução da Função Objetivo (${
          funcaoObjetivo.tipo === "max" ? "Maximização" : "Minimização"
        })`,
        data: historico.map((h) => h.objetivo),
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgb(59, 130, 246)",
        tension: 0.1,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Opções para o gráfico de evolução
  const opcoesEvolucao: any = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Evolução da Função Objetivo durante a Otimização`,
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Valor: ${context.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: funcaoObjetivo.tipo === "min",
        title: {
          display: true,
          text: "Valor da Função Objetivo",
        },
      },
      x: {
        title: {
          display: true,
          text: "Passos de Otimização",
        },
      },
    },
    animation: {
      duration: 1000,
    },
  };

  // Preparar dados para o gráfico de evolução das variáveis
  const dadosVariaveis = {
    labels: historico.map((_, idx) => (idx === 0 ? "Inicial" : `Passo ${idx}`)),
    datasets: variaveis.map((v, idx) => ({
      label: v.nome,
      data: historico.map((h) => h.valores[idx]),
      backgroundColor: (v.cor || CORES[idx % CORES.length])
        .replace("rgb", "rgba")
        .replace(")", ", 0.2)"),
      borderColor: v.cor || CORES[idx % CORES.length],
      tension: 0.1,
      pointRadius: 4,
      pointHoverRadius: 6,
    })),
  };

  // Opções para o gráfico de evolução das variáveis
  const opcoesVariaveis: any = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Evolução das Variáveis durante a Otimização",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Valores",
        },
      },
      x: {
        title: {
          display: true,
          text: "Passos de Otimização",
        },
      },
    },
    animation: {
      duration: 1000,
    },
  };

  // Cores para a região viável e inviável no gráfico 2D
  const corViavel = "rgba(16, 185, 129, 0.1)"; // Verde
  const corInviavel = "rgba(239, 68, 68, 0.05)"; // Vermelho

  // Tipos de variantes de animação para Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-xl overflow-hidden"
      >
        {/* Cabeçalho animado */}
        <div className="relative overflow-hidden pb-8">
          {/* Fundo colorido em ângulo */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 skew-y-[-3deg] transform origin-top-left translate-y-[-20%] h-[130%]"></div>

          {/* Conteúdo do cabeçalho */}
          <div className="relative px-8 py-6 text-white">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl md:text-4xl font-display font-bold"
            >
              {titulo}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-2 text-primary-100 max-w-3xl"
            >
              {descricao}
            </motion.p>

            {/* Indicadores de problema */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap gap-3 mt-4 relative z-20"
            >
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
                {variaveis.length} variáveis
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                {restricoes.length} restrições
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
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
                {funcaoObjetivo.tipo === "max" ? "Maximizar" : "Minimizar"}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Corpo */}
        <div className="p-8 relative z-10 bg-white">
          {/* Botões de ação com efeitos de hover e feedback visual */}
          <div className="flex flex-wrap gap-3 mb-8">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                setMostrarModeloMatematico(!mostrarModeloMatematico)
              }
              className={`btn px-4 py-2 rounded-md flex items-center space-x-2 ${
                mostrarModeloMatematico
                  ? "bg-gray-100 text-primary-600 border border-primary-200"
                  : "btn-primary"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                />
              </svg>
              <span>
                {mostrarModeloMatematico
                  ? "Ocultar Modelo"
                  : "Mostrar Modelo Matemático"}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMostrarVisualizacao(!mostrarVisualizacao)}
              className={`btn px-4 py-2 rounded-md flex items-center space-x-2 ${
                mostrarVisualizacao
                  ? "bg-gray-100 text-secondary-600 border border-secondary-200"
                  : "btn-secondary"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
              <span>
                {mostrarVisualizacao
                  ? "Ocultar Visualização"
                  : "Mostrar Simulador Interativo"}
              </span>
            </motion.button>

            {resultadoOtimo && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMostrarResultado(!mostrarResultado)}
                className={`btn px-4 py-2 rounded-md flex items-center space-x-2 ${
                  mostrarResultado
                    ? "bg-gray-100 text-green-600 border border-green-200"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {mostrarResultado
                    ? "Ocultar Resultado"
                    : "Mostrar Resultado Ótimo"}
                </span>
              </motion.button>
            )}

            {/* Botão para simular otimização */}
            {resultadoOtimo && mostrarVisualizacao && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={simularOtimizacao}
                disabled={animationInProgress}
                className={`btn px-4 py-2 rounded-md flex items-center space-x-2 ${
                  animationInProgress
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {animationInProgress ? "Simulando..." : "Simular Otimização"}
                </span>
              </motion.button>
            )}
          </div>

          {/* Modelo Matemático com animação de entrada/saída */}
          <AnimatePresence>
            {mostrarModeloMatematico && (
              <motion.div
                key="modelo"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mb-8"
              >
                <div className="bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-200">
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center mb-6"
                  >
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white mr-4">
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
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-display font-bold text-gray-800">
                      Modelo Matemático
                    </h2>
                  </motion.div>

                  {/* Função Objetivo */}
                  <motion.div variants={itemVariants} className="mb-8">
                    <h3 className="font-medium text-lg mb-3 text-gray-700">
                      Função Objetivo:
                    </h3>
                    <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                      <div className="flex items-center text-lg">
                        <span className="mr-2 font-semibold text-primary-600">
                          {funcaoObjetivo.tipo === "max"
                            ? "Maximizar"
                            : "Minimizar"}
                        </span>
                        <span className="mr-2">Z = </span>
                        {funcaoObjetivo.coeficientes.map((coef, index) => (
                          <motion.span
                            key={index}
                            className="inline-flex items-center mr-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                          >
                            {index > 0 && coef >= 0 && (
                              <span className="text-gray-500 mr-1">+</span>
                            )}
                            {index > 0 && coef < 0 && (
                              <span className="text-gray-500 mr-1">−</span>
                            )}
                            <span
                              className="font-medium"
                              style={{ color: variaveis[index].cor }}
                            >
                              {Math.abs(coef) !== 1 && Math.abs(coef)}
                              {coef !== 0 && (
                                <span className="ml-1">
                                  {variaveis[index].nome}
                                </span>
                              )}
                            </span>
                          </motion.span>
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm mt-2">
                        {funcaoObjetivo.descricao}
                      </p>
                    </div>
                  </motion.div>

                  {/* Restrições */}
                  <motion.div variants={itemVariants} className="mb-8">
                    <h3 className="font-medium text-lg mb-3 text-gray-700">
                      Sujeito a:
                    </h3>
                    <div className="space-y-3">
                      {restricoes.map((restricao, restricaoIndex) => (
                        <motion.div
                          key={restricaoIndex}
                          className="bg-white p-4 rounded-md border border-gray-200 shadow-sm"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * restricaoIndex }}
                        >
                          <div className="flex flex-wrap items-center text-lg">
                            {restricao.coeficientes.map((coef, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center mr-2"
                              >
                                {index > 0 && coef >= 0 && (
                                  <span className="text-gray-500 mr-1">+</span>
                                )}
                                {index > 0 && coef < 0 && (
                                  <span className="text-gray-500 mr-1">−</span>
                                )}
                                <span
                                  className="font-medium"
                                  style={{ color: variaveis[index].cor }}
                                >
                                  {Math.abs(coef) !== 1 && Math.abs(coef)}
                                  {coef !== 0 && (
                                    <span className="ml-1">
                                      {variaveis[index].nome}
                                    </span>
                                  )}
                                </span>
                              </span>
                            ))}
                            <span className="mx-2 text-gray-800">
                              {restricao.tipo}
                            </span>
                            <span className="font-medium text-gray-800">
                              {restricao.valorLimite}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">
                            {restricao.descricao}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Não-negatividade */}
                  <motion.div variants={itemVariants}>
                    <h3 className="font-medium text-lg mb-3 text-gray-700">
                      Não-negatividade:
                    </h3>
                    <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                      <div className="flex flex-wrap gap-3">
                        {variaveis.map((variavel, index) => (
                          <motion.span
                            key={index}
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: `${variavel.cor}20`,
                              color: variavel.cor,
                            }}
                          >
                            {variavel.nome} ≥ 0
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Visualização Interativa */}
          <AnimatePresence>
            {mostrarVisualizacao && (
              <motion.div
                key="visualizacao"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mb-8"
              >
                <div className="bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl border border-blue-200 overflow-hidden">
                  {/* Navegação entre abas */}
                  <div className="mb-6">
                    <div className="bg-white rounded-lg shadow flex justify-center p-1">
                      <button
                        onClick={() => setAba("simulador")}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                          aba === "simulador"
                            ? "bg-primary-500 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Simulador
                      </button>
                      <button
                        onClick={() => setAba("grafico")}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                          aba === "grafico"
                            ? "bg-primary-500 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Visualização Gráfica
                      </button>
                      <button
                        onClick={() => setAba("evolucao")}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                          aba === "evolucao"
                            ? "bg-primary-500 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Evolução da Otimização
                      </button>
                    </div>
                  </div>

                  {/* Conteúdo das abas */}
                  <div className="p-6">
                    {/* Aba do Simulador */}
                    {aba === "simulador" && (
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Controle das variáveis */}
                        <div>
                          <h3 className="font-medium text-lg mb-4 text-gray-700 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2 text-primary-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Ajuste os valores das variáveis
                          </h3>

                          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="space-y-5">
                              {variaveis.map((variavel, index) => (
                                <div key={index} className="mb-4">
                                  <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                      <span style={{ color: variavel.cor }}>
                                        {variavel.nome}
                                      </span>{" "}
                                      ({variavel.descricao})
                                    </label>
                                    <span
                                      className="text-sm font-medium px-2 py-1 rounded"
                                      style={{
                                        backgroundColor: `${variavel.cor}20`,
                                        color: variavel.cor,
                                      }}
                                    >
                                      {valoresVariaveis[index]}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <input
                                      type="range"
                                      min="0"
                                      max="20"
                                      step="1"
                                      value={valoresVariaveis[index]}
                                      onChange={(e) =>
                                        atualizarVariavel(
                                          index,
                                          parseFloat(e.target.value)
                                        )
                                      }
                                      className="w-full mr-3"
                                      style={{
                                        accentColor: variavel.cor,
                                      }}
                                    />
                                    <input
                                      type="number"
                                      min="0"
                                      value={valoresVariaveis[index]}
                                      onChange={(e) =>
                                        atualizarVariavel(
                                          index,
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                      className="input w-20 text-center"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                              <div className="text-center">
                                <h4 className="font-medium text-gray-700 mb-1">
                                  Valor da Função Objetivo
                                </h4>
                                <div
                                  className={`text-3xl font-bold ${
                                    funcaoObjetivo.tipo === "max"
                                      ? "text-blue-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {calcularFuncaoObjetivo().toFixed(2)}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {funcaoObjetivo.tipo === "max"
                                    ? "Queremos aumentar este valor"
                                    : "Queremos diminuir este valor"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status das Restrições */}
                        <div>
                          <h3 className="font-medium text-lg mb-4 text-gray-700 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2 text-primary-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                            Status das Restrições
                          </h3>

                          <div className="space-y-4">
                            {restricoes.map((restricao, index) => {
                              const satisfaz = verificarRestricoes()[index];
                              const valorAtual = restricao.coeficientes
                                .reduce(
                                  (sum, coef, i) =>
                                    sum + coef * valoresVariaveis[i],
                                  0
                                )
                                .toFixed(2);
                              const percentual =
                                calcularPercentualAtendimento()[index].toFixed(
                                  0
                                );

                              return (
                                <motion.div
                                  key={index}
                                  className={`rounded-lg shadow-sm p-4 border ${
                                    satisfaz
                                      ? "border-green-200 bg-gradient-to-r from-green-50 to-white"
                                      : "border-red-200 bg-gradient-to-r from-red-50 to-white"
                                  }`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-medium text-gray-800">
                                        Restrição {index + 1}
                                      </div>
                                      <div className="text-sm text-gray-600 mt-1">
                                        {restricao.descricao}
                                      </div>
                                    </div>
                                    <div
                                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        satisfaz
                                          ? "bg-green-100 text-green-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {satisfaz ? "Satisfeita" : "Violada"}
                                    </div>
                                  </div>

                                  <div className="mt-3 font-medium">
                                    {valorAtual} {restricao.tipo}{" "}
                                    {restricao.valorLimite}
                                  </div>

                                  {/* Barra de Progresso */}
                                  <div className="mt-2 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                    <motion.div
                                      className={`h-2.5 rounded-full ${
                                        satisfaz ? "bg-green-500" : "bg-red-500"
                                      }`}
                                      initial={{ width: "0%" }}
                                      animate={{ width: `${percentual}%` }}
                                      transition={{ duration: 0.5 }}
                                    ></motion.div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* Status geral da solução */}
                          <motion.div
                            className={`mt-6 p-5 rounded-lg shadow ${
                              verificarRestricoes().every(Boolean)
                                ? "bg-green-50 border border-green-200"
                                : "bg-red-50 border border-red-200"
                            }`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <div className="flex items-start">
                              <div
                                className={`p-2 rounded-full mr-4 ${
                                  verificarRestricoes().every(Boolean)
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  {verificarRestricoes().every(Boolean) ? (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  ) : (
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  )}
                                </svg>
                              </div>

                              <div>
                                <h3 className="font-medium text-lg mb-1">
                                  Status da Solução
                                </h3>
                                {verificarRestricoes().every(Boolean) ? (
                                  <p className="text-green-700">
                                    Esta solução é <strong>viável</strong>, pois
                                    satisfaz todas as restrições do problema.
                                  </p>
                                ) : (
                                  <p className="text-red-700">
                                    Esta solução é <strong>inviável</strong>,
                                    pois viola uma ou mais restrições do
                                    problema.
                                  </p>
                                )}

                                {resultadoOtimo &&
                                  verificarRestricoes().every(Boolean) &&
                                  calcularFuncaoObjetivo() ===
                                    resultadoOtimo.valorFuncaoObjetivo && (
                                    <p className="mt-2 text-blue-600 font-medium">
                                      Parabéns! Você encontrou a solução ótima
                                      do problema!
                                    </p>
                                  )}
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    )}

                    {/* Aba de Gráficos */}
                    {aba === "grafico" && (
                      <div>
                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Gráfico de Radar para Restrições */}
                          <div>
                            <h3 className="font-medium text-lg mb-4 text-gray-700 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2 text-primary-500"
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
                              Atendimento às Restrições
                            </h3>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                              <div style={{ height: "300px" }}>
                                <Chart
                                  ref={chartRef}
                                  type="radar"
                                  data={dadosRadar}
                                  options={opcoesRadar}
                                />
                              </div>

                              <div className="mt-4 text-center text-sm text-gray-600">
                                Este gráfico mostra o percentual de atendimento
                                às restrições do problema. 100% significa que a
                                restrição está totalmente satisfeita.
                              </div>
                            </div>
                          </div>

                          {/* Gráfico de Evolução da Função Objetivo */}
                          <div>
                            <h3 className="font-medium text-lg mb-4 text-gray-700 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2 text-primary-500"
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
                              Evolução da Função Objetivo
                            </h3>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                              {historico.length > 0 ? (
                                <div style={{ height: "300px" }}>
                                  <Chart
                                    type="line"
                                    data={dadosEvolucao}
                                    options={opcoesEvolucao}
                                  />
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 mb-4 opacity-30"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                  </svg>
                                  <p>
                                    Ajuste os valores das variáveis ou use
                                    "Simular Otimização" para ver a evolução da
                                    função objetivo
                                  </p>
                                </div>
                              )}

                              <div className="mt-4 text-center text-sm text-gray-600">
                                Este gráfico mostra a evolução do valor da
                                função objetivo ao longo das iterações de
                                ajustes.
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Visualização das Variáveis */}
                        <div className="mt-8">
                          <h3 className="font-medium text-lg mb-4 text-gray-700 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2 text-primary-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            Contribuição das Variáveis
                          </h3>

                          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Valores das Variáveis */}
                              <div>
                                <h4 className="font-medium mb-3 text-gray-600">
                                  Valores atuais:
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                  {valoresVariaveis.map((valor, index) => (
                                    <div
                                      key={index}
                                      className="flex flex-col items-center justify-center w-20 h-20 rounded-lg"
                                      style={{
                                        backgroundColor: `${variaveis[index].cor}15`,
                                        borderColor: variaveis[index].cor,
                                        borderWidth: "2px",
                                      }}
                                    >
                                      <div
                                        className="text-lg font-bold"
                                        style={{ color: variaveis[index].cor }}
                                      >
                                        {valor}
                                      </div>
                                      <div className="text-xs mt-1 text-gray-600">
                                        {variaveis[index].nome}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Contribuições para a Função Objetivo */}
                              <div>
                                <h4 className="font-medium mb-3 text-gray-600">
                                  Contribuição para a função objetivo:
                                </h4>
                                <div className="space-y-2">
                                  {variaveis.map((variavel, index) => {
                                    const contribuicao =
                                      funcaoObjetivo.coeficientes[index] *
                                      valoresVariaveis[index];
                                    const percentual =
                                      (Math.abs(contribuicao) /
                                        Math.abs(calcularFuncaoObjetivo())) *
                                      100;

                                    return (
                                      <div
                                        key={index}
                                        className="relative pt-1"
                                      >
                                        <div className="flex mb-1 items-center justify-between">
                                          <div>
                                            <span
                                              className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full"
                                              style={{
                                                backgroundColor: `${variavel.cor}20`,
                                                color: variavel.cor,
                                              }}
                                            >
                                              {variavel.nome}
                                            </span>
                                          </div>
                                          <div className="text-right">
                                            <span
                                              className="text-xs font-semibold inline-block"
                                              style={{ color: variavel.cor }}
                                            >
                                              {contribuicao.toFixed(2)} (
                                              {percentual.toFixed(0)}%)
                                            </span>
                                          </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                          <motion.div
                                            style={{
                                              width: `${percentual}%`,
                                              backgroundColor: variavel.cor,
                                            }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                                            initial={{ width: 0 }}
                                            animate={{
                                              width: `${percentual}%`,
                                            }}
                                            transition={{ duration: 0.5 }}
                                          ></motion.div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Aba de Evolução da Otimização */}
                    {aba === "evolucao" && (
                      <div>
                        {historico.length > 1 ? (
                          <div className="space-y-8">
                            {/* Gráfico de evolução da função objetivo */}
                            <div>
                              <h3 className="font-medium text-lg mb-4 text-gray-700 flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mr-2 text-primary-500"
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
                                Evolução da Função Objetivo
                              </h3>

                              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div style={{ height: "300px" }}>
                                  <Chart
                                    ref={chartEvolucaoRef}
                                    type="line"
                                    data={dadosEvolucao}
                                    options={opcoesEvolucao}
                                  />
                                </div>

                                <div className="mt-4 text-center text-sm text-gray-600">
                                  Este gráfico mostra como o valor da função
                                  objetivo evolui durante o processo de
                                  otimização até atingir o valor ótimo.
                                </div>
                              </div>
                            </div>

                            {/* Gráfico de evolução das variáveis */}
                            <div>
                              <h3 className="font-medium text-lg mb-4 text-gray-700 flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mr-2 text-secondary-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                  />
                                </svg>
                                Evolução das Variáveis de Decisão
                              </h3>

                              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div style={{ height: "300px" }}>
                                  <Chart
                                    ref={chartVariaveisRef}
                                    type="line"
                                    data={dadosVariaveis}
                                    options={opcoesVariaveis}
                                  />
                                </div>

                                <div className="mt-4 text-center text-sm text-gray-600">
                                  Este gráfico mostra como os valores das
                                  variáveis de decisão evoluem durante o
                                  processo de otimização.
                                </div>
                              </div>
                            </div>

                            {/* Informações adicionais sobre o processo de otimização */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Interpretação dos Gráficos
                              </h3>
                              <p className="text-blue-700 mb-3">
                                Os gráficos acima mostram o caminho percorrido
                                durante a otimização, desde os valores iniciais
                                até a solução ótima do problema.
                              </p>
                              <ul className="list-disc list-inside text-blue-700 text-sm">
                                <li className="mb-1">
                                  No gráfico da função objetivo, observe como o
                                  valor{" "}
                                  {funcaoObjetivo.tipo === "max"
                                    ? "aumenta"
                                    : "diminui"}{" "}
                                  a cada passo, buscando sempre{" "}
                                  {funcaoObjetivo.tipo === "max"
                                    ? "maximizar"
                                    : "minimizar"}{" "}
                                  o resultado.
                                </li>
                                <li className="mb-1">
                                  No gráfico das variáveis, você pode acompanhar
                                  como cada variável de decisão se ajusta
                                  durante o processo de otimização, convergindo
                                  para seus valores ótimos.
                                </li>
                                <li>
                                  A solução final encontrada é:{" "}
                                  {variaveis
                                    .map(
                                      (v, i) =>
                                        `${v.nome}=${resultadoOtimo?.valoresOtimos[i]}`
                                    )
                                    .join(", ")}{" "}
                                  com valor da função objetivo ={" "}
                                  {resultadoOtimo?.valorFuncaoObjetivo}.
                                </li>
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 mx-auto text-yellow-500 mb-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            <h3 className="text-lg font-medium text-yellow-800 mb-2">
                              Nenhum dado de evolução disponível
                            </h3>
                            <p className="text-yellow-700 mb-4">
                              Para visualizar a evolução da otimização, utilize
                              o botão "Simular Otimização" acima.
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={simularOtimizacao}
                              disabled={animationInProgress}
                              className={`px-4 py-2 rounded-md flex items-center mx-auto ${
                                animationInProgress
                                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-700 text-white"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>
                                {animationInProgress
                                  ? "Simulando..."
                                  : "Simular Otimização"}
                              </span>
                            </motion.button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resultado Ótimo */}
          <AnimatePresence>
            {mostrarResultado && resultadoOtimo && (
              <motion.div
                key="resultado"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mb-8"
              >
                <div className="bg-gradient-to-r from-green-50 via-blue-50 to-green-50 p-6 rounded-xl border border-green-200">
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center mb-6"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mr-4">
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-display font-bold text-green-800">
                      Solução Ótima Encontrada
                    </h2>
                  </motion.div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Valores ótimos das variáveis */}
                    <motion.div variants={itemVariants}>
                      <h3 className="font-medium text-lg mb-4 text-gray-700 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        Valores Ótimos das Variáveis
                      </h3>

                      <div className="space-y-3">
                        {resultadoOtimo.valoresOtimos.map((valor, index) => (
                          <motion.div
                            key={index}
                            className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                            whileHover={{
                              y: -2,
                              boxShadow:
                                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.1 * index,
                              hover: { duration: 0.2 },
                            }}
                          >
                            <div className="flex items-center">
                              <div
                                className="w-8 h-8 rounded-md flex items-center justify-center mr-3"
                                style={{
                                  backgroundColor: `${variaveis[index].cor}20`,
                                  color: variaveis[index].cor,
                                }}
                              >
                                <span className="font-bold">
                                  {variaveis[index].nome}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">
                                  {variaveis[index].descricao}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Variável de decisão {index + 1}
                                </div>
                              </div>
                            </div>
                            <div
                              className="text-2xl font-bold"
                              style={{ color: variaveis[index].cor }}
                            >
                              {valor}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Valor ótimo da função objetivo */}
                    <motion.div variants={itemVariants}>
                      <h3 className="font-medium text-lg mb-4 text-gray-700 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-green-600"
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
                        Valor Ótimo da Função Objetivo
                      </h3>

                      <motion.div
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center"
                        whileHover={{
                          y: -3,
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-sm text-gray-500 mb-2 uppercase tracking-wider">
                          {funcaoObjetivo.tipo === "max"
                            ? "Valor Máximo"
                            : "Valor Mínimo"}
                        </div>

                        <div
                          className="text-5xl font-bold mb-4"
                          style={{
                            color:
                              funcaoObjetivo.tipo === "max"
                                ? "#0284c7"
                                : "#e11d48",
                          }}
                        >
                          {resultadoOtimo.valorFuncaoObjetivo}
                        </div>

                        <div className="text-gray-600 mb-6">
                          {funcaoObjetivo.descricao}
                        </div>

                        <motion.div
                          className="w-24 h-24 rounded-full border-4 flex items-center justify-center mb-4"
                          style={{
                            borderColor:
                              funcaoObjetivo.tipo === "max"
                                ? "#0284c7"
                                : "#e11d48",
                            backgroundColor:
                              funcaoObjetivo.tipo === "max"
                                ? "rgba(2, 132, 199, 0.1)"
                                : "rgba(225, 29, 72, 0.1)",
                          }}
                          animate={{
                            scale: [1, 1.05, 1],
                            borderWidth: ["4px", "2px", "4px"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            style={{
                              color:
                                funcaoObjetivo.tipo === "max"
                                  ? "#0284c7"
                                  : "#e11d48",
                            }}
                          >
                            {funcaoObjetivo.tipo === "max" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 11l7-7 7 7M5 19l7-7 7 7"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
                              />
                            )}
                          </svg>
                        </motion.div>

                        <div className="text-green-600 font-medium">
                          Esta é a solução ótima que{" "}
                          {funcaoObjetivo.tipo === "max"
                            ? "maximiza"
                            : "minimiza"}{" "}
                          a função objetivo!
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Botão para aplicar a solução ótima */}
                  <motion.div
                    variants={itemVariants}
                    className="mt-8 text-center"
                  >
                    <motion.button
                      onClick={() => {
                        setValoresVariaveis([...resultadoOtimo.valoresOtimos]);
                        setMostrarVisualizacao(true);
                        setAba("simulador");
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center mx-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Aplicar Valores Ótimos no Simulador
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
