# 🚀 StudyTerminal

> **Uma plataforma web inovadora para aprendizado e execução de código Python com interface terminal interativa.**

<img width="1882" height="851" alt="Captura de tela 2025-09-02 114118" src="https://github.com/user-attachments/assets/af179b22-d19e-45c8-916f-44f6f057c870" />


## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)



## 🎯 Sobre o Projeto

O **StudyTerminal** é uma aplicação web educacional que proporciona um ambiente de desenvolvimento Python integrado com interface terminal. Desenvolvida especificamente para estudantes de programação, oferece um ambiente seguro e intuitivo para praticar código Python, organizar projetos por disciplinas e visualizar resultados em tempo real.

### ✨ Diferenciais

- **Interface Terminal Autêntica**: Design inspirado em terminais Unix com temas personalizáveis
- **Editor de Código Avançado**: Monaco Editor com syntax highlighting e autocomplete
- **Organização Acadêmica**: Sistema de pastas e categorização por disciplinas
- **Execução Segura**: Ambiente controlado para execução de código Python
- **Sincronização Cloud**: Todos os projetos salvos automaticamente no Firebase

## 🚀 Funcionalidades

### 📝 Editor de Código
- **Editor Monaco** com syntax highlighting para Python e Markdown
- **Suporte a múltiplos arquivos** com sistema de abas
- **Preview em tempo real** para arquivos Markdown
- **Autocompletar** e **validação de sintaxe**
- **Temas personalizáveis** (Verde Terminal / Roxo)

### 🗂️ Gerenciamento de Arquivos
- **Sistema de pastas** para organização hierárquica
- **Categorização por disciplinas** (Análise de Sistemas, Estrutura de Dados, Redes)
- **Sistema de favoritos** para acesso rápido
- **Busca avançada** por nome, conteúdo e categoria
- **Download de arquivos** para backup local

### ⚡ Terminal Integrado
- **Execução de código Python** em ambiente controlado
- **Output em tempo real** com formatação preservada
- **Histórico de execuções** persistente
- **Feedback visual** de status (sucesso/erro)

### 🔐 Autenticação e Segurança
- **Firebase Authentication** com email/senha
- **Sessões seguras** com JWT tokens
- **Isolamento de usuários** - cada usuário acessa apenas seus arquivos
- **Rotas protegidas** com validação de autenticação

## 🛠️ Tecnologias Utilizadas

### Frontend
```json
{
  "framework": "React 19.1.0",
  "bundler": "Vite 5.2.0", 
  "styling": "TailwindCSS 3.4.3",
  "editor": "Monaco Editor 4.7.0",
  "routing": "React Router DOM 7.7.0",
  "http": "Axios 1.10.0",
  "markdown": "React Markdown 10.1.0",
  "icons": "Lucide React 0.525.0"
}
```

### Backend
```json
{
  "runtime": "Python 3.13",
  "framework": "Firebase Functions",
  "auth": "Firebase Authentication", 
  "database": "Cloud Firestore",
  "hosting": "Firebase Hosting"
}
```

### DevOps e Ferramentas
- **ESLint** para qualidade de código
- **PostCSS** para processamento CSS
- **Firebase CLI** para deploy
- **Git** para controle de versão



### Fluxo de Dados
1. **Autenticação**: Usuario faz login via Firebase Auth
2. **Autorização**: JWT token validado em todas as requests
3. **Armazenamento**: Arquivos salvos no Firestore com isolamento por usuário
4. **Execução**: Código enviado para Firebase Function que executa em ambiente Python
5. **Resultado**: Output retornado ao cliente em tempo real

## 📦 Instalação e Configuração

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **Python** 3.11+ 
- **Firebase CLI**
- **Git**

### 🔧 Configuração Local

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/study-terminal-app.git
cd study-terminal-app/frontend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie o arquivo .env na pasta frontend
cp .env.example .env
```

Preencha o `.env` com suas credenciais Firebase:
```env
VITE_API_KEY=sua_api_key_firebase
VITE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_PROJECT_ID=seu_projeto_id
VITE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_MESSAGING_SENDER_ID=123456789
VITE_APP_ID=1:123456789:web:abcdef
VITE_API_BASE_URL=https://sua_funcao_firebase.cloudfunctions.net/execute_code
```

4. **Configure o Firebase Functions**
```bash
cd functions
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
```

5. **Execute em desenvolvimento**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Functions (opcional, para teste local)
firebase emulators:start --only functions
```

### 🚀 Deploy para Produção

1. **Build do frontend**
```bash
npm run build
```

2. **Deploy para Firebase**
```bash
firebase deploy
```

## 💡 Como Usar

### 1. **Primeiro Acesso**
- Acesse a aplicação e clique em "Registrar"
- Crie sua conta com email e senha
- Faça login para acessar o terminal

### 2. **Criando seu Primeiro Arquivo**
- Clique no botão "+" na navegação
- Selecione "Novo Arquivo"
- Preencha nome, disciplina e tipo (Python/Texto)
- Comece a programar!

### 3. **Organizando com Pastas**
- Clique no botão "+" e selecione "Nova Pasta"
- Nomeie sua pasta (ex: "Algoritmos", "Projetos")
- Mova arquivos para pastas usando o menu de contexto

### 4. **Executando Código Python**
- Escreva seu código Python no editor
- Clique no botão "▶ Executar" ou use Ctrl+E
- Veja o resultado no terminal integrado

### 5. **Busca e Filtros**
- Use a aba "Files" para navegar em seus arquivos
- Filtre por disciplina, tipo ou palavra-chave
- Ative "Mostrar apenas favoritos" para acesso rápido

## 📁 Estrutura do Projeto

```
study-terminal-app/
├── frontend/
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   │   ├── terminal/        # Componentes específicos do terminal
│   │   │   └── PrivateRoute.jsx # Proteção de rotas
│   │   ├── context/             # Context APIs
│   │   │   └── AuthContext.jsx  # Gerenciamento de autenticação
│   │   ├── pages/               # Páginas da aplicação
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── TerminalAppPage.jsx
│   │   ├── services/            # Serviços e APIs
│   │   │   ├── api.js           # Cliente HTTP
│   │   │   └── firebase.js      # Configuração Firebase
│   │   ├── themes/              # Temas do editor
│   │   └── assets/              # Recursos estáticos
│   ├── functions/               # Firebase Functions
│   │   ├── main.py             # Função de execução Python
│   │   └── requirements.txt    # Dependências Python
│   ├── public/                 # Arquivos públicos
│   ├── dist/                   # Build de produção
│   └── firebase.json           # Configuração Firebase
```



### Documentação Técnica
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/)
- [TailwindCSS Guide](https://tailwindcss.com/docs)


