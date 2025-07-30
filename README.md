# StudyTerminal 🚀

## Um Repositório de Estudos na Nuvem com Estética de Terminal

StudyTerminal é uma aplicação web de código aberto projetada para ser o ambiente definitivo para estudantes de tecnologia organizarem suas anotações, códigos e projetos de estudo. Combinando a agilidade de um terminal com a robustez de um editor de código moderno, a plataforma oferece um espaço centralizado, seguro e acessível de qualquer lugar.

<p align="center">
  <img src="https://github.com/user-attachments/assets/9455af5c-ebb7-4f6e-a1d5-9b4bd85267ab" width="400" />
  <img src="https://github.com/user-attachments/assets/2c13ba39-3db1-4a15-a9b6-04521135ce5d" width="400" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/80eb4d7c-846e-462e-8b5a-cf01e76b84d8" width="400" />
  <img src="https://github.com/user-attachments/assets/eff84cad-276d-4793-afd0-327c943fc6e3" width="400" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/8dfda365-ab4b-46ea-87ac-70045cf69fc2" width="400" />
</p>


🔗 **Acesse a versão live:** 

https://files-terminal.web.app/

---

## ✨ Funcionalidades

* **🔐 Autenticação de Usuários:** Sistema completo de login e registro utilizando Firebase Authentication.
* **⚡ Banco de Dados Real-time:** Criação, edição e exclusão de arquivos com sincronização instantânea através do Firestore.
* **📝 Editor de Código Poderoso:**
    * Baseado no **Monaco Editor** (o motor do VS Code).
    * **Temas Dinâmicos:** Um tema *Dracula* para arquivos Python (`.py`) e um tema customizado estilo *Folha de Caderno* para anotações em Markdown (`.txt`).
    * Pré-visualização de Markdown em tempo real.
* **🐍 Execução de Código Python:** Um backend seguro com Firebase Cloud Functions permite que o código Python escrito no editor seja executado na nuvem, com o output exibido no terminal integrado.
* **🎨 Personalização da Interface:**
    * **Temas de Cores:** Alterne entre os temas Verde e Roxo para a interface.
    * **Sistema de Favoritos:** Marque arquivos importantes com uma estrela para que fiquem no topo da lista.
* **📱 Design Responsivo:** Interface totalmente adaptada para uma experiência de uso consistente em desktops, tablets e smartphones.
* **🔒 Configuração Segura:** Utilização de variáveis de ambiente (`.env`) para proteger as credenciais do Firebase e regras de segurança no Firestore para garantir que cada usuário só acesse seus próprios dados.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído com um stack moderno de tecnologias JavaScript e serviços em nuvem:

| Frontend                                                                                                 | Backend / Infraestrutura                                                                                    |
| -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [**React.js**](https://reactjs.org/) (com Hooks e Context API)                                           | [**Firebase**](https://firebase.google.com/) (Auth, Firestore, Cloud Functions, Hosting)                    |
| [**Vite**](https://vitejs.dev/) (Build tool ultrarrápida)                                                | [**Python**](https://www.python.org/) (para a Cloud Function de execução de código)                           |
| [**Tailwind CSS**](https://tailwindcss.com/) (para estilização responsiva e customizável)                | [**Node.js**](https://nodejs.org/) (ambiente de execução para o Firebase)                                     |
| [**@monaco-editor/react**](https://github.com/suren-atoyan/monaco-react) (integração do editor VS Code)   |                                                                                                             |
| [**Lucide React**](https://lucide.dev/) (para os ícones)                                                 |                                                                                                             |

---

## 🔧 Como Executar Localmente

Para clonar e executar este projeto na sua máquina, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/kauanfeelipe/studyterminal.git]
    cd study-terminal/frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure suas variáveis de ambiente:**
    * Crie um arquivo `.env.local` na pasta `frontend`.
    * Copie o conteúdo do arquivo `.env.example` e preencha com suas próprias credenciais do Firebase.
    ```
    VITE_API_KEY="SUA_API_KEY"
    VITE_AUTH_DOMAIN="SEU_AUTH_DOMAIN"
    # ... e as outras variáveis
    ```

4.  **Execute o emulador do Firebase (opcional, mas recomendado):**
    * Para testar a Cloud Function localmente, inicie o emulador do Firebase em outro terminal.
    * Certifique-se de que o `VITE_API_BASE_URL` no seu `.env.local` aponta para o endereço do emulador.

5.  **Inicie a aplicação:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173`.

---

## 🧠 Desafios e Aprendizados

Este projeto foi uma excelente oportunidade para aprofundar conhecimentos em:

* **Gerenciamento de Estado em Larga Escala:** Lidar com múltiplos estados, desde dados do servidor (Firestore) até estados de UI (temas, modais, abas ativas) de forma organizada com React Hooks e Context API.
* **Segurança de Backend:** Implementar um backend seguro do zero, com autenticação de token, regras de acesso no banco de dados e controle de CORS para proteger a API.
* **Fluxo de Deploy (CI/CD):** Entender a diferença e o processo de deploy para um frontend estático e para uma função de backend, e como automatizar isso.
* **Customização Avançada de Componentes:** Configurar e estender bibliotecas complexas como o Monaco Editor com temas e opções personalizadas.

---


Desenvolvido por Kauan Felipe.
