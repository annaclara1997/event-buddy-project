# 🎉 Event Buddy

_Event Buddy_ é uma aplicação móvel desenvolvida em **React Native** com **Expo**, criada para facilitar a descoberta, participação e gestão de eventos sociais e culturais. Ideal para utilizadores que pretendem:

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

## 🛠️ Tecnologias Utilizadas 

| Camada       | Tech                     |
|--------------|--------------------------|
| Frontend     | React Native + Expo      |
| Autenticação | Firebase Authentication  |
| Sessão       | AsyncStorage             |
| Navegação    | React Navigation         |
| Mapas        | Google Maps API          |

---

## ✅ Pré‑requisitos 

Antes de começares, certifica‑te de que tens instalados:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)  
- npm ou yarn  
- Expo CLI (instalação global):

```bash
npm install -g expo-cli
```

## ⚙️ Instalação e Execução
1. **Clonar o repositório**:

git clone https://github.com/annaclara1997/event-buddy-project.git
cd event-buddy

2. **Instalar dependências**:

```bash
npm install
#ou
yarn install
```

3. **Configurar o Firebase**:

Adiciona as tuas credenciais do Firebase (API key, authDomain, projectId, etc).

4. **Iniciar o projeto**:

```bash
npx expo start
```
Abre o Expo Go no teu dispositivo ou usa um simulador/emulador.

## 📂 Estrutura do Projeto
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
├── data/
│   └── events.json            # Dados de exemplo de eventos
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
```

# Apresentação do Projeto

![Página 1](print_projeto/page-0001.jpg)

![Página 2](print_projeto/page-0002.jpg)

![Página 3](print_projeto/page-0003.jpg)

![Página 4](print_projeto/page-0004.jpg)