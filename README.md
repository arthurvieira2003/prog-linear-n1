# Apresentação de Programação Linear

Este é um site interativo para apresentação de problemas de programação linear, com visualizações animadas e simulações interativas.

## Problemas abordados

1. **Campanha de Vacinação**: Maximização de pessoas vacinadas através da distribuição de postos móveis
2. **Organização de Turnos de Médicos**: Minimização de custos com turnos de médicos
3. **Plano Alimentar**: Minimização de custos de uma dieta balanceada para ganho de massa muscular

## Tecnologias utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion para animações
- Chart.js para visualizações

## Como configurar o projeto

1. Instale as dependências:

```bash
npm install
```

2. Configure o Tailwind CSS:

```bash
npx tailwindcss init -p
```

3. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

4. Acesse o site em [http://localhost:3000](http://localhost:3000)

## Estrutura do projeto

- `/app`: Código fonte da aplicação
  - `/components`: Componentes reutilizáveis
  - `/problema1`: Página do primeiro problema
  - `/problema2`: Página do segundo problema
  - `/problema3`: Página do terceiro problema

## Funcionalidades

- Visualização interativa dos modelos de programação linear
- Simulador para testar diferentes valores das variáveis
- Verificação de restrições em tempo real
- Apresentação das soluções ótimas
- Interface animada e intuitiva
