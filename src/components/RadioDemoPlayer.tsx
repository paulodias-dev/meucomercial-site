import {useEffect, useRef, useState} from 'react'
import {Headphones, Play, Square} from 'lucide-react'

/** Demonstration-only copy; no licensed audio, advertising booking or Player credentials. */
export const radioDemoScripts = [
  {id:'abertura', title:'Vinheta institucional', copy:'Bem-vindo à demonstração de Rádio Indoor. Esta locução é gerada pelo seu navegador.'},
  {id:'oferta', title:'Exemplo de oferta', copy:'Atenção: esta é uma mensagem fictícia de demonstração. As ofertas reais dependem de aprovação do estabelecimento.'},
  {id:'aviso', title:'Comunicado da unidade', copy:'A equipe agradece sua visita. A programação real é definida pelo estabelecimento e pela agência responsável.'},
] as const

export default function RadioDemoPlayer() {
  const [active, setActive] = useState<string | null>(null)
  const [status, setStatus] = useState('Escolha uma locução para ouvir.')
  const current = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => () => {
    // An unmounted demo must not continue speaking after navigation.
    if (current.current && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      current.current = null
    }
  }, [])

  const stop = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    current.current = null
    setActive(null)
    setStatus('Reprodução interrompida.')
  }
  const play = (id: typeof radioDemoScripts[number]['id']) => {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      setStatus('Este navegador não disponibiliza síntese de fala. Experimente outro navegador compatível.')
      return
    }
    window.speechSynthesis.cancel()
    const item = radioDemoScripts.find(entry => entry.id === id)
    if (!item) return
    const message = new SpeechSynthesisUtterance(item.copy)
    message.lang = 'pt-BR'
    message.rate = 0.95
    message.volume = 0.9
    current.current = message
    message.onend = () => {
      if (current.current === message) {
        current.current = null
        setActive(null)
        setStatus('Amostra concluída.')
      }
    }
    message.onerror = () => {
      if (current.current === message) {
        current.current = null
        setActive(null)
        setStatus('O navegador não conseguiu reproduzir a locução. Tente novamente.')
      }
    }
    setActive(id)
    setStatus('Reproduzindo: ' + item.title)
    window.speechSynthesis.speak(message)
  }

  return <div className='rounded-2xl bg-slate-900 border border-white/15 p-4 sm:p-5'>
    <div className='flex gap-2 items-center text-blue-200 text-sm font-semibold'>
      <Headphones size={18} aria-hidden /> Demonstração sonora local
    </div>
    <p className='text-xs text-slate-200 leading-5 mt-2'>
      Ouça exemplos de locução gerados no seu próprio navegador. Não utilizamos músicas de terceiros,
      não conectamos à grade real nem contabilizamos veiculações. A voz varia conforme o aparelho.
    </p>
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4'>
      {radioDemoScripts.map(item => <button key={item.id} type='button'
        aria-pressed={active === item.id} onClick={() => active === item.id ? stop() : play(item.id)}
        className={'min-h-11 rounded-xl border p-3 flex items-center justify-center gap-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-200 ' +
          (active === item.id ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/15 text-white hover:bg-white/15')}>
        {active === item.id ? <Square size={15} aria-hidden /> : <Play size={15} aria-hidden />}
        {item.title}
      </button>)}
    </div>
    <div className='mt-3 flex flex-wrap items-center justify-between gap-2'>
      <p role='status' aria-live='polite' className='text-xs text-slate-300'>{status}</p>
      {active && <button type='button' onClick={stop} className='text-xs underline underline-offset-2 text-blue-200 min-h-10 px-2'>Parar áudio</button>}
    </div>
  </div>
}
