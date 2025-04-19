"use client";

import { useState, useEffect, useRef } from "react";
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

type SimplexProps = {
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

export default function SimplexMethod({
  titulo,
  descricao,
  variaveis,
  restricoes,
  funcaoObjetivo,
  resultadoOtimo,
}: SimplexProps) {
  const [mostrarTabelas, setMostrarTabelas] = useState(false);
  const [passoAtual, setPassoAtual] = useState(0);
  const [animationInProgress, setAnimationInProgress] = useState(false);
  const [tabelas, setTabelas] = useState<any[]>([]);
  const [explicacoes, setExplicacoes] = useState<string[]>([]);
  const [problema, setProblema] = useState<{
    A: number[][];
    b: number[];
    c: number[];
    maximizar: boolean;
  }>({ A: [], b: [], c: [], maximizar: true });
  const [abaAtiva, setAbaAtiva] = useState<"tabelas" | "graficos">("tabelas");
  const [dadosGraficoFuncao, setDadosGraficoFuncao] = useState<{
    labels: string[];
    valores: number[];
  }>({ labels: [], valores: [] });
  const [dadosGraficoVariaveis, setDadosGraficoVariaveis] = useState<{
    labels: string[];
    datasets: any[];
  }>({ labels: [], datasets: [] });

  // Refs
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // Configurar o problema em forma padrão para o Simplex
    prepararProblema();
  }, [variaveis, restricoes, funcaoObjetivo]);

  const prepararProblema = () => {
    // Converter o problema para a forma padrão do simplex
    const maximizar = funcaoObjetivo.tipo === "max";

    // Coeficientes da função objetivo
    const c = [...funcaoObjetivo.coeficientes];
    if (!maximizar) {
      // Para minimização, invertemos os coeficientes para usar maximização
      for (let i = 0; i < c.length; i++) {
        c[i] = -c[i];
      }
    }

    // Matriz de coeficientes das restrições
    const A: number[][] = [];
    const b: number[] = [];

    // Converter todas as restrições para formato <=
    restricoes.forEach((restricao) => {
      const row = [...restricao.coeficientes];
      let valor = restricao.valorLimite;

      if (restricao.tipo === ">=") {
        // Multiplicar por -1 para converter ">=" para "<="
        for (let i = 0; i < row.length; i++) {
          row[i] = -row[i];
        }
        valor = -valor;
      }

      // Para restrições de igualdade, poderíamos adicionar duas restrições:
      // uma <= e uma >=, mas isso não está sendo tratado neste exemplo simplificado

      A.push(row);
      b.push(valor);
    });

    setProblema({ A, b, c, maximizar });
  };

  const executarSimplex = () => {
    if (animationInProgress || !problema.A.length) return;
    setAnimationInProgress(true);
    setMostrarTabelas(false); // Resetar para animação mais suave

    // Implementar o algoritmo Simplex e registrar os passos
    const resultados = simplex(
      problema.A,
      problema.b,
      problema.c,
      problema.maximizar
    );

    // Iniciar animação para mostrar os resultados
    setTimeout(() => {
      setTabelas(resultados.tabelas);
      setExplicacoes(resultados.explicacoes);
      setMostrarTabelas(true);
      setPassoAtual(0);

      // Animar pelos passos
      if (resultados.tabelas.length > 1) {
        let passo = 0;
        const intervalo = setInterval(() => {
          passo++;
          setPassoAtual(passo);

          if (passo >= resultados.tabelas.length - 1) {
            clearInterval(intervalo);
            setAnimationInProgress(false);
          }
        }, 2000); // 2 segundos por passo

        return () => clearInterval(intervalo);
      } else {
        setAnimationInProgress(false);
      }
    }, 500);
  };

  // Função que implementa o algoritmo Simplex passo a passo
  const simplex = (
    A: number[][],
    b: number[],
    c: number[],
    maximizar: boolean
  ) => {
    // Número de variáveis e restrições
    const numVars = c.length;
    const numRestr = A.length;

    // Inicializar tabelas e explicações
    const tabelas: any[] = [];
    const explicacoes: string[] = [];

    // Converter problema para forma padrão (todas restrições como <=)
    const Apadrao = [...A.map((row) => [...row])];
    const bpadrao = [...b];

    // Criar tabela inicial
    const tabelaInicial = criarTabelaSimplex(
      Apadrao,
      bpadrao,
      c,
      numVars,
      numRestr
    );
    tabelas.push(JSON.parse(JSON.stringify(tabelaInicial)));
    explicacoes.push(
      "Tabela inicial do método Simplex. As variáveis de decisão são representadas nas colunas, e as restrições nas linhas."
    );

    // Para armazenar os valores para o gráfico
    const valoresFuncao: number[] = [];
    const labelsIteracoes: string[] = ["Início"];
    const valoresVariaveis: number[][] = Array(numVars)
      .fill(0)
      .map(() => []);

    // Adicionar o valor inicial ao gráfico
    const solucaoInicial = extrairSolucao(tabelaInicial, numVars);
    valoresFuncao.push(maximizar ? solucaoInicial.z : -solucaoInicial.z);
    for (let i = 0; i < numVars; i++) {
      valoresVariaveis[i].push(solucaoInicial.x[i]);
    }

    // Executar iterações do Simplex
    let iteracao = 0;
    const MAX_ITERACOES = 20; // Evitar loops infinitos

    // Clonar a tabela inicial para modificarmos
    let tabelaAtual = JSON.parse(JSON.stringify(tabelaInicial));

    while (iteracao < MAX_ITERACOES) {
      // Encontrar coluna pivô (variável que entra na base)
      const colunaPivo = encontrarColunaPivo(tabelaAtual);

      if (colunaPivo === -1) {
        // Solução ótima encontrada
        explicacoes.push(
          "Não há mais valores negativos na linha Z. Solução ótima encontrada!"
        );
        break;
      }

      // Encontrar linha pivô (variável que sai da base)
      const linhaPivo = encontrarLinhaPivo(tabelaAtual, colunaPivo);

      if (linhaPivo === -1) {
        // Problema ilimitado
        explicacoes.push(
          "O problema é ilimitado! Não existe uma solução ótima finita."
        );
        break;
      }

      // Adicionar explicação antes do pivoteamento
      explicacoes.push(
        `Iteração ${iteracao + 1}: Variável ${
          colunaPivo < numVars
            ? `x${colunaPivo + 1}`
            : `s${colunaPivo - numVars + 1}`
        } entra na base, substituindo a variável da linha ${linhaPivo + 1}.`
      );

      // Aplicar operações de pivoteamento
      pivotear(tabelaAtual, linhaPivo, colunaPivo);

      // Adicionar à lista de tabelas
      tabelas.push(JSON.parse(JSON.stringify(tabelaAtual)));

      // Extrair dados para o gráfico após esta iteração
      const solucaoAtual = extrairSolucao(tabelaAtual, numVars);
      valoresFuncao.push(maximizar ? solucaoAtual.z : -solucaoAtual.z);
      labelsIteracoes.push(`Iteração ${iteracao + 1}`);

      for (let i = 0; i < numVars; i++) {
        if (!valoresVariaveis[i]) valoresVariaveis[i] = [];
        valoresVariaveis[i].push(solucaoAtual.x[i]);
      }

      iteracao++;
    }

    // Extrair solução final
    const solucao = extrairSolucao(tabelaAtual, numVars);
    tabelas.push({ tipo: "solucao", valores: solucao });
    explicacoes.push(
      `Solução final: Valor ótimo = ${
        maximizar ? solucao.z : -solucao.z
      }. Valores das variáveis: ${solucao.x
        .map((v: number, i: number) => `${variaveis[i].nome} = ${v.toFixed(2)}`)
        .join(", ")}`
    );

    // Preparar dados para os gráficos
    setDadosGraficoFuncao({
      labels: labelsIteracoes,
      valores: valoresFuncao,
    });

    // Preparar dados para o gráfico de variáveis
    const datasets = variaveis.map((v, idx) => ({
      label: v.nome,
      data: valoresVariaveis[idx],
      borderColor: v.cor || CORES[idx % CORES.length],
      backgroundColor: (v.cor || CORES[idx % CORES.length])
        .replace("rgb", "rgba")
        .replace(")", ", 0.2)"),
      borderWidth: 2,
      tension: 0.1,
    }));

    setDadosGraficoVariaveis({
      labels: labelsIteracoes,
      datasets: datasets,
    });

    return { tabelas, explicacoes };
  };

  // Funções auxiliares para o algoritmo Simplex
  const criarTabelaSimplex = (
    A: number[][],
    b: number[],
    c: number[],
    numVars: number,
    numRestr: number
  ) => {
    // Matriz completa para o quadro simplex
    const matriz: number[][] = [];

    // Adicionar as linhas das restrições
    for (let i = 0; i < numRestr; i++) {
      const linha: number[] = [];

      // Coeficientes das variáveis originais
      for (let j = 0; j < numVars; j++) {
        linha.push(A[i][j]);
      }

      // Coeficientes das variáveis de folga (matriz identidade)
      for (let j = 0; j < numRestr; j++) {
        linha.push(i === j ? 1 : 0);
      }

      // Lado direito (constantes)
      linha.push(b[i]);

      matriz.push(linha);
    }

    // Adicionar a linha da função objetivo (Z)
    const linhaZ: number[] = [];

    // Coeficientes negativos das variáveis originais na função objetivo
    for (let j = 0; j < numVars; j++) {
      linhaZ.push(-c[j]);
    }

    // Coeficientes zero para as variáveis de folga
    for (let j = 0; j < numRestr; j++) {
      linhaZ.push(0);
    }

    // Valor inicial de Z (zero)
    linhaZ.push(0);

    matriz.push(linhaZ);

    return matriz;
  };

  const encontrarColunaPivo = (tabela: number[][]) => {
    const linhaZ = tabela[tabela.length - 1];
    let colunaPivo = -1;
    let menorValor = -0.000001; // Tolerância para evitar problemas numéricos

    // Encontrar o índice do menor valor negativo na linha Z
    for (let j = 0; j < linhaZ.length - 1; j++) {
      if (linhaZ[j] < menorValor) {
        menorValor = linhaZ[j];
        colunaPivo = j;
      }
    }

    return colunaPivo;
  };

  const encontrarLinhaPivo = (tabela: number[][], colunaPivo: number) => {
    let linhaPivo = -1;
    let menorRazao = Infinity;
    const numLinhas = tabela.length - 1; // Excluir linha Z
    const ultimaColuna = tabela[0].length - 1;

    // Calcular razões para cada linha das restrições
    for (let i = 0; i < numLinhas; i++) {
      // Apenas considerar coeficientes positivos na coluna pivô
      if (tabela[i][colunaPivo] <= 0) continue;

      const razao = tabela[i][ultimaColuna] / tabela[i][colunaPivo];

      if (razao < menorRazao) {
        menorRazao = razao;
        linhaPivo = i;
      }
    }

    return linhaPivo;
  };

  const pivotear = (
    tabela: number[][],
    linhaPivo: number,
    colunaPivo: number
  ) => {
    const numLinhas = tabela.length;
    const numColunas = tabela[0].length;

    // Normalizar a linha pivô dividindo todos os elementos pelo elemento pivô
    const elementoPivo = tabela[linhaPivo][colunaPivo];

    for (let j = 0; j < numColunas; j++) {
      tabela[linhaPivo][j] = tabela[linhaPivo][j] / elementoPivo;
    }

    // Atualizar todas as outras linhas
    for (let i = 0; i < numLinhas; i++) {
      if (i !== linhaPivo) {
        const fator = tabela[i][colunaPivo];

        for (let j = 0; j < numColunas; j++) {
          tabela[i][j] = tabela[i][j] - fator * tabela[linhaPivo][j];
        }
      }
    }
  };

  const extrairSolucao = (tabela: number[][], numVars: number) => {
    const numLinhas = tabela.length - 1; // Excluir linha Z
    const numColunas = tabela[0].length;
    const ultimaColuna = numColunas - 1;

    // Inicializar vetor de solução com zeros
    const x = Array(numVars).fill(0);

    // Para cada variável original, verificar se é básica
    for (let j = 0; j < numVars; j++) {
      // Verificar se a coluna tem exatamente um 1 e o resto 0
      let posicao1 = -1;
      let ehBasica = true;

      for (let i = 0; i < numLinhas; i++) {
        if (Math.abs(tabela[i][j] - 1) < 0.00001) {
          // Encontrou um 1
          if (posicao1 === -1) {
            posicao1 = i;
          } else {
            // Mais de um 1 na coluna, não é básica
            ehBasica = false;
            break;
          }
        } else if (Math.abs(tabela[i][j]) > 0.00001) {
          // Encontrou um valor diferente de 0 que não é 1
          ehBasica = false;
          break;
        }
      }

      // Se for básica, pegar o valor do lado direito
      if (ehBasica && posicao1 !== -1) {
        x[j] = tabela[posicao1][ultimaColuna];
      }
    }

    // Valor da função objetivo
    const z = tabela[numLinhas][ultimaColuna];

    return { x, z };
  };

  // Opções para os gráficos
  const opcoesGraficoFuncao = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Evolução da Função Objetivo (${
          funcaoObjetivo.tipo === "max" ? "Maximização" : "Minimização"
        })`,
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
        beginAtZero: true,
        title: {
          display: true,
          text: "Valor da Função Objetivo",
        },
      },
      x: {
        title: {
          display: true,
          text: "Iterações",
        },
      },
    },
    animation: {
      duration: 1000,
    },
  };

  const opcoesGraficoVariaveis = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Evolução dos Valores das Variáveis",
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
          text: "Iterações",
        },
      },
    },
    animation: {
      duration: 1000,
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 py-6 px-8">
        <h2 className="text-2xl font-bold text-white">
          Método Simplex: {titulo}
        </h2>
        <p className="text-primary-100 mt-2">{descricao}</p>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Formulação Matemática
          </h3>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-4">
              <span className="font-medium">Função Objetivo:</span>
              <div className="mt-1 pl-5 text-lg">
                {funcaoObjetivo.tipo === "max" ? "Maximizar " : "Minimizar "}Z ={" "}
                {funcaoObjetivo.coeficientes.map((coef, index) => (
                  <span key={index}>
                    {index > 0 && coef >= 0 && " + "}
                    {index > 0 && coef < 0 && " - "}
                    {Math.abs(coef) !== 1
                      ? Math.abs(coef)
                      : index > 0
                      ? ""
                      : coef < 0
                      ? "-"
                      : ""}
                    {variaveis[index].nome}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-medium">Sujeito a:</span>
              <div className="mt-1 pl-5">
                {restricoes.map((restricao, rIndex) => (
                  <div key={rIndex} className="mb-2 text-lg">
                    {restricao.coeficientes.map((coef, vIndex) => (
                      <span key={vIndex}>
                        {vIndex > 0 && coef >= 0 && " + "}
                        {vIndex > 0 && coef < 0 && " - "}
                        {Math.abs(coef) !== 1
                          ? Math.abs(coef)
                          : vIndex > 0
                          ? ""
                          : coef < 0
                          ? "-"
                          : ""}
                        {variaveis[vIndex].nome}
                      </span>
                    ))}{" "}
                    {restricao.tipo} {restricao.valorLimite}
                  </div>
                ))}

                {variaveis.map((v, index) => (
                  <div key={`non-neg-${index}`} className="text-lg">
                    {v.nome} ≥ 0
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Resolução pelo Método Simplex
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={executarSimplex}
              disabled={animationInProgress}
              className={`px-4 py-2 rounded-md bg-primary-600 text-white font-medium ${
                animationInProgress
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-primary-700"
              }`}
            >
              {animationInProgress ? "Resolvendo..." : "Resolver com Simplex"}
            </motion.button>
          </div>

          {/* Tabs para alternar entre tabelas e gráficos */}
          {mostrarTabelas && (
            <div className="mb-4">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                  <button
                    onClick={() => setAbaAtiva("tabelas")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      abaAtiva === "tabelas"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Tabelas do Simplex
                  </button>
                  <button
                    onClick={() => setAbaAtiva("graficos")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      abaAtiva === "graficos"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Visualização Gráfica
                  </button>
                </nav>
              </div>
            </div>
          )}

          <AnimatePresence>
            {mostrarTabelas && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-50 p-4 rounded-lg"
              >
                {abaAtiva === "tabelas" ? (
                  // Conteúdo das tabelas existente
                  <>
                    {passoAtual < tabelas.length &&
                    tabelas[passoAtual].tipo === "solucao" ? (
                      <div className="mb-4">
                        <h4 className="font-bold text-lg mb-2">
                          Solução Ótima Encontrada
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-semibold">
                              Valores das Variáveis:
                            </h5>
                            <ul className="mt-2 space-y-1">
                              {tabelas[passoAtual].valores.x.map(
                                (valor: number, idx: number) => (
                                  <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-center"
                                  >
                                    <div
                                      className="w-3 h-3 rounded-full mr-2"
                                      style={{
                                        backgroundColor:
                                          variaveis[idx].cor ||
                                          CORES[idx % CORES.length],
                                      }}
                                    ></div>
                                    <span>
                                      {variaveis[idx].nome} = {valor.toFixed(2)}
                                    </span>
                                  </motion.li>
                                )
                              )}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold">
                              Valor da Função Objetivo:
                            </h5>
                            <motion.p
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              className="mt-2 text-lg font-bold text-primary-600"
                            >
                              Z ={" "}
                              {problema.maximizar
                                ? tabelas[passoAtual].valores.z.toFixed(2)
                                : (-tabelas[passoAtual].valores.z).toFixed(2)}
                            </motion.p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold text-lg mb-3">
                          Passo {passoAtual + 1} de {tabelas.length - 1}
                        </h4>

                        <div className="mb-4">
                          <p className="text-gray-700">
                            {explicacoes[passoAtual]}
                          </p>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="min-w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-200">
                                <th className="px-4 py-2 border">Base</th>
                                {variaveis.map((v, idx) => (
                                  <th key={idx} className="px-4 py-2 border">
                                    {v.nome}
                                  </th>
                                ))}
                                {Array.from({ length: restricoes.length }).map(
                                  (_, idx) => (
                                    <th key={idx} className="px-4 py-2 border">
                                      s{idx + 1}
                                    </th>
                                  )
                                )}
                                <th className="px-4 py-2 border">LD</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tabelas[passoAtual] &&
                                !tabelas[passoAtual].tipo &&
                                tabelas[passoAtual].map(
                                  (linha: number[], idx: number) =>
                                    idx < tabelas[passoAtual].length - 1 ? (
                                      <tr key={idx} className="bg-white">
                                        <td className="px-4 py-2 border font-medium">
                                          s{idx + 1}
                                        </td>
                                        {linha.map(
                                          (valor: number, colIdx: number) => (
                                            <td
                                              key={colIdx}
                                              className="px-4 py-2 border text-center"
                                            >
                                              {typeof valor === "number"
                                                ? valor.toFixed(2)
                                                : valor}
                                            </td>
                                          )
                                        )}
                                      </tr>
                                    ) : null
                                )}
                              {tabelas[passoAtual] &&
                                !tabelas[passoAtual].tipo && (
                                  <tr className="bg-primary-50">
                                    <td className="px-4 py-2 border font-medium">
                                      Z
                                    </td>
                                    {tabelas[passoAtual][
                                      tabelas[passoAtual].length - 1
                                    ] &&
                                      tabelas[passoAtual][
                                        tabelas[passoAtual].length - 1
                                      ].map((valor: number, colIdx: number) => (
                                        <td
                                          key={colIdx}
                                          className="px-4 py-2 border text-center font-semibold"
                                        >
                                          {typeof valor === "number"
                                            ? valor.toFixed(2)
                                            : valor}
                                        </td>
                                      ))}
                                  </tr>
                                )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Controles de navegação entre passos */}
                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() =>
                          setPassoAtual(Math.max(0, passoAtual - 1))
                        }
                        disabled={passoAtual === 0}
                        className={`px-3 py-1 rounded border ${
                          passoAtual === 0
                            ? "border-gray-300 text-gray-400 cursor-not-allowed"
                            : "border-primary-500 text-primary-600 hover:bg-primary-50"
                        }`}
                      >
                        Anterior
                      </button>

                      <div className="text-gray-500 text-sm">
                        Passo {passoAtual + 1} de {tabelas.length}
                      </div>

                      <button
                        onClick={() =>
                          setPassoAtual(
                            Math.min(tabelas.length - 1, passoAtual + 1)
                          )
                        }
                        disabled={passoAtual === tabelas.length - 1}
                        className={`px-3 py-1 rounded border ${
                          passoAtual === tabelas.length - 1
                            ? "border-gray-300 text-gray-400 cursor-not-allowed"
                            : "border-primary-500 text-primary-600 hover:bg-primary-50"
                        }`}
                      >
                        Próximo
                      </button>
                    </div>
                  </>
                ) : (
                  // Conteúdo dos gráficos
                  <div className="space-y-8">
                    {/* Gráfico da função objetivo */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="h-64">
                        {dadosGraficoFuncao.labels.length > 0 && (
                          <Chart
                            type="line"
                            data={{
                              labels: dadosGraficoFuncao.labels,
                              datasets: [
                                {
                                  label: `Valor da Função Objetivo (${
                                    funcaoObjetivo.tipo === "max"
                                      ? "Max"
                                      : "Min"
                                  })`,
                                  data: dadosGraficoFuncao.valores,
                                  borderColor: "rgb(59, 130, 246)",
                                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                                  borderWidth: 3,
                                  pointRadius: 5,
                                  pointHoverRadius: 7,
                                  tension: 0.1,
                                  fill: true,
                                },
                              ],
                            }}
                            options={opcoesGraficoFuncao}
                          />
                        )}
                      </div>
                    </div>

                    {/* Gráfico das variáveis */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="h-64">
                        {dadosGraficoVariaveis.labels.length > 0 && (
                          <Chart
                            type="line"
                            data={dadosGraficoVariaveis}
                            options={opcoesGraficoVariaveis}
                          />
                        )}
                      </div>
                    </div>

                    {/* Legenda explicativa */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold mb-2">
                        Interpretação dos Gráficos:
                      </h4>
                      <p className="text-gray-700 mb-2">
                        Os gráficos acima mostram a evolução dos valores durante
                        as iterações do método Simplex:
                      </p>
                      <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        <li>
                          <span className="font-medium">
                            Gráfico da Função Objetivo:
                          </span>{" "}
                          Mostra como o valor da função objetivo evolui a cada
                          iteração até atingir o valor ótimo.
                        </li>
                        <li>
                          <span className="font-medium">
                            Gráfico das Variáveis:
                          </span>{" "}
                          Mostra como os valores das variáveis de decisão mudam
                          durante o processo de otimização.
                        </li>
                      </ul>
                      {problema.maximizar ? (
                        <p className="mt-3 text-sm text-primary-600 font-medium">
                          Observe como o valor da função objetivo aumenta
                          (maximização) a cada iteração até atingir o valor
                          ótimo.
                        </p>
                      ) : (
                        <p className="mt-3 text-sm text-primary-600 font-medium">
                          Observe como o valor da função objetivo diminui
                          (minimização) a cada iteração até atingir o valor
                          ótimo.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
