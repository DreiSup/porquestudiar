import { useState, useEffect} from 'react';
import './index.css'

import { sendMessage } from './services/api';

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const send = async (e) => {
    e.preventDefault()

    try{
      console.log('Enviando mensaje...')

      const res = await sendMessage(input)

      //Debug
      console.log('Respuesta completa del backend:', res)
      
      if (res.ok) {
        setMessages([res.response])
      } 

      setInput("")
    } catch (error) {
      console.log("Error al enviar el texto:", error)
      setMessages((prev) => [...prev, "Error: No se pudo obtener respuesta."])
    }
  }

  useEffect(() => {
    console.log("ESTO ES EL USESTATE DE MESSAGES:",messages)
  }, [messages])
  

  return (
    <>
    
      <h2>porquestudiar by ysst</h2>

      <div id='chatbot' 
        className='w-3/5 min-h-96 mx-auto border-2 border-solid border-white rounded-xl m-5 p-5 flex flex-col'
      >
        <div className='min-h-[70%]'>
          {messages}
        </div>
        <form className='mt-auto grid grid-flow-col gap-2'
          onSubmit={send}
        >
          <input type="text" className='' 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder='Escribe algo...' 
          />
          <button type='submit'
            className='p-2 bg-amber-700 hover:cursor-pointer' >
            Enviar
          </button>
        </form>
      </div>

    </>
  );
}

export default App;