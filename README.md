# ⏱️ CronoLean — Plataforma de Cronoanálise Industrial & Balanceamento Lean

**CronoLean** é uma plataforma web moderna, desenvolvida para engenharia industrial e equipes de melhoria contínua (Lean Manufacturing). Oferece cronometragem em tempo real, cálculo automatizado de Takt Time, classificação de agregação de valor (VA / NVA / BVA), gráficos Yamazumi dinâmicos, análise de Pareto de desperdícios e importação/exportação com dicionário de verbos operacionais padronizados.

---

## 🚀 Funcionalidades Principais

- 📱 **Progressive Web App (PWA 100% Offline)**: Instale como aplicativo nativo no celular (Android/iOS) ou no desktop (Chrome/Edge/Windows). Opera continuamente mesmo sem sinal de internet no chão de fábrica, com persistência local garantida.
- ⚡ **Atalhos Rápidos de App**: Acesso direto pela tela inicial do celular ao Cronômetro Industrial, aos Gráficos Yamazumi e à Matriz de Tempos.
- 📊 **Dashboard Lean & Visão Geral**: Métricas consolidadas de tempo de ciclo total, Takt Time, eficiência da linha e taxa de agregação de valor.
- 📉 **Gráficos Yamazumi Dinâmicos**: Visualização gráfica das estações de trabalho e subconjuntos, destacando visualmente sobrecargas em relação ao Takt Time.
- ⏱️ **Cronômetro Industrial Multi-Volta**: Cronometragem precisa com captura de voltas (laps), aplicação de fator de ritmo (%) e tolerâncias ergonômicas/fadiga.
- 📋 **Gestão de Operações & Balanceamento**: Tabela completa com cálculo de tempos padrão ($Tempo\ Padrão = Tempo\ Observado \times \frac{Ritmo}{100} \times (1 + Tolerâncias)$).
- 🏷️ **Dicionário de Verbos Lean**: Identificação e classificação automática de tarefas por padrões industriais (ex: *Apertar*, *Inspecionar*, *Aguardar*, *Buscar*).
- 🔄 **Importação & Exportação CSV Inteligente**: Compatibilidade total com planilhas Excel e separadores padrão industrial (`;` e `,`).
- 🖨️ **Folha de Cronoanálise para Impressão**: Layout pronto e otimizado para auditorias de campo e chão de fábrica.

---

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **Vite**
- **Vite Plugin PWA & Workbox** (Service Worker, Web App Manifest & Cache Offline)
- **Vanilla CSS / Design System Industrial** (Dark theme com estética aeroespacial/manufatura avançada)
- **ECharts & SVG Engine**

---

## 💻 Como Rodar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/Rauliyexe/cronolean.git
   cd cronolean
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

   Para expor na rede local (Wi-Fi/LAN para celulares ou tablets no chão de fábrica):
   ```bash
   npm run dev -- --host
   ```

---

Desenvolvido com foco em alta produtividade, rigor ergonômico e engenharia Lean.

