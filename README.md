# 🎉 Event Buddy

_Event Buddy_ é uma aplicação móvel desenvolvida com React Native e Expo, criada para facilitar a descoberta, participação e gestão de eventos sociais e culturais. Ideal para utilizadores que desejam explorar eventos, guardar os favoritos e manter uma agenda personalizada.

---

## ✨ Funcionalidades principais

- 🔐 Login seguro com **Firebase Authentication**
- 🆕 Registo de utilizadores com **email e palavra-passe**
- 🔁 Recuperação de palavra-passe via **email**
- 🔓 Logout com limpeza da sessão
- 🔒 Sessão persistente com **AsyncStorage**
- 👤 Área pessoal com:
  - Eventos em que estou inscrito
  - Edição de perfil
  - Alteração de palavra-passe
- ⭐ Adição e remoção de eventos favoritos
- ✅ Participação e cancelamento de inscrição em eventos
- 🔍 Filtro de eventos por **nome ou categoria**
- 📅 Lista de eventos disponíveis com detalhes completos
- 📍 Visualização da localização no **Google Maps**
- 💬 Chatbot integrado para apoio ao utilizador
- 👋 Mensagem de boas-vindas personalizada (consoante a hora do dia)
- 📲 Navegação intuitiva com **React Navigation**

---

## 🛠️ Tecnologias utilizadas

- React Native
- Expo
- Firebase Authentication
- React Navigation
- AsyncStorage
- Google Maps API

---

## ✅ Pré-requisitos

Antes de começares, certifica-te de que tens instalado:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- npm ou yarn
- Expo CLI (instalação global):

  ```bash
  npm install -g expo-cli

⚙️ Instalação e execução do projeto
Clona o repositório:

git clone https://github.com/seu-usuario/event-buddy.git
cd event-buddy

Instala as dependências:

 ```bash
 npm install
# ou
yarn install


3. Configura as credenciais do Firebase no ficheiro firebaseConfig.js.

4. Inicia o projeto:

```bash
npx expo start