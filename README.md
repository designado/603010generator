# 60·30·10 Color Generator

Uma ferramenta minimalista e gratuita para gerar paletas de cores harmônicas usando a **regra 60-30-10** — um dos princípios mais usados no design de interiores, UI/UX e identidade visual.

---

## O que é a regra 60-30-10?

A regra divide o uso de cores em três proporções:

| Proporção | Papel | Descrição |
|-----------|-------|-----------|
| **60%** | Dominante | A cor que ocupa mais espaço — fundos, superfícies neutras |
| **30%** | Secundária | Complementa a dominante — menus, cards, seções de suporte |
| **10%** | Destaque | Sua cor escolhida — botões, ícones, elementos de ação |

O usuário define apenas a cor de **destaque (10%)**. A ferramenta gera automaticamente as outras duas com harmonia cromática real.

---

## Funcionalidades

- 🎨 **Seletor de cor** — círculo com animação de convite, sincronizado com input hex
- ⌨️ **Input hexadecimal** — digite diretamente o código da cor
- 🔀 **Nova variação** — gera uma nova paleta preservando a cor base (`espaço` ou botão)
- 🔒 **Travamento de cores** — trave o 60% ou 30% individualmente e continue variando o restante
- 👁️ **Preview** — abre uma nova aba com um layout completo renderizado com a paleta ativa
- 📋 **Copiar hex** — clique em qualquer código de cor para copiar
- 🎯 **Título dinâmico** — os números 60·30·10 no topo refletem as cores da paleta em tempo real
- 📱 **Responsivo** — faixas empilhadas verticalmente em mobile

### Harmonias suportadas

O algoritmo escolhe aleatoriamente entre cinco tipos de harmonia cromática:

- Análoga
- Complementar
- Complementar Split
- Tríade
- Monocromática

---

## Estrutura do projeto

```
603010-generator/
├── index.html          # Toda a estrutura HTML + SEO
├── assets/
│   ├── css/
│   │   └── style.css   # Estilos, responsividade, animações
│   ├── js/
│   │   ├── colors.js   # Utilitários de cor + gerador de harmonias
│   │   └── app.js      # Lógica da UI, eventos, locks, preview, modal Pix
│   └── img/
│       ├── favicon.svg # Favicon SVG
│       └── pix.JPG     # QR Code Pix (não incluso no repositório público)
└── README.md
```

> **Sem dependências externas.** Nenhum framework, nenhum bundler, nenhuma biblioteca. JavaScript puro (`var`, sem módulos ES) para funcionar diretamente via `file://` sem servidor.

---

## Como usar localmente

```bash
git clone https://github.com/designado/603010-generator.git
cd 603010-generator
```

Abra o `index.html` diretamente no browser. Não precisa de servidor.

---

## Como funciona o gerador de cores

Todo o algoritmo vive em `assets/js/colors.js`.

### Pipeline

```
cor do usuário (hex)
    ↓
hexToHsl()          — converte para HSL
    ↓
harmony.generate()  — aplica rotação de matiz + jitter aleatório
    ↓
hslToHex()          — converte de volta para hex
    ↓
applyPalette()      — atualiza o DOM com contraste automático
```

### Contraste automático

A função `luminance()` calcula a luminância relativa (WCAG 2.1) de cada cor gerada. Com base nisso, `textColor()` decide se o texto sobre aquela cor deve ser claro ou escuro — garantindo legibilidade em qualquer paleta.

### Travamento de cores

O estado de lock (`locked.c60`, `locked.c30`) é passado para `generatePalette()`, que preserva as cores travadas e gera apenas as livres. Quando ambas estão travadas, `randomHarmony` é desativado para que a harmonia não mude.

---

## SEO

A página inclui:

- Meta tags completas (`description`, `keywords`, `author`, `robots`, `canonical`)
- Open Graph para compartilhamento no WhatsApp, LinkedIn e Facebook
- Twitter/X Card
- JSON-LD Schema.org (`WebApplication`)
- Conteúdo textual semântico explicando a regra 60-30-10

Para a imagem OG funcionar, crie `assets/img/og-image.png` com 1200×630px.

---

## Apoie o projeto

Se esta ferramenta foi útil, considere apoiar:

- ❤️ [GitHub Sponsors](https://github.com/sponsors/designado)
- 💚 Pix — escaneie o QR Code dentro da própria ferramenta

---

## Licença

MIT — use, modifique e distribua livremente. Atribuição é bem-vinda mas não obrigatória.
