# 🎉 Event Buddy

_Event Buddy_ é uma aplicação móvel desenvolvida em **React Native** com **Expo** que facilita a descoberta, participação e gestão de eventos sociais e culturais. É a escolha ideal para utilizadores que pretendem:

- Explorar eventos por local, categoria ou nome  
- Guardar favoritos  
- Inscrever‑se e gerir participações  
- Manter uma agenda personalizada

---

## ✨ Funcionalidades

- 🔐 **Autenticação segura** com Firebase Authentication  
- ➕ **Registo** com e‑mail e palavra‑passe  
- 🔁 **Recuperação** de palavra‑passe por e‑mail  
- 🔓 **Logout** com limpeza da sessão  
- ♾️ **Sessão persistente** via AsyncStorage  
- 👤 **Área Pessoal**  
  - Lista de inscrições em eventos  
  - Edição de perfil  
  - Alteração de palavra‑passe  
- ⭐ Adição e remoção de **favoritos**  
- ✅ Inscrição e cancelamento em eventos  
- 🔍 **Filtro** por nome ou categoria  
- 📅 Lista detalhada de eventos disponíveis  
- 📍 **Localização** no Google Maps  
- 💬 **Chatbot** de apoio ao utilizador  
- 👋 Mensagem de boas‑vindas consoante a hora do dia  
- 📲 Navegação intuitiva com React Navigation  

---

## 🛠️ Tecnologias

| Camada | Tech |
| ------ | ---- |
| Frontend | React Native + Expo |
| Autenticação | Firebase Authentication |
| Estado/Sessão | AsyncStorage |
| Navegação | React Navigation |
| Mapas | Google Maps API |

---

## ✅ Pré‑requisitos

1. **Node.js** (última versão LTS recomendada)  
2. **npm** ou **yarn**  
3. **Expo CLI** (instalação global):

   ```bash
   npm install -g expo-cli

## ⚙️ Instalação
Clonar o repositório

git clone https://github.com/<o‑teu‑utilizador>/event‑buddy.git
cd event-buddy

## 2. Instalar dependências

```bash
# npm
npm install

# ou, se preferires yarn
yarn install

## 3. Configurar Firebase.

Preenche as tuas credenciais do Firebase.

## 4. Iniciar o projeto

```bash
npx expo start

---

## 📂 Estrutura de Pastas

```text
event-buddy/
├── assets/                  # Imagens e ícones usados na app
│   ├── background.jpg
│   ├── eventbuddy3.png
│   └── snack-icon.png
│
├── components/              # Componentes reutilizáveis
│   ├── AssetExample.js
│   └── EventCard.js
│
├── context/                 # Contexto global (ex: autenticação)
│   └── AuthContext.js
│
├── screens/                 # Ecrãs principais da aplicação
│   ├── ChangePassword.js
│   ├── EditProfile.js
│   ├── EventDetails.js
│   ├── Events.js
│   ├── Favorites.js
│   ├── Home.js
│   ├── Login.js
│   ├── Participates.js
│   ├── Profile.js
│   ├── RecoveryPassword.js
│   └── Signup.js
│
├── services/                # Lógica de serviços (ex: Firebase)
│   └── firebaseAuth.js
│
├── styles/                  # Estilos globais da aplicação
│   └── GlobalStyles.js
│
├── App.js                   # Ponto de entrada da aplicação
├── firebaseConfig.js        # Configurações do Firebase
├── package.json             # Dependências e scripts do projeto
└── README.md                # Documento de apresentação
