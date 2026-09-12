# 🖥️ Portfólio — João Batista

Portfólio pessoal desenvolvido para apresentar minha trajetória, habilidades e projetos como desenvolvedor Front-End. Construído com uma estética inspirada em terminal/hacker, com animações interativas e microinterações em cada seção.

🔗 **Demo ao vivo:** [joao-batista-portfolio.vercel.app](https://joao-batista-portfolio.vercel.app)
📂 **Repositório:** [github.com/joaobatis1a/portifolio](https://github.com/joaobatis1a/portifolio)

---

## ✨ Sobre o projeto

Site pessoal em single-page, com navegação por scroll suave entre seções, construído do zero com React + TypeScript. O visual segue uma identidade "terminal/console" (verde/ciano sobre fundo escuro), com efeitos de digitação, scanlines, partículas e cards com resposta 3D ao movimento do mouse.

## 🧩 Seções

- **Início** — hero com animação de digitação (`react-type-animation`)
- **Sobre** — terminal interativo que "inicializa" e revela informações pessoais
- **Habilidades** — grade de tecnologias por categoria (linguagens, frameworks, ferramentas)
- **Projetos** — cards de projetos desenvolvidos, com trailers e links para repositórios
- **Criação (Frontista)** — destaque de projeto autoral com efeitos visuais avançados
- **Formação** — linha do tempo da trajetória acadêmica e técnica
- **Experiência** — ficha de missão estilo "documento confidencial", com carimbo animado de conclusão
- **Contato** — cards de contato (e-mail, GitHub, LinkedIn, etc.)

## 🛠️ Stack

- **[React 19](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)**
- **[Vite](https://vite.dev/)** — build tool e dev server
- **[Tailwind CSS v4](https://tailwindcss.com/)** — estilização utilitária
- **[react-scroll](https://www.npmjs.com/package/react-scroll)** — navegação suave entre seções
- **[react-type-animation](https://www.npmjs.com/package/react-type-animation)** — efeito de digitação
- **ESLint** — padronização e qualidade de código

## 🚀 Rodando localmente

```bash
# Clone o repositório
git clone https://github.com/joaobatis1a/portifolio.git
cd portifolio

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O projeto abrirá em `http://localhost:5173` (porta padrão do Vite).

### Outros comandos

```bash
npm run build     # gera o build de produção em /dist
npm run preview   # pré-visualiza o build de produção localmente
npm run lint      # roda o ESLint
```

## 📦 Deploy

O projeto está pronto para deploy em qualquer plataforma que suporte builds Vite/estáticos, como [Vercel](https://vercel.com) ou [Netlify](https://netlify.com):

1. Conecte o repositório na plataforma escolhida
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy automático a cada `git push` na branch `main`

## 📁 Estrutura

```
src/
├── components/
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Skills.tsx
│   ├── Projects.tsx
│   ├── Frontista.tsx
│   ├── Training.tsx
│   ├── Experience.tsx
│   ├── Contact.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── BackToTop.tsx
│   └── StarBackground.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## 👤 Autor

**João Batista da Silva Neto**
Estudante de ADS — Centro Universitário UNIFAFIRE
Front-End Developer

- GitHub: [@joaobatis1a](https://github.com/joaobatis1a)

---

Feito com 💚 e bastante café.
