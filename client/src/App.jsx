import { useState, useEffect} from 'react';
import './index.css'

import { sendMessage } from './services/api';

function App() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState([]);

  const send = async (e) => {
    e.preventDefault()

    try{
      console.log('heyheyhey')
      const res = await sendMessage(input)
      console.log(res.data)
      return res.data
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log(input)
  }, [input])
  

  return (
    <>
    
      <h2>porquestudiar by ysst</h2>

      <div>
        Caja donde se ve la conversacion
      </div>

      <form onSubmit={send}>
        <input type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder='Escribe algo...' 
        />
        <button type='submit'
          className='p-2 bg-amber-700 hover:cursor-pointer' >
          Enviar
        </button>
      </form>
    </>
  );
}

export default App;