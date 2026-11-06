# Catálogo Dinâmico de Medicamentos & Autocompletar Inteligente

Sistema de memorização dinâmica e autocompletar de medicamentos com aprendizado automático e gerenciamento visual, eliminando a necessidade de alterar código para cadastrar ou atualizar medicamentos e preços.

> [!IMPORTANT]
> **Decisões recomendadas para a implementação:**
> - **Aprendizado Automático:** Toda vez que um item novo for lançado em uma Nota Fiscal ou Orçamento, o sistema salva e memoriza automaticamente o medicamento no catálogo da farmácia.
> - **Autocompletar Instantâneo:** Ao digitar os primeiros dígitos do código ou as primeiras letras do nome do medicamento, um menu suspenso sugere os itens cadastrados e preenche instantaneamente Código, Descrição e Valor Unitário.
> - **Painel de Gestão e Importação:** Uma aba dedicada para visualizar, cadastrar, editar preços e importar planilhas CSV/Excel do estoque do PDV sem nunca precisar mexer no código-fonte.

---

### 1. Visão Geral & Benefícios

- **O que faz:** Permite que operadores de caixa e administradores preencham medicamentos com agilidade instantânea. Ao digitar `ibu...` ou o código `4316`, o sistema já preenche a descrição completa e o valor padrão.
- **Público-alvo:** Operadores da Agafarma Tuparendi e administradores que emitem Notas Fiscais, Comprovantes de Entrega, Remessas de Vencidos e Orçamentos Judiciais.
- **Principal Valor:** Independência total do código-fonte. A farmácia pode ter 10 ou 10.000 medicamentos: eles são gerenciados diretamente pelo banco Supabase e pela interface do aplicativo.

---

### 2. Experiência do Usuário (UX) & Fluxos

#### A. Ao Lançar Itens (Notas Fiscais e Orçamentos)
1. O usuário clica no campo **"Descrição do Produto"** ou **"Código"**.
2. Ao digitar 2 caracteres (ex: `LOS` ou `174`), surge uma lista suspensa refinada com os medicamentos correspondentes, destacando código, nome e preço.
3. Ao clicar ou pressionar `Enter`, os campos **Código**, **Descrição** e **Valor Unitário** são preenchidos automaticamente.
4. Se o usuário digitar um medicamento inédito e confirmar o lançamento, o sistema pergunta ou memoriza automaticamente no catálogo para os próximos lançamentos.

#### B. Painel de Gerenciamento do Catálogo (Em Configurações ou Acesso Rápido)
1. Tabela com busca rápida e contagem total de itens.
2. Botão **"+ Novo Medicamento"** para cadastro individual rápido (Código, Descrição, Apresentação e Preço).
3. Botão **"Importar Planilha (CSV/Excel)"** para quem quiser importar a lista completa de produtos do sistema PDV de uma só vez.
4. Opções de edição rápida de preço e exclusão.

---

### 3. Decisões de Arquitetura & Banco de Dados

1. **Tabela Supabase (`medicamentos_catalogo`):**
   - `id`: UUID Primary Key.
   - `codigo`: TEXT (ex: "549", "1747").
   - `nome_descricao`: TEXT (ex: "LOSARTANA POT 50MG 30CP REV").
   - `apresentacao`: TEXT (opcional, ex: "30CP REV" ou "GTS 15ML").
   - `preco_unitario`: DECIMAL(10, 2) (preço padrão sugerido).
   - `created_at` e `updated_at`.
   - Políticas de RLS permitindo leitura a todos os operadores logados e inserção/atualização para operadores autorizados e administradores.

2. **Resiliência Offline / Cache Local:**
   - O aplicativo mantém um espelho dos medicamentos em `localStorage` para que a busca seja ultrarrápida (resposta em milissegundos sem delay de rede) e funcione mesmo se a conexão oscilar.

3. **Componente Reutilizável (`MedicamentoAutocompleteInput`):**
   - Componente React modular com acessibilidade de teclado (setas para cima/baixo, Enter para selecionar, Esc para fechar).
   - Integrado de forma limpa em:
     - `NotasFiscais.tsx` (NF Empresa & Comprovante de Entrega)
     - `NotasFiscais.tsx` (NF Vencidos)
     - `OrcamentosJudiciais.tsx` (Itens do Orçamento)

---

### 4. Diagrama da Arquitetura do Catálogo

```
┌─────────────────────────────────────────────────────────────┐
│                    Agafarma Tuparendi                       │
├──────────────────────────────┬──────────────────────────────┤
│  Módulo Notas Fiscais        │  Módulo Orçamentos           │
│  - NF Empresa / Comprovante  │  - Medicamentos Judiciais    │
│  - NF Vencidos               │                              │
└──────────────┬───────────────┴──────────────┬───────────────┘
               │                              │
               ▼                              ▼
    ┌──────────────────────────────────────────────────┐
    │     Componente: MedicamentoAutocompleteInput     │
    │     (Busca por Código ou Nome + Auto-preenchimento)│
    └──────────────────────────┬───────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
    ┌──────────────────────┐       ┌──────────────────────┐
    │  Cache Local Rápido  │ ◄───► │  Supabase (Tabela    │
    │  (localStorage)      │       │  medicamentos_       │
    │  - Busca Instantânea │       │  catalogo)           │
    │  - Funciona Offline  │       │  - Sincronização     │
    └──────────────────────┘       └──────────────────────┘
```

---

### 5. Plano de Entrega por Etapas

1. **Banco & Schema:** Criar o script SQL da tabela `medicamentos_catalogo` com RLS e semente inicial dos medicamentos já cadastrados nos comprovantes.
2. **Componente Autocomplete:** Desenvolver o componente com sugestão inteligente, navegação por teclado e auto-preenchimento simultâneo de Código, Nome e Valor.
3. **Integração nas Telas:** Conectar o componente nas abas de Notas Fiscais (Empresa e Vencidos) e Orçamentos Judiciais.
4. **Painel de Gestão & Importação:** Adicionar a área visual para visualizar, editar preços, adicionar itens e importar planilhas sem tocar em código.
