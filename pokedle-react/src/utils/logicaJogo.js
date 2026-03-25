export function normalizarNome(nome) {
  return nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

export function pegarChaveHoje() {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

export function pegarGeracaoPorId(id) {
  if (id <= 151) return 1
  if (id <= 251) return 2
  if (id <= 386) return 3
  if (id <= 493) return 4
  if (id <= 649) return 5
  if (id <= 721) return 6
  if (id <= 809) return 7
  if (id <= 905) return 8
  return 9
}

export function pegarPokemonDoDia(listaPokemon) {
  if (!listaPokemon.length) return null

  const dataInicial = new Date('2026-01-01T00:00:00')
  const hoje = new Date()

  dataInicial.setHours(0, 0, 0, 0)
  hoje.setHours(0, 0, 0, 0)

  const diferencaEmDias = Math.floor((hoje - dataInicial) / (1000 * 60 * 60 * 24))
  const indice = ((diferencaEmDias % listaPokemon.length) + listaPokemon.length) % listaPokemon.length

  return listaPokemon[indice]
}

export function compararTentativa(pokemonTentado, pokemonAlvo) {
  return {
    id: {
      valor: pokemonTentado.id,
      status:
        pokemonTentado.id === pokemonAlvo.id
          ? 'correto'
          : pokemonTentado.id < pokemonAlvo.id
          ? 'maior'
          : 'menor'
    },
    nome: {
      valor: pokemonTentado.nome,
      status:
        normalizarNome(pokemonTentado.nome) === normalizarNome(pokemonAlvo.nome)
          ? 'correto'
          : 'errado'
    },
    geracao: {
      valor: pokemonTentado.geracao,
      status:
        pokemonTentado.geracao === pokemonAlvo.geracao
          ? 'correto'
          : pokemonTentado.geracao < pokemonAlvo.geracao
          ? 'maior'
          : 'menor'
    },
    tipo1: {
      valor: pokemonTentado.tipo1,
      status:
        pokemonTentado.tipo1 === pokemonAlvo.tipo1
          ? 'correto'
          : 'errado'
    },
    tipo2: {
      valor: pokemonTentado.tipo2,
      status:
        pokemonTentado.tipo2 === pokemonAlvo.tipo2
          ? 'correto'
          : 'errado'
    }
  }
}