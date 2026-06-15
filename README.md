# 🍳 Panelinha

> App mobile de receitas culinárias desenvolvido com React Native + Expo SDK 54

Panelinha é um aplicativo móvel que permite ao usuário explorar receitas internacionais, salvar favoritos e gerenciar seu perfil. Os dados de receitas vêm da API pública **TheMealDB**, enquanto a autenticação e o armazenamento de favoritos são gerenciados pelo **Firebase**.

---

## ✨ Funcionalidades

- 🔐 **Autenticação** — cadastro e login com e-mail e senha via Firebase Auth
- 🏠 **Tela Principal** — busca de receitas por nome e filtro por categoria
- 📖 **Detalhes da Receita** — ingredientes com checklist interativo, instruções traduzidas para PT-BR e botão de favoritar
- ❤️ **Favoritos** — salva e remove receitas favoritas em tempo real via Firestore
- 👤 **Perfil** — visualiza dados do usuário, contador de favoritos e lista de avaliações
- ⚙️ **Configurações** — preferências de notificação, alteração de senha e exclusão de conta
- 🌐 **Tradução automática** — instruções das receitas traduzidas do inglês para o português (MyMemory API)
- 🗂️ **Drawer lateral** — menu de navegação com ícones, header do usuário e botão de logout

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| [React Native](https://reactnative.dev/) | 0.81.5 | Framework mobile |
| [Expo](https://expo.dev/) | SDK 54 (~54.0.34) | Plataforma de desenvolvimento |
| [React Navigation](https://reactnavigation.org/) | 7.x | Navegação entre telas |
| [Firebase](https://firebase.google.com/) | ^12.14.0 | Auth + Firestore |
| [TheMealDB API](https://www.themealdb.com/api.php) | v1 | Dados das receitas |
| [Expo Vector Icons](https://icons.expo.fyi/) | ^15.1.1 | Ícones (Ionicons + MaterialCommunity) |
| [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) | ~4.1.1 | Animações fluidas |
| [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) | ~2.28.0 | Gestos e Drawer |

---

## ✅ Requisitos Técnicos Implementados

| Requisito | Status | Localização |
|---|---|---|
| `useState` | ✅ Implementado | `src/hooks/useReceitas.js`, `src/hooks/useFavoritos.js`, `src/navegacao/NavegadorApp.js` e telas |
| `useEffect` | ✅ Implementado | `src/hooks/useReceitas.js:10`, `src/hooks/useFavoritos.js:10`, `src/navegacao/NavegadorApp.js:17` |
| Hook customizado | ✅ Implementado | `src/hooks/useReceitas.js` e `src/hooks/useFavoritos.js` |
| Componentes funcionais (sem classes) | ✅ Implementado | Todos os arquivos do projeto |
| Stack Navigation | ✅ Implementado | `src/navegacao/NavegadorApp.js` e `NavegadorGaveta.js` (PilhaInicio) |
| Drawer Navigation | ✅ Implementado | `src/navegacao/NavegadorGaveta.js` |
| Loading / ActivityIndicator | ✅ Implementado | `src/componentes/CarregandoSpinner.js` |
| Tela de Login | ✅ Implementado | `src/telas/TelaLogin.js` |
| Tela de Cadastro | ✅ Implementado | `src/telas/TelaCadastro.js` |
| Tela Principal | ✅ Implementado | `src/telas/TelaPrincipal.js` |
| Tela de Detalhes | ✅ Implementado | `src/telas/TelaDetalhes.js` |
| Tela de Perfil | ✅ Implementado | `src/telas/TelaPerfil.js` |
| Tela de Configurações | ✅ Implementado | `src/telas/TelaConfiguracoes.js` |
| Tela de Favoritos | ✅ Implementado | `src/telas/TelaFavoritos.js` |
| Integração com API | ✅ Implementado | `src/servicos/api.js` — TheMealDB |
| Firebase Authentication | ✅ Implementado | `src/servicos/autenticacao.js` + `firebaseConfig.js` |
| Firebase Firestore | ✅ Implementado | `src/servicos/bancoDados.js` + `src/hooks/useFavoritos.js` |

---

## 📁 Estrutura de Pastas

```
Panelinha/
├── App.js                        # Ponto de entrada do app
├── index.js                      # Registro do componente raiz (Expo)
├── firebaseConfig.js             # Configuração e exportação do Firebase
├── package.json
├── assets/
│   └── logo.png                  # Logo do app
└── src/
    ├── componentes/              # Componentes reutilizáveis
    │   ├── CarregandoSpinner.js  # Tela de loading com ActivityIndicator
    │   ├── CartaoReceita.js      # Card de receita para listas
    │   └── LogoPanelinha.js      # Logo configurável
    │
    ├── hooks/                    # Hooks customizados
    │   ├── useReceitas.js        # Busca receitas na API TheMealDB
    │   └── useFavoritos.js       # Gerencia favoritos com listener Firestore
    │
    ├── navegacao/                # Configuração de navegação
    │   ├── NavegadorApp.js       # Stack raiz (Login/App) + controle de auth
    │   └── NavegadorGaveta.js    # Drawer + Stack aninhado para telas autenticadas
    │
    ├── servicos/                 # Integrações externas
    │   ├── api.js                # Funções de chamada à TheMealDB
    │   ├── autenticacao.js       # Cadastro, login e logout via Firebase Auth
    │   ├── bancoDados.js         # CRUD de favoritos no Firestore
    │   └── traducao.js           # Tradução EN→PT-BR via MyMemory API
    │
    └── telas/                    # Telas do aplicativo
        ├── TelaLogin.js          # Login com e-mail e senha
        ├── TelaCadastro.js       # Cadastro com nome, e-mail, senha e avatar
        ├── TelaPrincipal.js      # Dashboard: busca e filtro de receitas
        ├── TelaDetalhes.js       # Detalhes, ingredientes e instruções da receita
        ├── TelaFavoritos.js      # Lista de receitas favoritadas
        ├── TelaPerfil.js         # Perfil do usuário e avaliações
        └── TelaConfiguracoes.js  # Preferências e configurações de conta
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [Expo CLI](https://docs.expo.dev/get-started/installation/) instalado globalmente
- Conta no [Firebase](https://console.firebase.google.com/) com um projeto criado
- Aplicativo **Expo Go** no celular (iOS ou Android) — ou emulador configurado

### Passo a passo

**1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/panelinha.git
cd panelinha
```

**2. Instale as dependências**

```bash
npm install --legacy-peer-deps
```

> O flag `--legacy-peer-deps` é necessário devido à compatibilidade entre `react-native-reanimated` e `react-native-worklets` no Expo SDK 54.

**3. Configure o Firebase**

Edite o arquivo `firebaseConfig.js` na raiz do projeto com as credenciais do seu projeto Firebase:

```js
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.firebasestorage.app",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

No console do Firebase, certifique-se de:
- Ativar **Authentication** com o provedor **E-mail/senha**
- Criar o banco **Firestore Database** no modo de produção ou teste

**4. Inicie o projeto**

```bash
npx expo start --web
```

Para testar no celular, escaneie o QR Code com o app **Expo Go**.  
Para Android via emulador: pressione `a` no terminal.  
Para iOS via simulador: pressione `i` no terminal.

---

## 🌐 Endpoints da API TheMealDB

Base URL: `https://www.themealdb.com/api/json/v1/1`

| Endpoint | Método | Parâmetro | Descrição | Usado em |
|---|---|---|---|---|
| `/search.php` | GET | `s={nome}` | Busca receitas pelo nome | `useReceitas`, `TelaPrincipal` |
| `/lookup.php` | GET | `i={id}` | Retorna detalhes de uma receita pelo ID | `TelaDetalhes` |
| `/categories.php` | GET | — | Lista todas as categorias disponíveis | `api.js` |

### Exemplo de resposta — `/search.php?s=chicken`

```json
{
  "meals": [
    {
      "idMeal": "52772",
      "strMeal": "Teriyaki Chicken Casserole",
      "strCategory": "Chicken",
      "strArea": "Japanese",
      "strInstructions": "...",
      "strMealThumb": "https://www.themealdb.com/images/media/meals/...",
      "strIngredient1": "soy sauce",
      "strMeasure1": "3/4 cup"
    }
  ]
}
```

---

## 🔥 Estrutura do Firebase Firestore

### Coleção: `favoritos`

Cada documento representa uma receita favoritada por um usuário. O ID do documento é formado por `{idUsuario}_{idReceita}` para garantir unicidade e facilitar a remoção.

```
favoritos/                          ← coleção
└── {idUsuario}_{idReceita}/        ← documento (ex: "abc123_52772")
    ├── idUsuario:      string      # UID do usuário autenticado
    ├── idReceita:      string      # ID da receita na TheMealDB
    ├── nomeReceita:    string      # Nome da receita
    ├── imagemReceita:  string      # URL da imagem da receita
    ├── categoriaReceita: string    # Categoria (ex: "Chicken")
    └── criadoEm:       Timestamp  # Data e hora em que foi favoritado
```

### Regras de acesso

Os favoritos são recuperados em tempo real usando `onSnapshot` (hook `useFavoritos`), com filtro por `idUsuario`, garantindo que cada usuário veja apenas os seus próprios favoritos.

---

## 👩‍💻 Desenvolvedora

| | |
|---|---|
| **Nome** | Maria Luiza Magarão |
| **RA** | 22408637 |
| **Curso** | Ciência da Computação |
| **Faculdade** | UniCEUB |
| **Disciplina** | Programação Mobile |
| **Semestre** | 5º Semestre — 2025 |

---

## 🤖 Desenvolvido com auxílio de IA

Este projeto foi desenvolvido com o auxílio do **[Claude](https://claude.ai)** (claude.ai), assistente de inteligência artificial da [Anthropic](https://www.anthropic.com). O Claude colaborou na estruturação do código, resolução de erros, aplicação de boas práticas de desenvolvimento mobile com React Native e Expo, e organização da arquitetura do projeto.

---

<p align="center">
  Feito com ❤️ e muito ☕ por Maria Luiza Magarão
</p>
