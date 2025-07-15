![Logo getIdea](https://getidea-front.surge.sh/assets/img/social/logo-getidea.svg)
# getIdea – Landing Page

## 🎨 Layout

Acesse o layout no Figma:

👉 [Abrir layout no Figma](https://www.figma.com/design/QnaGB0Ex6dkPX7dxHOmqot/getidea---landingPage?node-id=2707-1910&t=JjGJFhF9LSS11RRp-1)

## 🌐 Exemplo online

Veja o projeto em produção:

👉 [Abrir site publicado](https://getidea-front.surge.sh)

---

## 🏗 Princípios Arquiteturais

### SCSS
- **Modularidade**: Separação de estilos em módulos distintos
- **Componentização**: Estilos organizados por componentes e funcionalidades
- **Reutilização**: Uso de mixins e variáveis para consistência

### Templates
- **Nunjucks**: Sistema de template para componentização e reúso de código
- **Separação de Responsabilidades**: Layouts, includes e views claramente definidos

### Organização
- Separação clara entre recursos estáticos, templates e lógica
- Fácil manutenção e escalabilidade
- Preparado para desenvolvimento responsivo e moderno

---

## 🛠 Tecnologias Utilizadas

- **Frontend**: 
  - HTML5
  - SCSS
  - JavaScript (ES6+)
- **Compilação e Automação**: 
  - Gulp
  - Nunjucks
- **Ferramentas de Desenvolvimento**:
  - ESLint
  - Stylelint
  - Prettier
  - Husky (Git Hooks)
- **Deploy**: Surge.sh

---

## 📁 Estrutura de diretórios
```
src/
├── assets/                                 `Recursos do projeto`
│   ├── css/                                `CSS compilado`
│   ├── fonts/                              `Fontes utilizadas`
│   ├── img/                                `Imagens originais`
│   │   ├── brands/                         `Imagens da seção de logos`
│   │   ├── contact/                        `Imagens da seção de contato`
│   │   ├── favicon/                        `Ícones de favicon`
│   │   ├── hero/                           `Imagens da seção hero/banner`
│   │   ├── image/                          `Imagens da seção imagens`
│   │   ├── portfolio/                      `Imagens da seção portfólio`
│   │   ├── service/                        `Imagens da seção serviços`
│   │   └── social/                         `Imagens para redes sociais`
│   ├── js/                                 `Scripts JavaScript`
│   │   └── main.js                         `Script principal`
│   └── scss/                               `Arquivos SCSS organizados`
│       ├── base/                           `Estilos fundamentais`
│       │   ├── _page.scss                  `Estilos básicos da estrutura`
│       │   ├── _reset.scss                 `Reset de estilos padrão`
│       │   ├── _typography.scss            `Estilos de tipografia`
│       │   └── _variables.scss             `Variáveis globais de estilo`
│       ├── components/                     `Componentes reutilizáveis`
│       │   ├── _buttons.scss
│       │   ├── _cards.scss
│       │   ├── _cookies.scss
│       │   ├── _dots.scss
│       │   ├── _extras.scss
│       │   ├── _icons.scss
│       │   ├── _images.scss
│       │   ├── _indicator.scss
│       │   ├── _marquee.scss
│       │   ├── _nav.scss
│       │   ├── _pagination.scss
│       │   ├── _preloader.scss
│       │   ├── _search.scss
│       │   └── _side-navbar.scss
│       ├── layout/                         `Estilos de sections específicas`
│       │   ├── _brands.scss
│       │   ├── _contact.scss
│       │   ├── _footer.scss
│       │   ├── _getidea.scss
│       │   ├── _header.scss
│       │   ├── _hero.scss
│       │   ├── _letter.scss
│       │   ├── _portfolio.scss
│       │   └── _service.scss
│       ├── mixins/                         `Mixins SCSS`
│       │   ├── _breakpoints.scss           `Mixins de responsividade`
│       │   ├── _deprecate.scss             `Funções de depreciação`
│       │   ├── _functions.scss             `Funções SCSS utilitárias`
│       │   ├── _typography.scss            `Mixins de tipografia`
│       │   └── _utilities.scss             `Funções utilitárias`
│       ├── pages/                          `Estilos específicos de páginas`
│       │   └── _home.scss                  `Estilos da página inicial`
│       └── style.scss                      `Arquivo principal de entrada SCSS`
├── data/                                   `Arquivos auxiliares JSON`
│   └── dependencies.json                   `Configurações de dependências externas`
├── templates/                              `Templates Nunjucks`
│   ├── layouts/                            `Layouts base`
│   │   └── base.njk                        `Template principal`
│   └── includes/                           `Includes reutilizáveis`
│       ├── components/                     `Componentes reutilizáveis`
│       │   ├── card-portfolio.njk
│       │   ├── card-service.njk
│       │   └── side-navbar.njk
│       ├── meta/                           `Meta tags e SEO`
│       │   ├── _meta-seo.njk
│       │   ├── _meta-og.njk
│       │   └── _meta-twitter.njk
│       └── sections/                       `Templates de seções específicas`
│           ├── brands.njk 
│           ├── contact.njk
│           ├── footer.njk
│           ├── getidea.njk
│           ├── header.njk
│           ├── hero.njk
│           ├── image.njk
│           ├── letter.njk
│           ├── portfolio.njk
│           └──service.njk
├── views/                                  `Páginas principais do site`
│   └── index.njk                           `Página inicial`
└── static/                                 `Arquivos estáticos`
│   ├── robots.txt                          `Configurações para robôs de busca`
│   └── sitemap.xml                         `Mapa do site para SEO`
├── .babelrc                                `Configuração do Babel`
├── .editorconfig                            `Configurações de estilo de código`
├── .eslintrc.js                            `Configuração do ESLint`
├── .gitignore                              `Arquivos ignorados pelo Git`
├── .prettierrc                             `Configuração do Prettier`
├── .surgeignore                            `Arquivos ignorados no deploy Surge`
├── .nvmrc                                  `Versão do Node.js`
├── gulpfile.mjs                             `Configuração do Gulp`
├── package.json                            `Dependências e scripts`
├── purgecss.config.js                       `Configuração do PurgeCSS`
└── README.md                               `Documentação do projeto`
```

---

## 🚀 Como Rodar o Projeto

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 16.0.0 ou superior)
- Yarn instalado globalmente
- Gulp CLI globalmente

Instalar Yarn globalmente
```
npm install -g yarn
```

Instalar Gulp CLI globalmente
```
yarn global add gulp-cli
```

### 2. Instalar dependências

No diretório do projeto, execute:

```
yarn
```

### 3. Rodar localmente (com live reload)

```
yarn start
```

### 4. Acesse o projeto no navegador:

```
http://localhost:3000/
```

### 5. Build para produção

Compila o projeto e exporta para a pasta `/dist` com minificação ativada:

```
yarn build
```

### 6. Watch (modo desenvolvimento)

Compila e atualiza automaticamente a cada alteração nos arquivos da pasta `/src`:

```
yarn watch
```

### 7. Publicar no Surge

Faz o deploy da pasta `/dist` para a URL configurada:

```
yarn deploy
```

---

## ✅ Lint e Padronização

### Scripts Disponíveis

- `yarn lint`: Verifica erros de código
- `yarn lint:js`: Verificação de JavaScript
- `yarn lint:scss`: Verificação de SCSS
- `yarn format`: Formata automaticamente o código

### Configurações

`ESLint`: Configuração em eslint.config.js
`Stylelint`: Configuração em .stylelintrc.json

### Executar Lint:

Verificar erros
```
yarn lint
```

Corrigir automaticamente
```
yarn lint:fix
```

---

## ⚙️ Performance de Build

- Conversão automática de imagens para `.webp`
- Minificação de CSS e JavaScript
- Uso de `gulp-newer` para otimização de build
- Compressão de recursos (`gzip`)

---

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie sua feature branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova feature'`)
4. Faça o Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Commit

Utilize [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- `feat`: para novas funcionalidades
- `fix`: para correções
- `docs`: para documentação
- `style`: para formatações

---

## 📦 Gerenciamento de Dependências

### Adicionar Dependência

Dependência de produção
```
yarn add nome-do-pacote
```

Dependência de desenvolvimento
```
yarn add -D nome-do-pacote
```

Atualizar Dependências
```
yarn upgrade-interactive --latest
```

---

## 🛠️ Resolução de Problemas

### Erros Comuns

- **Falha na instalação**: 
  - Verifique versão do Node.js
  - Limpe cache do Yarn: `yarn cache clean`
  - Reinstale dependências: `yarn`
- **Erros de Lint**: 
  - Execute `yarn lint:fix`
  - Verifique configurações de lint
- **Suporte**: 
  - Abra uma issue no repositório
  - Verifique documentação das ferramentas


---

Criado por [**Limão Acidez Tecnológica**](http://www.thiagolima.com) 🍋