**Brief de Design para Figma: FinanAI - Seu Companheiro Financeiro Inteligente**

**Objetivo:** Criar uma experiência de usuário intuitiva, moderna e "lovable" para o aplicativo FinanAI, um gerenciador de finanças pessoais multiplataforma com recursos de IA. O design deve priorizar a clareza, a facilidade de uso e uma estética visual atraente.

**Público-alvo:** Indivíduos que buscam simplificar a gestão de suas finanças, com ou sem conhecimento prévio em aplicativos financeiros.

**Diretrizes Gerais de UI/UX:**

*   **Mobile-First:** Priorizar a experiência em dispositivos móveis, com navegação otimizada (barra de navegação inferior).
*   **Responsividade:** O design deve se adaptar perfeitamente a diferentes tamanhos de tela (mobile e web).
*   **Feedback Visual:** Implementar toasts e indicadores de carregamento (loaders) para manter o usuário informado sobre o status das ações.
*   **Consistência:** Utilizar um sistema de design (como ShadCN/UI) para garantir a padronização dos componentes e uma identidade visual coesa.
*   **Estética:** Priorizar um visual limpo, moderno e amigável, que transmita confiança e simplicidade.

**Fluxos Essenciais para Design (Figma):**

1.  **Autenticação e Acesso:**
    *   **Tela de Login/Cadastro:** Design para login com Google e Email/Senha.
    *   **Modo Convidado:** Fluxo para explorar o app sem necessidade de cadastro (dados locais).
    *   **Persistência de Sessão:** Indicação visual de usuário logado.
    *   **Proteção de Rotas:** Telas de redirecionamento para login, se necessário.

2.  **Contas a Pagar (`/bills`):**
    *   **Tela Principal de Contas:** Exibição de uma lista de contas com status visual (Pago, Vencido, A Vencer).
    *   **Adicionar Nova Conta:** Formulário para adicionar contas recorrentes (descrição, valor, dia do vencimento).
    *   **Marcar como Paga:** Interação para marcar uma conta como paga para o mês corrente.

3.  **Metas Financeiras (`/goals`):**
    *   **Tela Principal de Metas:** Exibição de metas de poupança com barra de progresso (valor atual vs. valor alvo).
    *   **Criar Nova Meta:** Formulário para definir novas metas (nome, valor alvo).
    *   **Contribuir para Meta:** Fluxo para adicionar contribuições a uma meta existente.

**Considerações Adicionais:**

*   Pense em como a Inteligência Artificial pode ser sutilmente integrada na experiência para simplificar tarefas (ex: entrada de dados de transações - não é um fluxo principal de design, mas o conceito deve ser transmitido).
*   Priorize a facilidade de navegação e a clareza das informações.
*   Crie componentes reutilizáveis sempre que possível.