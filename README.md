# 🎓 StudyTerminal

> **Terminal web para execução segura de Python entre amigos.**

<img width="1882" height="851" alt="Captura de tela 2025-09-02 114118" src="https://github.com/user-attachments/assets/af179b22-d19e-45c8-916f-44f6f057c870" />

## 🤔 O que é isso?

É basicamente um VS Code web minimalista com execução de Python, mas pensado para ser usado entre amigos que estudam programação.



## ✨ Features

**🔒 Acesso Restrito:** Só quem você autorizar consegue entrar (whitelist de emails)  
**🐍 Python Básico:** Executa código com validações regex (não é sandbox real)  
**📁 Organização:** Pastas, disciplinas, favoritos - funciona bem  
**⚡ Monaco Editor:** Syntax highlight + 2 temas customizados  
**📱 Responsivo:** Funciona no mobile (mas é melhor no desktop)  
**☁️ Na Nuvem:** Firebase salva tudo automaticamente  

## 🔐 Como Funciona a Segurança

### Acesso Controlado
- **Whitelist de emails** - só quem você liberar consegue acessar
- **Registro desabilitado** - ninguém cria conta sem você saber
- **Rate limiting amigável** - 15 execuções/min, 200/hora (suficiente pra estudar)

### Execução Segura de Python  
- **Validação por regex** - bloqueia imports perigosos (os, sys, eval, etc.)
- **Ambiente restrito** - PATH e PYTHONPATH limitados
- **Timeout inteligente** - 45 segundos por execução
- **Logs estruturados** - você vê tudo que rola

> ⚠️ **Honestidade:** Não é um sandbox 100% à prova de hacker. É seguro pra uso entre amigos que não vão tentar quebrar o sistema de propósito.

### Setup para Amigos
1. **Edita a lista:** `src/config/allowedUsers.js` 
```javascript
export const ALLOWED_USERS = [
  'kauan@gmail.com',     // você  
  'amigo1@gmail.com',    // seus brothers
  'colega@facul.com',    // galera da facul
];
```

2. **Cria as contas:** Firebase Console → Authentication → Add User
3. **Deploy:** `npm run build && firebase deploy`


## 🛠️ Stack Técnica

**Frontend:** React 19 + Vite + TailwindCSS + Monaco Editor  
**Backend:** Firebase Functions (Python 3.13)  
**Database:** Firestore  
**Auth:** Firebase Authentication  
**Deploy:** Firebase Hosting (manual por enquanto)  

Escolhi Firebase porque é grátis pra projetos pequenos e cuida da infraestrutura. React porque é o que mais uso ultimamente no front-end. Python porque é o que a galera mais estuda na faculdade.

## 🚀 Como Rodar Localmente

```bash
# Clone e instala
git clone https://github.com/seu-usuario/study-terminal-app.git
cd study-terminal-app/frontend
npm install

# Configura Firebase (cria um projeto no console do Firebase)
# Crie um .env (não tem .env.example ainda)
# Edita o .env com suas credenciais

# Roda local
npm run dev

# Para testar functions local (opcional)
cd functions
pip install -r requirements.txt
firebase emulators:start --only functions
```

### Variáveis de Ambiente (.env)
```env
VITE_API_KEY=sua_firebase_key
VITE_AUTH_DOMAIN=seu-projeto.firebaseapp.com  
VITE_PROJECT_ID=seu-projeto-id
VITE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_MESSAGING_SENDER_ID=123456789
VITE_APP_ID=1:123456789:web:abcdef
VITE_API_BASE_URL=https://sua-function.cloudfunctions.net/execute_code
```

## 💻 Para Desenvolvedores

### Estrutura que Importa
```
src/
├── config/allowedUsers.js    # 🔒 Lista de quem pode entrar
├── context/AuthContext.jsx   # 🔐 Gerencia autenticação + whitelist  
├── pages/RegisterPage.jsx    # 🚫 Registro desabilitado por padrão
└── components/terminal/      # 🎨 UI do terminal

functions/
└── main.py                   # 🐍 Execução Python + logs + rate limit
```

### Principais Componentes
- **AuthContext:** Valida whitelist no login/registro
- **TerminalAppPage:** 365 linhas de terror organizado
- **Monaco Editor:** Syntax highlight Python/Markdown + tema Dracula  
- **Firestore:** Armazenamento de arquivos (logs opcionais no backend)

### Deploy Automático
```bash
# Depois de configurar tudo
npm run build
firebase deploy

# Por enquanto é deploy manual, mas funciona bem
# TODO: configurar GitHub Actions depois
```



