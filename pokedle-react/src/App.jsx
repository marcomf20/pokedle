import { useEffect, useMemo, useState } from 'react'

export default function App() {
  const [listaPokemon, setListaPokemon] = useState([])
  const [pokemonAlvo, setPokemonAlvo] = useState(null)
  const [descricaoPokemon, setDescricaoPokemon] = useState('')
  const [modoJogo, setModoJogo] = useState('normal')
  const [carregando, setCarregando] = useState(true)
  const [tema, setTema] = useState(() => localStorage.getItem('tema-pokedle') || 'dark')
  const [textoBusca, setTextoBusca] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')

  const [estadoNormal, setEstadoNormal] = useState({
    tentativas: [],
    venceu: false
  })

  const [estadoDescricao, setEstadoDescricao] = useState({
    tentativas: [],
    venceu: false
  })
  const [estatisticas, setEstatisticas] = useState(() => {
    const salvo = localStorage.getItem('pokedle-stats')
    if (salvo) return JSON.parse(salvo)

    return {
      jogos: 0,
      vitorias: 0,
      streak: 0,
      melhorStreak: 0
    }
  })

  useEffect(() => {
    localStorage.setItem('pokedle-stats', JSON.stringify(estatisticas))
  }, [estatisticas])

  const chaveHoje = useMemo(() => pegarChaveHoje(), [])

  const tentativas =
    modoJogo === 'normal'
      ? estadoNormal.tentativas
      : estadoDescricao.tentativas

  const venceu =
    modoJogo === 'normal'
      ? estadoNormal.venceu
      : estadoDescricao.venceu

  function normalizarNome(nome) {
    return nome
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
  }

  function pegarChaveHoje() {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const dia = String(hoje.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
  }

  function pegarGeracaoPorId(id) {
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

  function pegarPokemonDoDia(lista) {
    if (!lista.length) return null

    const dataInicial = new Date('2026-01-01T00:00:00')
    const hoje = new Date()

    dataInicial.setHours(0, 0, 0, 0)
    hoje.setHours(0, 0, 0, 0)

    const diferencaEmDias = Math.floor((hoje - dataInicial) / (1000 * 60 * 60 * 24))
    const indice = ((diferencaEmDias % lista.length) + lista.length) % lista.length

    return lista[indice]
  }

  function salvarJogo(chave, modo, dados) {
    localStorage.setItem(`pokedle-${modo}-${chave}`, JSON.stringify(dados))
  }

  function carregarJogo(chave, modo) {
    const dadosSalvos = localStorage.getItem(`pokedle-${modo}-${chave}`)

    if (!dadosSalvos) return null

    try {
      return JSON.parse(dadosSalvos)
    } catch {
      return null
    }
  }

  function pegarClasseCelula(status) {
    if (status === 'correto') return 'celula correto'
    if (status === 'maior' || status === 'menor') return 'celula dica'
    return 'celula errado'
  }

  function pegarSeta(status) {
    if (status === 'maior') return ' ↑'
    if (status === 'menor') return ' ↓'
    return ''
  }

  function compararTentativa(pokemonTentado, pokemonAlvoAtual) {
    return {
      id: {
        valor: pokemonTentado.id,
        status:
          pokemonTentado.id === pokemonAlvoAtual.id
            ? 'correto'
            : pokemonTentado.id < pokemonAlvoAtual.id
            ? 'maior'
            : 'menor'
      },
      nome: {
        valor: pokemonTentado.nome,
        status:
          normalizarNome(pokemonTentado.nome) === normalizarNome(pokemonAlvoAtual.nome)
            ? 'correto'
            : 'errado'
      },
      geracao: {
        valor: pokemonTentado.geracao,
        status:
          pokemonTentado.geracao === pokemonAlvoAtual.geracao
            ? 'correto'
            : pokemonTentado.geracao < pokemonAlvoAtual.geracao
            ? 'maior'
            : 'menor'
      },
      tipo1: {
        valor: pokemonTentado.tipo1,
        status: pokemonTentado.tipo1 === pokemonAlvoAtual.tipo1 ? 'correto' : 'errado'
      },
      tipo2: {
        valor: pokemonTentado.tipo2 || '—',
        status: (pokemonTentado.tipo2 || null) === (pokemonAlvoAtual.tipo2 || null) ? 'correto' : 'errado'
      },
      altura: {
        valor: pokemonTentado.altura,
        status:
          pokemonTentado.altura === pokemonAlvoAtual.altura
            ? 'correto'
            : pokemonTentado.altura < pokemonAlvoAtual.altura
            ? 'maior'
            : 'menor'
      },
      peso: {
        valor: pokemonTentado.peso,
        status:
          pokemonTentado.peso === pokemonAlvoAtual.peso
            ? 'correto'
            : pokemonTentado.peso < pokemonAlvoAtual.peso
            ? 'maior'
            : 'menor'
      },
      fase: {
        valor: pokemonTentado.fase ?? 1,
        status:
          (pokemonTentado.fase ?? 1) === (pokemonAlvoAtual.fase ?? 1)
            ? 'correto'
            : (pokemonTentado.fase ?? 1) < (pokemonAlvoAtual.fase ?? 1)
            ? 'maior'
            : 'menor'
      }
    }
  }

  async function pegarEvolucao(id) {
    const respostaSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    if (!respostaSpecies.ok) {
      throw new Error('Não foi possível buscar a espécie do Pokémon.')
    }

    const dadosSpecies = await respostaSpecies.json()

    const respostaEvolucao = await fetch(dadosSpecies.evolution_chain.url)
    if (!respostaEvolucao.ok) {
      throw new Error('Não foi possível buscar a cadeia de evolução.')
    }

    const dadosEvolucao = await respostaEvolucao.json()
    const nomes = []

    function percorrer(no) {
      if (!no) return

      nomes.push(no.species.name)

      if (no.evolves_to && no.evolves_to.length > 0) {
        no.evolves_to.forEach((proximo) => percorrer(proximo))
      }
    }

    percorrer(dadosEvolucao.chain)

    return [...new Set(nomes)]
  }

  async function pegarFaseEvolucao(nome, id) {
    try {
      const lista = await pegarEvolucao(id)
      const indice = lista.findIndex((item) => item === nome.toLowerCase())
      return indice >= 0 ? indice + 1 : 1
    } catch {
      return 1
    }
  }

async function pegarDescricaoPokemon(id) {
  const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)

  if (!resposta.ok) {
    throw new Error('Não foi possível buscar a descrição do Pokémon.')
  }

  const dados = await resposta.json()

  // procura português primeiro
  let entrada = dados.flavor_text_entries.find(
    (item) => item.language.name === 'pt'
  )

  // se não tiver português usa inglês
  if (!entrada) {
    entrada = dados.flavor_text_entries.find(
      (item) => item.language.name === 'en'
    )
  }

  if (!entrada) {
    return 'Sem descrição disponível.'
  }

  return entrada.flavor_text
    .replace(/\n/g, ' ')
    .replace(/\f/g, ' ')
}

  async function buscarDetalhesPokemon(idOuNome) {
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOuNome}`)

    if (!resposta.ok) {
      throw new Error('Não foi possível buscar os detalhes do Pokémon.')
    }

    const dados = await resposta.json()
    const nomeFormatado = dados.name.charAt(0).toUpperCase() + dados.name.slice(1)
    const fase = await pegarFaseEvolucao(dados.name, dados.id)

    return {
      id: dados.id,
      nome: nomeFormatado,
      geracao: pegarGeracaoPorId(dados.id),
      tipo1: dados.types[0]?.type?.name || '—',
      tipo2: dados.types[1]?.type?.name || null,
      altura: dados.height / 10,
      peso: dados.weight / 10,
      fase: fase || 1,
      sprite:
        dados.sprites.front_default ||
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dados.id}.png`
    }
  }

  function trocarModo(novoModo) {
    setModoJogo(novoModo)
    setTextoBusca('')
    setMensagemErro('')
  }

  useEffect(() => {
    async function carregarListaPokemon() {
      try {
        setMensagemErro('')

        const resposta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')

        if (!resposta.ok) {
          throw new Error('Não foi possível carregar a lista da PokéAPI.')
        }

        const dados = await resposta.json()

        const listaBase = dados.results.map((item, indice) => {
          const id = indice + 1
          const nomeFormatado = item.name.charAt(0).toUpperCase() + item.name.slice(1)

          return {
            id,
            nome: nomeFormatado,
            geracao: pegarGeracaoPorId(id),
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
          }
        })

        setListaPokemon(listaBase)

        const pokemonDoDiaBase = pegarPokemonDoDia(listaBase)
        if (!pokemonDoDiaBase) {
          throw new Error('Não foi possível definir o Pokémon do dia.')
        }

        const alvoCompleto = await buscarDetalhesPokemon(pokemonDoDiaBase.id)
        const descricao = await pegarDescricaoPokemon(pokemonDoDiaBase.id)

        setPokemonAlvo(alvoCompleto)
        setDescricaoPokemon(descricao)

        const jogoSalvoNormal = carregarJogo(chaveHoje, 'normal')
        const jogoSalvoDescricao = carregarJogo(chaveHoje, 'descricao')

        if (jogoSalvoNormal?.tentativas?.length) {
          const tentativasRestauradasNormal = await Promise.all(
            jogoSalvoNormal.tentativas.map(async (tentativaSalva) => {
              const pokemonAtualizado = await buscarDetalhesPokemon(tentativaSalva.pokemon.id)

              return {
                pokemon: pokemonAtualizado,
                resultado: compararTentativa(pokemonAtualizado, alvoCompleto)
              }
            })
          )

          setEstadoNormal({
            tentativas: tentativasRestauradasNormal,
            venceu: Boolean(jogoSalvoNormal.venceu)
          })
        }

        if (jogoSalvoDescricao?.tentativas?.length) {
          const tentativasRestauradasDescricao = await Promise.all(
            jogoSalvoDescricao.tentativas.map(async (tentativaSalva) => {
              const pokemonAtualizado = await buscarDetalhesPokemon(tentativaSalva.pokemon.id)

              return {
                pokemon: pokemonAtualizado
              }
            })
          )

          setEstadoDescricao({
            tentativas: tentativasRestauradasDescricao,
            venceu: Boolean(jogoSalvoDescricao.venceu)
          })
        }
      } catch (erro) {
        console.error(erro)
        setMensagemErro(erro.message || 'Erro inesperado ao carregar o jogo.')
      } finally {
        setCarregando(false)
      }
    }

    carregarListaPokemon()
  }, [chaveHoje])

  useEffect(() => {
    if (!pokemonAlvo) return

    salvarJogo(chaveHoje, 'normal', {
      tentativas: estadoNormal.tentativas,
      venceu: estadoNormal.venceu
    })
  }, [estadoNormal, pokemonAlvo, chaveHoje])

  useEffect(() => {
    if (!pokemonAlvo) return

    salvarJogo(chaveHoje, 'descricao', {
      tentativas: estadoDescricao.tentativas,
      venceu: estadoDescricao.venceu
    })
  }, [estadoDescricao, pokemonAlvo, chaveHoje])

  async function aoEscolherPokemon(pokemonBase) {
    try {
      if (!pokemonAlvo || venceu) return

      const jaTentou = tentativas.some(
        (tentativa) => normalizarNome(tentativa.pokemon.nome) === normalizarNome(pokemonBase.nome)
      )

      if (jaTentou) return

      const pokemonCompleto = await buscarDetalhesPokemon(pokemonBase.id)

      if (modoJogo === 'descricao') {
        const acertou = normalizarNome(pokemonCompleto.nome) === normalizarNome(pokemonAlvo.nome)

        const novaTentativa = {
          pokemon: pokemonCompleto
        }

        setEstadoDescricao((valorAnterior) => ({
          tentativas: [novaTentativa, ...valorAnterior.tentativas],
          venceu: acertou ? true : valorAnterior.venceu
        }))

        setTextoBusca('')
        return
      }

      const resultado = compararTentativa(pokemonCompleto, pokemonAlvo)

      const novaTentativa = {
        pokemon: pokemonCompleto,
        resultado
      }

      const acertou = normalizarNome(pokemonCompleto.nome) === normalizarNome(pokemonAlvo.nome)

      setEstadoNormal((valorAnterior) => ({
        tentativas: [novaTentativa, ...valorAnterior.tentativas],
        venceu: acertou ? true : valorAnterior.venceu
      }))

      setTextoBusca('')
    } catch (erro) {
      console.error(erro)
      setMensagemErro('Erro ao tentar esse Pokémon.')
    }
  }

  const sugestoes = useMemo(() => {
    if (!textoBusca.trim()) return []

    return listaPokemon
      .filter((pokemon) => normalizarNome(pokemon.nome).includes(normalizarNome(textoBusca)))
      .slice(0, 8)
  }, [textoBusca, listaPokemon])

  if (carregando) {
    return <div className="carregando">Carregando Pokémons...</div>
  }

  if (mensagemErro) {
    return (
      <div className="carregando">
        <div>
          <p>{mensagemErro}</p>
          <p>Abra o console com F12 para ver o erro exato.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="app">
      <div className="container">

        <header className="cabecalho">
          <h1>Pokédle</h1>

          <div className="cabecalho-badges">
            <span className="badge">Tentativas: {tentativas.length}</span>
            <span className={venceu ? 'badge badge-vitoria' : 'badge'}>
              {venceu ? 'Acertou hoje' : 'Ainda tentando'}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '16px',
              flexWrap: 'wrap'
            }}
          >
            <button
              className="controle-botao"
              onClick={() => trocarModo('normal')}
              style={{
                opacity: modoJogo === 'normal' ? 1 : 0.7
              }}
            >
              Modo normal
            </button>

            <button
              className="controle-botao"
              onClick={() => trocarModo('descricao')}
              style={{
                opacity: modoJogo === 'descricao' ? 1 : 0.7
              }}
            >
              Modo descrição
            </button>
          </div>
        </header>

        {modoJogo === 'descricao' && (
          <div className="caixa-vazia" style={{ maxWidth: '760px', lineHeight: '1.6' }}>
            <strong>Descrição:</strong>
            <div style={{ marginTop: '10px' }}>{descricaoPokemon}</div>
          </div>
        )}

        <div className="barra-busca-wrapper">
          <input
            type="text"
            className="campo-busca"
            placeholder="Digite o nome de um Pokémon"
            value={textoBusca}
            onChange={(e) => setTextoBusca(e.target.value)}
            disabled={venceu}
          />

          {textoBusca && sugestoes.length > 0 && !venceu && (
            <div className="lista-sugestoes">
              {sugestoes.map((pokemon) => (
                <button
                  key={pokemon.id}
                  className="item-sugestao"
                  onClick={() => aoEscolherPokemon(pokemon)}
                >
                  <img src={pokemon.sprite} alt={pokemon.nome} className="item-sugestao-imagem" />
                  <div>
                    <span>{pokemon.nome}</span>
                    <small>Geração {pokemon.geracao}</small>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {venceu && pokemonAlvo && (
          <div className="caixa-vitoria">
            Você acertou o Pokémon do dia: {pokemonAlvo.nome}!
          </div>
        )}

        {modoJogo === 'normal' ? (
          tentativas.length === 0 ? (
            <div className="caixa-vazia">Nenhuma tentativa ainda.</div>
          ) : (
            <div className="tabela-wrapper">
              <table className="tabela-tentativas">
                <thead>
                  <tr>
                    <th>Sprite</th>
                    <th>Nome</th>
                    <th>ID</th>
                    <th>Geração</th>
                    <th>Tipo 1</th>
                    <th>Tipo 2</th>
                    <th>Altura</th>
                    <th>Peso</th>
                    <th>Fase</th>
                  </tr>
                </thead>

                <tbody>
                  {tentativas.map((tentativa, indice) => (
                    <tr key={indice}>
                      <td>
                        <img
                          src={tentativa.pokemon.sprite}
                          alt={tentativa.pokemon.nome}
                          className="sprite-tabela"
                        />
                      </td>

                      <td className={pegarClasseCelula(tentativa.resultado.nome.status)}>
                        {tentativa.resultado.nome.valor}
                      </td>

                      <td className={pegarClasseCelula(tentativa.resultado.id.status)}>
                        {tentativa.resultado.id.valor}
                        {pegarSeta(tentativa.resultado.id.status)}
                      </td>

                      <td className={pegarClasseCelula(tentativa.resultado.geracao.status)}>
                        {tentativa.resultado.geracao.valor}
                        {pegarSeta(tentativa.resultado.geracao.status)}
                      </td>

                      <td className={pegarClasseCelula(tentativa.resultado.tipo1.status)}>
                        {tentativa.resultado.tipo1.valor}
                      </td>

                      <td className={pegarClasseCelula(tentativa.resultado.tipo2.status)}>
                        {tentativa.resultado.tipo2.valor}
                      </td>

                      <td className={pegarClasseCelula(tentativa.resultado.altura.status)}>
                        {tentativa.resultado.altura.valor}
                        {pegarSeta(tentativa.resultado.altura.status)}
                      </td>

                      <td className={pegarClasseCelula(tentativa.resultado.peso.status)}>
                        {tentativa.resultado.peso.valor}
                        {pegarSeta(tentativa.resultado.peso.status)}
                      </td>

                      <td className={pegarClasseCelula(tentativa.resultado.fase.status)}>
                        {tentativa.resultado.fase.valor ?? 1}
                        {pegarSeta(tentativa.resultado.fase.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : tentativas.length === 0 ? (
          <div className="caixa-vazia">Nenhuma tentativa ainda.</div>
        ) : (
          <div className="tabela-wrapper">
            <table className="tabela-tentativas">
              <thead>
                <tr>
                  <th>Sprite</th>
                  <th>Nome</th>
                </tr>
              </thead>

              <tbody>
                {tentativas.map((tentativa, indice) => {
                  const acertou =
                    pokemonAlvo &&
                    normalizarNome(tentativa.pokemon.nome) === normalizarNome(pokemonAlvo.nome)

                  return (
                    <tr key={indice}>
                      <td>
                        <img
                          src={tentativa.pokemon.sprite}
                          alt={tentativa.pokemon.nome}
                          className="sprite-tabela"
                        />
                      </td>

                      <td className={acertou ? 'correto' : 'errado'}>
                        {tentativa.pokemon.nome}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}