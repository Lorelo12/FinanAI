# Prompt Detalhado do Projeto: FinanAI

## Visão Geral do Projeto

O FinanAI é um aplicativo de finanças pessoais projetado para ser intuitivo, inteligente e multiplataforma (web e mobile). Ele permite que os usuários gerenciem suas finanças por meio de uma interface moderna, com funcionalidades aprimoradas por Inteligência Artificial para simplificar a entrada de dados. O aplicativo suporta autenticação, armazenamento de dados em nuvem e uma experiência de usuário coesa entre diferentes dispositivos.

---

## 1. Stack de Tecnologia Principal

- **Framework Frontend:** Next.js 14+ com App Router.
- **Linguagem:** TypeScript.
- **Estilização:** Tailwind CSS.
- **Biblioteca de Componentes:** ShadCN/UI, utilizando `lucide-react` para ícones.
- **Estado Global:** React Context API para gerenciamento de estado (autenticação, finanças e idioma).
- **Backend e Banco de Dados:** Firebase (Authentication para login e Firestore para persistência de dados em tempo real).
- **Funcionalidades de IA:** Google AI através do Genkit para processamento de linguagem natural (NLP).
- **Build Mobile:** Capacitor para empacotar a aplicação web como um app nativo para Android.
- **Formulários:** React Hook Form com Zod para validação de esquemas.
- **Gráficos:** Recharts para visualização de dados.

---

## 2. Estrutura de Arquivos e Componentes

O projeto segue uma estrutura organizada, separando lógica, componentes de UI, contextos e funcionalidades de IA.

- **`src/app/`**: Contém as rotas principais da aplicação (Dashboard, Contas, Metas, etc.), o layout global (`layout.tsx`) e a estilização principal (`globals.css`).
- **`src/components/`**: Organizado em subpastas:
    - **`features/`**: Componentes complexos e específicos de cada funcionalidade (ex: `dashboard`, `bills`, `goals`).
    - **`layout/`**: Componentes estruturais como `main-layout.tsx`, `top-bar.tsx` e `bottom-nav.tsx`.
    - **`ui/`**: Componentes base do ShadCN (Button, Card, Input, etc.).
- **`src/contexts/`**: Contém os provedores de estado global:
    - **`auth-context.tsx`**: Gerencia a autenticação do usuário (login com Google/Email, logout, status de convidado).
    - **`finance-context.tsx`**: Gerencia todos os dados financeiros (transações, contas, metas, lista de compras) e a sincronização com o Firestore.
    - **`language-context.tsx`**: Gerencia a internacionalização (i18n) do aplicativo.
- **`src/ai/`**: Lógica de Inteligência Artificial.
    - **`genkit.ts`**: Configuração central do Genkit e do modelo de IA (Gemini).
    - **`flows/`**: Contém os fluxos de IA para tarefas específicas, como extrair detalhes de transações a partir de texto (`extract-bill-or-transaction-details.ts`).
- **`src/lib/`**: Utilitários e configurações.
    - **`firebase.ts`**: Inicialização e configuração do Firebase.
    - **`types.ts`**: Definições de tipos TypeScript para os dados da aplicação.
    - **`utils.ts`**: Funções utilitárias (ex: `cn` para classnames).
- **`android/`**: Pasta do projeto Android gerada e gerenciada pelo Capacitor.
- **Arquivos de Configuração Raiz**: `next.config.js`, `tailwind.config.js`, `capacitor.config.json`, `package.json`.

---

## 3. Funcionalidades Detalhadas

### 3.1. Autenticação e Usuários
- **Login e Cadastro:** Suporte para login com Google e com Email/Senha.
- **Modo Convidado:** Permite que os usuários testem o aplicativo sem criar uma conta. Os dados são armazenados localmente e não persistem.
- **Persistência de Sessão:** O estado de login é mantido entre as sessões.
- **Proteção de Rotas:** Redireciona usuários não autenticados para a página de login.

### 3.2. Dashboard Principal (`/`)
- **Resumo Financeiro:** Exibe cards com o total de Receitas, Despesas e o Saldo atual.
- **Adição Inteligente de Transações:** Um campo de texto (`AITransactionForm`) onde o usuário pode descrever suas transações em linguagem natural (ex: "Gastei 50 no almoço e paguei a conta de luz de R$150 que vence dia 10"). A IA processa o texto e adiciona as transações e/ou contas automaticamente.
- **Gráfico de Distribuição por Categoria:** Um gráfico de pizza (`DistributionChart`) que visualiza as despesas distribuídas por categoria (ex: Alimentação, Transporte, Lazer).
- **Transações Recentes:** Uma tabela (`RecentTransactions`) que lista as últimas movimentações financeiras, permitindo a filtragem por categoria.

### 3.3. Contas a Pagar (`/bills`)
- **Cadastro de Contas Mensais:** O usuário pode adicionar contas recorrentes, especificando descrição, valor e dia do vencimento.
- **Visualização e Pagamento:** As contas são exibidas em cards, com um status visual (Pago, Vencido, A Vencer) baseado na data atual. O usuário pode marcar uma conta como paga para o mês corrente.

### 3.4. Metas Financeiras (`/goals`)
- **Criação de Metas:** O usuário pode definir metas de poupança com um nome e um valor alvo.
- **Acompanhamento de Progresso:** Cada meta é exibida com uma barra de progresso, mostrando o valor atual economizado em relação ao valor alvo.
- **Contribuição:** O usuário pode adicionar contribuições a qualquer momento para avançar em direção à sua meta.

### 3.5. Lista de Compras (`/checklist`)
- **Lista de Tarefas Simples:** Uma checklist para itens de supermercado ou outras compras.
- **Adição Rápida:** O usuário pode adicionar um ou mais itens separados por vírgula.
- **Gerenciamento de Itens:** É possível marcar itens como concluídos e excluí-los da lista.

### 3.6. Configurações (`/settings`)
- **Gerenciamento de Conta:** Botão dinâmico para fazer Login (se for convidado) ou Logout.
- **Gerenciamento de Categorias:** Interface para criar, visualizar, editar e excluir categorias de despesas.
- **Reset de Dados:** Para usuários logados, um botão permite apagar todos os dados financeiros associados à sua conta (ação destrutiva com confirmação).
- **Aparência:** Opções para alterar o tema (Claro, Escuro, Sistema) e o idioma (Português, Inglês).
- **Customização da UI:** Opção para mostrar ou ocultar o gráfico na tela inicial.

### 3.7. Funcionalidade de IA (Genkit)
- **Extração de Entidades:** O fluxo `extract-bill-or-transaction-details.ts` é o cérebro por trás da adição inteligente.
- **Prompt da IA:** O prompt instrui o modelo a analisar um texto em português e identificar se cada item é uma transação única ou uma conta recorrente, extraindo os respectivos detalhes (valor, descrição, data/vencimento, categoria). A categoria extraída deve ser mapeada para uma das categorias definidas pelo usuário.
- **Tratamento de Múltiplos Itens:** A IA é capaz de processar múltiplos itens descritos em uma única frase.

---

## 4. Design e Experiência do Usuário (UX)

- **Layout Responsivo:** A interface se adapta a telas de desktop e mobile.
- **Navegação Mobile-First:** Utiliza uma barra de navegação inferior (`BottomNav`) em dispositivos móveis para acesso rápido às principais seções. Em desktops, a navegação pode ser feita por um menu lateral ou superior.
- **Feedback ao Usuário:** Usa toasts para notificar sobre o sucesso ou falha de operações (ex: "Transação adicionada com sucesso").
- **Estados de Carregamento:** Exibe indicadores de carregamento (`Loader`) para evitar a percepção de lentidão enquanto os dados são buscados do Firebase.
- **Componentes Consistentes:** Aderência ao sistema de design fornecido pelo ShadCN/UI para uma aparência coesa e profissional.
- **Acessibilidade (a11y):** Garantir que a aplicação siga as diretrizes do WCAG, incluindo navegação por teclado, uso correto de atributos ARIA para leitores de tela e contraste de cores adequado.

---

## 5. Instruções de Build e Deploy

- **Desenvolvimento Local:** `npm run dev`.
- **Build para Produção Web:** `npm run build`.
- **Preparação para Android (Capacitor):**
  1. `npm run sync:android`: Executa o build, exporta o site estático e sincroniza com o projeto Android.
  2. Abrir a pasta `android` no Android Studio para compilar e gerar o APK.
- **Deploy no Firebase App Hosting:** O `apphosting.yaml` está configurado para um deploy simples na infraestrutura do Firebase.

---

## 6. Estratégia de Testes

- **Testes Unitários (Jest/Vitest):** Para funções utilitárias (`/lib`), hooks (`/hooks`) e componentes de UI isolados para garantir que funcionem como esperado.
- **Testes de Integração (React Testing Library):** Para fluxos que envolvem múltiplos componentes e interações com os contextos (ex: adicionar uma transação e verificar se o `finance-context` é atualizado).
- **Testes End-to-End (Cypress/Playwright):** Para validar os fluxos críticos do usuário de ponta a ponta (ex: "login > adição de transação por IA > verificação no gráfico e na lista > logout").
