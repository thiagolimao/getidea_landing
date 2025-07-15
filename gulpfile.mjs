"use strict";

import gulp from "gulp";
import clean from "gulp-clean";
import * as browserSyncPkg from "browser-sync";
import mergeStream from "merge-stream";
import nunjucksRender from "gulp-nunjucks-render";
import beautify from "gulp-beautify";
import inject from "gulp-inject-string";
import replace from "gulp-replace";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import terser from "gulp-terser";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import os from "os";
import cleanCSS from "gulp-clean-css";
import babel from "gulp-babel";
import rename from "gulp-rename";
import surge from "gulp-surge";
import imagemin from "gulp-imagemin";
import imageminWebp from "imagemin-webp";
import eslint from "gulp-eslint-new";
import notifier from "node-notifier";
import tap from "gulp-tap";
import gzip from "gulp-gzip";
import compression from "compression";
import purgecss from "gulp-purgecss";
import * as fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import { readdirSync, statSync } from "fs";
import { fileURLToPath } from "url";
import { sync as globSync } from "glob";
import path from "path";

const browserSync = browserSyncPkg.create();
const sassCompiler = gulpSass(dartSass);

// Constantes de configuração
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diagnóstico inicial
console.log("Diretório de trabalho:", process.cwd());
console.log("Caminho do gulpfile:", import.meta.url);

// Carregamento de configurações
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Carregamento de configurações
const pkg = require("./package.json");
const dependencies = require("./src/data/dependencies.json");

// Constantes de build
const distDir = "./dist/";
const projectName = pkg.name;

// Definição de caminhos template
const TEMPLATE_PATHS = [
  "src/templates/",
  "src/templates/layouts/",
  "src/templates/includes/",
  "src/templates/includes/sections/",
  "src/templates/includes/components/",
  "src/templates/includes/meta/",
];

// Log dos diretórios de templates após definição
console.log(
  "Diretórios de templates:",
  TEMPLATE_PATHS.map((p) => path.resolve(p))
);

const SCSS_PATHS = [
  "./src/assets/scss",
  "./src/assets/scss/base",
  "./src/assets/scss/components",
  "./src/assets/scss/mixins",
];

const paths = {
  images: [
    "./src/assets/img/**/*.{png,jpg,jpeg}",
    "!./src/assets/img/social/**/*",
    "!./src/assets/img/favicon/**/*",
  ],
};

const credits = [
  `* Template Name: ${pkg.name} - v${pkg.version}`,
  `* Template URL: ${pkg.homepage}`,
  `* Author: ${pkg.author}`,
  `* License: ${pkg.license}`,
];

const purgecssConfig = {
  content: ["./dist/**/*.html", "./dist/**/*.njk", "./src/assets/js/**/*.js"],
  safelist: {
    standard: [
      /^swiper-/, // Para classes do Swiper
      /^active$/,
      /^card_active$/,
      /^sidenav-active$/,
      /^noscroll$/,
    ],
    deep: [
      /^(is-|has-)/, // Classes de estado
      /^(active|disabled|hidden)$/,
    ],
    greedy: [/^(swiper|scroll|navbar|dropdown)/],
  },
  blocklist: [/^data-/, /^aria-/],
  keyframes: true,
  fontFace: true,
};

console.log("Configuração do Browser Sync:", {
  browserSyncPkg: typeof browserSyncPkg,
  browserSync: typeof browserSync,
});

// Função de log de erro centralizada
function logError(taskName, error) {
  console.error(`❌ ${taskName} Error:`, {
    message: error.message,
    name: error.name,
    code: error.code,
    stack: error.stack,
  });

  notifier.notify({
    title: `${taskName} Error`,
    message: error.message,
    sound: true,
    timeout: 5,
  });
}

// Função de log de sucesso centralizada
function logSuccess(taskName, details = {}) {
  console.log(`✅ ${taskName} completed successfully`, details);
}

// Tarefas
function purgeCSS() {
  return gulp
    .src(`${distDir}assets/css/style.css`)
    .pipe(
      purgecss({
        ...purgecssConfig,
        // Configurações específicas de purge
        extractors: [
          {
            extractor: (content) => {
              return content.match(/[A-Za-z0-9-_:/]+/g) || [];
            },
            extensions: ["html", "njk", "js"],
          },
        ],
      })
    )
    .pipe(rename("style.purged.css"))
    .pipe(gulp.dest(`${distDir}assets/css/`))
    .on("error", function (err) {
      console.error("PurgeCSS Error:", err);
      this.emit("end");
    });
}

// Função para comprimir arquivos HTML
function compressHTML() {
  return gulp
    .src([`${distDir}/**/*.html`, `${distDir}/**/*.njk`])
    .pipe(
      gzip({
        append: false,
        gzipOptions: { level: 9 },
      })
    )
    .pipe(
      tap((file) => {
        console.log(`Compressed: ${file.path}`);
      })
    )
    .on("error", function (err) {
      console.error("HTML Compression Error:", err);
      this.emit("end");
    })
    .pipe(gulp.dest(distDir));
}

// Função para comprimir CSS
function compressCSS() {
  return gulp
    .src(`${distDir}assets/css/*.css`)
    .pipe(
      gzip({
        append: false,
        gzipOptions: { level: 9 },
      })
    )
    .pipe(gulp.dest(`${distDir}assets/css/`));
}

// Função para comprimir JavaScript
function compressJS() {
  return gulp
    .src(`${distDir}assets/js/*.js`)
    .pipe(
      gzip({
        append: false,
        gzipOptions: { level: 9 },
      })
    )
    .pipe(gulp.dest(`${distDir}assets/js/`));
}

// Função para comprimir SVGs e outros arquivos de texto
function compressSVG() {
  return gulp
    .src(`${distDir}assets/img/**/*.svg`)
    .pipe(
      gzip({
        append: false,
        gzipOptions: { level: 9 },
      })
    )
    .pipe(gulp.dest(`${distDir}assets/img/`));
}

function deployLint() {
  return gulp
    .src([
      "src/**/*.js",
      "src/**/*.mjs",
      "!src/assets/js/main.js", // Exclua temporariamente o main.js se necessário
    ])
    .pipe(
      eslint({
        overrideConfigFile: path.join(__dirname, "eslint.config.js"),
      })
    )
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
}

function lintJS() {
  return gulp
    .src([
      "src/**/*.js",
      "src/**/*.mjs",
      "!src/assets/js/main.js", // Exclua temporariamente o main.js se necessário
    ])
    .pipe(
      eslint({
        overrideConfigFile: path.join(__dirname, "eslint.config.js"),
      })
    )
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
}

function lintSCSS() {
  console.log("SCSS Linting skipped");
  return Promise.resolve();
}

function cleanDist() {
  return gulp.src(distDir, { allowEmpty: true, read: false }).pipe(clean());
}

function convertWEBP() {
  return gulp
    .src(paths.images)
    .pipe(imagemin([imageminWebp({ quality: 75 })]))
    .pipe(rename({ extname: ".webp" }))
    .pipe(gulp.dest(distDir + "assets/img"));
}

function updateHTML() {
  return gulp
    .src([distDir + "**/*.html", distDir + "**/*.njk"])
    .pipe(
      replace(/<head[^>]*>[\s\S]*?<\/head>/gi, (match) => {
        return `<!--__HEAD_PLACEHOLDER__START__-->${Buffer.from(match).toString(
          "base64"
        )}<!--__HEAD_PLACEHOLDER__END__-->`;
      })
    )
    .pipe(replace(/\.(png|jpg|jpeg)/gi, ".webp"))
    .pipe(
      replace(
        /<!--__HEAD_PLACEHOLDER__START__-->(.*?)<!--__HEAD_PLACEHOLDER__END__-->/g,
        (_, base64) => Buffer.from(base64, "base64").toString("utf8")
      )
    )
    .pipe(gulp.dest(distDir));
}

function minifyCSS() {
  return gulp
    .src(distDir + "assets/css/style.css", { allowEmpty: true })
    .pipe(
      cleanCSS({
        compatibility: "ie8",
        level: {
          1: {
            specialComments: false, // Remove comentários especiais
          },
          2: {
            mergeMedia: true, // Mescla regras de media query
            removeEmpty: true, // Remove regras vazias
          },
        },
      })
    )
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest(distDir + "assets/css"))
    .pipe(browserSync.stream());
}

function compileJS() {
  return gulp
    .src("./src/assets/js/main.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
        sourceType: "script",
      })
    )
    .pipe(
      terser({
        compress: {
          dead_code: true,
          drop_console: true,
          passes: 2,
          pure_funcs: ["console.log"],
          unused: true,
          drop_debugger: true,
        },
        mangle: {
          toplevel: true,
        },
        output: {
          comments: false,
        },
      })
    )
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest(distDir + "assets/js"))
    .pipe(browserSync.stream());
}

function minifyJS() {
  return gulp
    .src([`${distDir}assets/js/main.js`, `${distDir}assets/js/main-min.js`], {
      allowEmpty: true,
    })
    .pipe(gulp.dest(`${distDir}assets/js/`))
    .on("error", function (err) {
      console.error("Minify JS Error:", err);
      this.emit("end");
    });
}

function deploy() {
  return surge({
    project: distDir,
    domain: `${projectName}-front.surge.sh`,
  });
}

function watchFiles() {
  // Watch para arquivos SCSS
  gulp
    .watch("./src/assets/scss/**/*.scss", gulp.series(compileSCSS, minifyCSS))
    .on("change", browserSync.reload);

  // Watch para arquivos HTML/Nunjucks
  gulp
    .watch("./src/**/*.{html,njk}", gulp.series(compileHTML, updateHTML))
    .on("change", browserSync.reload);

  // Watch para JavaScript
  gulp
    .watch("./src/assets/js/main.js", gulp.series(compileJS, minifyJS))
    .on("change", browserSync.reload);

  // Watch para arquivos de imagem
  gulp
    .watch(
      ["./src/assets/img/**/*", "!./src/assets/img/**/*.{png,jpg,jpeg}"],
      gulp.series(copyFiles)
    )
    .on("change", browserSync.reload);

  // Watch para conversão de imagens
  gulp
    .watch(
      "./src/assets/img/**/*.{png,jpg,jpeg}",
      gulp.series(convertWEBP, updateHTML)
    )
    .on("change", browserSync.reload);

  // Watch para arquivos copiados
  gulp
    .watch(
      [
        "./src/assets/**/*",
        "!./src/assets/js/main.js",
        "!./src/assets/scss/**/*.scss",
        "!./src/assets/img/**/*",
      ],
      gulp.series(copyFiles)
    )
    .on("change", browserSync.reload);
}

function initBrowserSync(done) {
  browserSync.init({
    server: {
      baseDir: distDir,
      middleware: [compression()],
    },
    port: 3000,
    notify: true, // Ative as notificações do BrowserSync
    open: true, // Abre automaticamente no navegador
    reloadOnRestart: true,
    ui: {
      port: 3001,
    },
    files: [
      `${distDir}**/*.html`,
      `${distDir}assets/css/*.css`,
      `${distDir}assets/js/*.js`,
      `${distDir}assets/img/**/*`,
    ],
  });
  done();
}

function copyFiles() {
  // Log de verificação de arquivos
  console.log("🔍 Verificando arquivos SVG:");
  console.log("Root SVGs:", globSync("./src/assets/img/*.svg"));
  console.log("Nested SVGs:", globSync("./src/assets/img/**/*.svg"));

  const startTime = Date.now();

  const copyConfig = [
    {
      src: "./src/assets/fonts/**/*",
      dest: "fonts",
      type: "Fonts",
    },
    {
      // Conteúdo da pasta favicon sem repetir a estrutura
      src: "./src/assets/img/favicon/*",
      dest: "img/favicon",
      type: "Favicon Files",
      base: "./src/assets/img/favicon",
    },
    {
      src: ["./src/assets/img/social/**/*.{jpg,jpeg,png,svg}"],
      dest: "img/social",
      type: "Social Images",
      base: "./src/assets/img/social",
    },
    {
      // SVGs da raiz da pasta img
      src: "./src/assets/img/*.svg",
      dest: "img",
      type: "Root SVGs",
      base: "./src/assets/img",
    },
    {
      // SVGs de subpastas da img
      src: "./src/assets/img/**/*.svg",
      dest: "img",
      type: "Nested SVGs",
      base: "./src/assets/img",
    },
    {
      // Site webmanifest e outros arquivos de favicon
      src: "./src/assets/img/favicon/*.webmanifest",
      dest: "img/favicon",
      type: "Favicon Manifest",
      base: "./src/assets/img/favicon",
    },
  ];

  console.log(
    "Arquivos na pasta social:",
    globSync("./src/assets/img/social/**/*")
  );

  const tasks = copyConfig.map((config) => {
    return gulp
      .src(config.src, {
        allowEmpty: true,
        base: config.base || "./src/assets",
      })
      .pipe(
        tap((file) => {
          console.log(`📦 Copying Social File: ${file.path}`);
        })
      )
      .pipe(gulp.dest(`${distDir}assets/${config.dest}`))
      .on("error", (err) => {
        console.error("Error copying social files:", err);
      })
      .on("end", () => {
        console.log(`Copiado ${config.type}: ${config.src}`);
      });
  });

  return mergeStream(...tasks).on("end", () => {
    const endTime = Date.now();

    // Verificação final dos arquivos copiados
    const copiedFiles = globSync(`${distDir}assets/img/social/**/*`);
    console.log("Arquivos copiados para dist:", copiedFiles);

    logSuccess("Copy Files", {
      duration: `${endTime - startTime}ms`,
    });
  });
}

function compileHTML(callback) {
  // Caminhos dos templates
  const templatePaths = [
    "src/templates/",
    "src/templates/layouts/",
    "src/templates/includes/",
    "src/templates/includes/sections/",
    "src/templates/includes/components/",
    "src/templates/includes/meta/",
  ];

  // Log detalhado de templates disponíveis
  templatePaths.forEach((templatePath) => {
    try {
      const fullPath = path.resolve(templatePath);
      console.log(`Verificando templates em: ${fullPath}`);

      // Verifica se o diretório existe
      if (!existsSync(fullPath)) {
        console.warn(`Diretório não encontrado: ${fullPath}`);
        return;
      }

      // Lista arquivos .njk
      const files = readdirSync(fullPath);
      const njkFiles = files.filter((file) => file.endsWith(".njk"));

      console.log(`Templates em ${templatePath}:`, njkFiles);
    } catch (error) {
      console.error(`Erro ao ler diretório ${templatePath}:`, error);
    }
  });

  // Verifica arquivos de views
  const viewsPath = path.resolve("src/views");
  console.log(`Verificando arquivos de views em: ${viewsPath}`);

  const viewFiles = globSync("src/views/*.njk");
  console.log("Arquivos de view encontrados:", viewFiles);

  // Se nenhum arquivo de view for encontrado, crie um fallback
  if (viewFiles.length === 0) {
    console.error("Nenhum arquivo .njk encontrado em src/views");

    // Cria um HTML básico de fallback
    const fallbackContent = `
    {% extends "layouts/base.njk" %}
    
    {% block content %}
    <main>
      <h1>Projeto ${pkg.name}</h1>
      <p>Página de fallback</p>
    </main>
    {% endblock %}
    `;

    // Salva o fallback
    const fallbackPath = path.join(viewsPath, "home.njk");
    try {
      fs.writeFileSync(fallbackPath, fallbackContent);
      console.log(`Criado arquivo de fallback: ${fallbackPath}`);
    } catch (error) {
      console.error("Erro ao criar arquivo de fallback:", error);
      return callback(error);
    }
  }

  // Processa dependências
  const processedDependencies = Object.entries(dependencies || {}).map(
    ([name, dependency]) => ({
      css: dependency.css_link
        ? `<link href="${dependency.css_link}" rel="stylesheet" rel="preload">`
        : "",
      js: dependency.js_link
        ? `<script src="${dependency.js_link}"></script>`
        : "",
    })
  );

  // Extrai links de CSS e JS
  const css_links = processedDependencies.map((dep) => dep.css).join("");
  const js_links = processedDependencies.map((dep) => dep.js).join("");

  // Stream de compilação
  return gulp
    .src("src/views/*.njk")
    .pipe(
      tap((file) => {
        console.log(`Processando arquivo de view: ${file.path}`);
      })
    )
    .pipe(
      nunjucksRender({
        path: templatePaths,
        data: {
          projectName: pkg.name,
          serverName: pkg.server,
        },
      })
    )
    .on("error", (err) => {
      console.error("Erro detalhado no Nunjucks:", {
        message: err.message,
        fileName: err.fileName,
        lineNumber: err.lineNumber,
        stack: err.stack,
      });
      callback(err);
    })
    .pipe(
      inject.replace(
        "<!-- Vendor CSS Files -->",
        `<!-- Vendor CSS Files -->${css_links}`
      )
    )
    .pipe(
      inject.replace(
        "<!-- Vendor JS Files -->",
        `<!-- Vendor JS Files -->${js_links}`
      )
    )
    .pipe(beautify.html({ indent_size: 2, max_preserve_newlines: 1 }))
    .pipe(
      inject.replace(
        "</head>",
        `  <!-- =======================================================\n  ${credits.join(
          "\n  "
        )}\n  ======================================================== -->\n</head>`
      )
    )
    .pipe(gulp.dest(distDir))
    .pipe(browserSync.stream())
    .on("end", () => {
      console.log("HTML Compilation Completed");
      callback();
    });
}

function compileSCSS(callback) {
  return (
    gulp
      .src("./src/assets/scss/style.scss")
      .pipe(
        sassCompiler({
          outputStyle: "expanded",
          includePaths: SCSS_PATHS,
        }).on("error", function (err) {
          console.error("SCSS Compilation Error:", {
            message: err.message,
            file: err.file,
            line: err.line,
            column: err.column,
          });

          notifier.notify({
            title: "SCSS Compilation Error",
            message: `${err.message} in ${err.file}`,
            sound: true,
          });

          this.emit("end");
        })
      )
      .pipe(postcss([autoprefixer()]))
      .pipe(
        inject.prepend(
          "/**" +
            os.EOL +
            credits.join(os.EOL) +
            os.EOL +
            "*/" +
            os.EOL +
            os.EOL
        )
      )
      // Gera o CSS não minificado na pasta src (para desenvolvimento)
      .pipe(gulp.dest("./src/assets/css"))

      // Minificação e geração apenas do arquivo minificado na dist
      .pipe(
        cleanCSS({
          compatibility: "ie8",
          level: {
            1: {
              specialComments: false,
            },
            2: {
              mergeMedia: true,
              removeEmpty: true,
            },
          },
        })
      )
      .pipe(rename("style.min.css"))
      .pipe(gulp.dest(distDir + "assets/css"))
      .on("end", () => {
        console.log("CSS gerado:");
        console.log("- ./src/assets/css/style.css (não minificado)");
        console.log(`- ${distDir}assets/css/style.min.css (minificado)`);

        callback();
      })
  );
}

// Função de sincronização de estrutura de pastas
function syncFolderStructure(callback) {
  // Lista de pastas para sincronizar
  const folderStructure = [
    { src: "./src/assets/scss", dest: "./src/assets/css" },
  ];
  callback();

  // Cria pastas correspondentes se não existirem
  folderStructure.forEach(({ dest }) => {
    try {
      // Use métodos síncronos
      if (!existsSync(dest)) {
        mkdirSync(dest, { recursive: true });
        console.log(`Criada pasta: ${dest}`);
      }
    } catch (error) {
      console.error(`Erro ao criar pasta ${dest}:`, error);
    }
  });

  // Chame o callback para sinalizar conclusão
  callback();
}

// Build com controle de fluxo async/await
const build = gulp.series(deployLint, cleanDist, (callback) => {
  syncFolderStructure(() => {
    const buildStartTime = Date.now();
    console.log("🚀 Starting Build Process...");

    gulp.series(
      compileSCSS,
      compileJS,
      copyFiles,
      convertWEBP,
      compileHTML,
      updateHTML
    )((err) => {
      if (err) {
        console.error("Erro no processo de build:", err);
        logError("Build Process", err);
        callback(err);
      } else {
        const buildEndTime = Date.now();
        logSuccess("Build Process", {
          totalDuration: `${buildEndTime - buildStartTime}ms`,
          outputDirectory: distDir,
        });
        callback();
      }
    });
  });
});

// Tarefa padrão
const start = gulp.series(build, gulp.parallel(initBrowserSync, watchFiles));

// Exportações
export {
  cleanDist as clean,
  copyFiles as copy,
  compileHTML as html,
  convertWEBP as webp,
  updateHTML as updateHtml,
  compileSCSS as scss,
  minifyCSS,
  compileJS as js,
  minifyJS,
  deployLint as lint,
  lintJS as lintJS,
  lintSCSS as scssLint,
  watchFiles as watch,
  deploy,
  initBrowserSync as serve,
  start,
  build,
  compressHTML,
  compressCSS,
  compressJS,
  compressSVG,
  purgeCSS,
};

// Deploy
export const deployTask = gulp.series(build, deploy);
