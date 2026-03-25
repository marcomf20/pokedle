# Pokédle

Um jogo inspirado em **Wordle**, mas com **Pokémon**.
O objetivo é descobrir **qual é o Pokémon do dia** usando dicas baseadas nas características do Pokémon.

O jogo utiliza dados da **PokéAPI** e foi desenvolvido com **React** no frontend.

---

# Demonstração

No Pokédle você tenta adivinhar o Pokémon do dia digitando nomes de Pokémon.

A cada tentativa o jogo mostra dicas como:

* ID do Pokémon
* Geração
* Tipos
* Altura
* Peso
* Fase de evolução

Essas informações ajudam a descobrir qual é o Pokémon correto.

---

# Modos de jogo

## Modo Normal

O jogador tenta adivinhar o Pokémon com base nas informações comparativas.

Exemplo de dicas:

* ID maior ou menor
* Geração correta ou não
* Tipos corretos
* Altura e peso comparados

Cores indicam o resultado:

* 🟩 correto
* 🟥 errado
* 🟨 dica (maior ou menor)

---

## Modo Descrição

O jogo mostra uma **descrição da Pokédex** e o jogador precisa descobrir qual Pokémon corresponde a ela.

---

# Tecnologias utilizadas

* React
* JavaScript
* CSS
* PokéAPI
* LocalStorage

APIs utilizadas:

* PokéAPI

---

# Funcionalidades

* Pokémon do dia baseado na data
* Sistema de tentativas
* Dicas comparativas
* Modo descrição
* Salvamento do progresso no navegador
* Autocomplete de Pokémon
* Interface responsiva
* Sugestões automáticas

---

# Estrutura do projeto

```
src/
 ├─ App.jsx
 ├─ index.js
 ├─ styles.css
```

---

# Como rodar o projeto

## 1 Instalar dependências

```bash
npm install
```

## 2 Rodar o projeto

```bash
npm run dev
```

ou

```bash
npm start
```

---

# Como funciona o Pokémon do dia

O Pokémon do dia é calculado usando a data atual.

O jogo pega a diferença de dias desde uma data inicial e usa esse valor para selecionar um Pokémon da lista.

Isso garante que **todos os jogadores recebam o mesmo Pokémon no mesmo dia**.

---

# Fonte dos dados

Todos os dados dos Pokémon são obtidos através da:

* PokéAPI

Ela fornece:

* nomes
* tipos
* sprites
* altura
* peso
* descrição
* cadeia de evolução

---

# Possíveis melhorias futuras

* Silhueta do Pokémon
* Sistema de estatísticas
* Compartilhar resultado
* Tradução automática das descrições
* Suporte a múltiplos idiomas
* Sistema de ranking
* Tema claro e escuro

---

# Autor

Projeto desenvolvido por **Marcos Felipe Barbosa Silva**.

