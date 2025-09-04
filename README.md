# 🎓 StudyTerminal

> **Terminal web para execução segura de Python entre amigos. Porque estudar programação sozinho é chato.**

<img width="1882" height="851" alt="Captura de tela 2025-09-02 114118" src="https://github.com/user-attachments/assets/af179b22-d19e-45c8-916f-44f6f057c870" />

## 🤔 O que é isso?

É basicamente um VS Code web minimalista com execução de Python, mas pensado para ser usado entre amigos que estudam programação. Tem visual de terminal porque fica mais legal e dá aquela vibe hacker 😎

**Por que fiz?** Porque ficar mandando código pelo WhatsApp ou Discord é um saco, e queria algo simples para testar algoritmos com os colegas sem instalar nada.



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
4. **Profit:** Mandem o link e codem juntos! 🎉

## 🛠️ Stack Técnica

**Frontend:** React 19 + Vite + TailwindCSS + Monaco Editor  
**Backend:** Firebase Functions (Python 3.13)  
**Database:** Firestore  
**Auth:** Firebase Authentication  
**Deploy:** Firebase Hosting (manual por enquanto)  

Escolhi Firebase porque é grátis pra projetos pequenos e cuida da infraestrutura. React porque é o que mais uso. Python porque é o que a galera mais estuda na facul.

## 🚀 Como Rodar Localmente

```bash
# Clone e instala
git clone https://github.com/seu-usuario/study-terminal-app.git
cd study-terminal-app/frontend
npm install

# Configura Firebase (cria um projeto no console do Firebase)
# Crie um .env (não tem .env.example ainda)
touch .env
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
- **TerminalAppPage:** 365 linhas de terror organizado, mas funciona
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

## 🎯 Ideal Para

✅ **Portfólio de dev** - mostra skills de fullstack + segurança  
✅ **Estudos em grupo** - 2-5 pessoas, perfeito pra faculdade  
✅ **Prototipagem rápida** - testa algoritmos sem setup  
✅ **Projetos acadêmicos** - prof vai achar muito profissa  

## 💸 Custos (Spoiler: quase zero)

- **Firebase grátis até:** 50k reads, 20k writes, 10GB storage
- **Pra 4 amigos:** ~$0-5/mês 
- **Domínio custom:** ~$10/ano (opcional)

---

## 🤝 Contribuindo

Achou um bug? Tem uma ideia? Abre uma issue ou manda um PR!

Regras simples:
- Código limpo e comentado
- Teste antes de enviar  
- Mantenha a vibe de projeto estudantil

---

**Made with ☕ and a lot of StackOverflow**