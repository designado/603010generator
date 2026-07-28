# 60·30·10 Color Generator

Ferramenta leve para gerar paletas de cores harmoniosas usando a regra **60-30-10**. Ideal para designers, desenvolvedores e criadores que querem criar uma paleta equilibrada com apenas uma cor de destaque.

![screenshot](assets/img/og-image.png)

---

## Sobre

A regra 60-30-10 é uma técnica clássica de composição de cores que divide o layout em:

- **60%** — cor dominante: grandes áreas e fundos
- **30%** — cor secundária: elementos de suporte e seções de destaque
- **10%** — cor de destaque: botões, ícones, detalhes e chamadas à ação

Nesta ferramenta, você escolhe apenas a cor de destaque e o gerador cria automaticamente as cores dominante e secundária com harmonia cromática.

---

## Recursos

- 🎨 Seletor de cor visual com feedback de clique
- 🔀 Geração de nova variação da paleta
- 🔒 Trava individual para as cores 60% e 30%
- 👁️ Preview de layout com a paleta ativa em nova janela
- 📋 Clique para copiar códigos HEX
- 🔍 Contraste automático de texto sobre cada cor
- 📱 Layout responsivo para mobile e desktop
- 🌈 Algoritmos de harmonia: análoga, complementar, split, tríade e monocromática

---

## Estrutura do projeto

```
603010-generator/
├── index.html          # Estrutura HTML e metadados SEO
├── assets/
│   ├── css/
│   │   └── style.css   # Estilos, layout, responsividade e animações
│   ├── js/
│   │   ├── colors.js   # Funções de cor e geração de paletas
│   │   └── app.js      # Comportamento da interface, eventos e preview
│   └── img/
│       ├── favicon.svg # Favicon
│       └── pix.JPG     # QR Code Pix
└── README.md
```

> Projeto sem dependências externas. Funciona com HTML, CSS e JavaScript puros diretamente no browser.

---

## Uso local

1. Clone o repositório:

```bash
git clone https://github.com/603010generator/603010-generator.git
cd 603010-generator
```

2. Abra `index.html` no navegador.

Não é necessário servidor.

---

## Como funciona o gerador

A lógica principal está em `assets/js/colors.js`.

1. A cor do usuário é lida como um valor HEX
2. Ela é convertida para HSL
3. O gerador escolhe uma harmonia e ajusta a matiz
4. As cores resultantes voltam para HEX
5. O app aplica a paleta no DOM com contraste de texto automático

### Locks de cor

O estado de travamento (`locked.c60`, `locked.c30`) preserva a cor correspondente ao gerar novas variações.

---

## Atualizações de SEO e domínio

As tags principais já estão configuradas para `https://603010generator.com`:

- `title`
- `description`
- `canonical`
- Open Graph
- Twitter/X Card
- JSON-LD Schema.org

Atualize as URLs e imagens OG antes de publicar em outro domínio.

---

## Personalização

- Substitua o QR Code Pix em `assets/img/pix.JPG` se desejar usar outra chave
- Ajuste o link de suporte no botão do GitHub em `index.html`
- Configure o favicon ou outros ativos em `assets/img`

---

## Dicas de publicação

- Use `assets/img/og-image.png` com 1200×630px para redes sociais
- Verifique se o `canonical` aponta para o domínio real
- Garanta que o `title` e a `description` reflitam o nome do projeto

---

## Licença

MIT — sinta-se livre para usar, modificar e distribuir.
