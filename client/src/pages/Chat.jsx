import { useState, useEffect, useRef} from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.jsx';
import SideBar from '@/components/SideBar.jsx';
import ChatHeader from '@/components/ChatHeader.jsx';
import { useChat } from '@/context/ChatContext.jsx';
import { useAuth } from '@/context/AuthContext';


const Chat = () => {
    const [input, setInput] = useState("");
      const chatEndRef = useRef(null)
    
      const [sessionId, setSessionId] = useState("")

      const auth = useAuth()
      const chatContext = useChat()
    
      /* useEffect(() => {
        const uniqueId = `sesion-${crypto.randomUUID()}`
        setSessionId(uniqueId);
        console.log("SessionID generado: ", uniqueId)
      }, []) */
      
      /* useEffect(() => {
        console.log("Esto es lo que contiene auth:", auth);
      }, [auth]) */
    
      useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth"})
      })
    
      const handleSend = async (e) => {
        e.preventDefault()
        if (!input.trim()) return

        if (!chatContext?.selectedChatId) {
          alert("Please, select or create a chat")
          return
        }

        const textToSend = input;
        setInput("");

        await chatContext?.sendMessage(textToSend)
        
      }
    
      useEffect(() => {
        console.log("ESTO ES EL USESTATE DE MESSAGES:",chatContext?.messages)
      }, [chatContext?.messages])
      
    
      return (
        <>
        
          <SidebarProvider>
          <SideBar/>

          <SidebarInset className="flex flex-col flex-1 h-screen bg-slate-950">
          <ChatHeader/>
          
          <main className="flex-1 flex flex-col h-screen min-w-0">
          <div className="flex flex-col h-screen bg-gray-950 text-gray-100 font-sans">
          <header className="flex justify-around p-4 border-b border-gray-800 text-center bg-gray-900">
          <h2 className="text-xl font-bold text-amber-500 tracking-tighter uppercase">
          PorquéEstudiar <span className="text-gray-400 text-xs italic">by ysst</span>
          </h2>
          </header>
        
          <div className='flex-1 overflow-y-auto p-4 md:p-10 space-y-4'>
          {!chatContext?.selectedChatId && (
            <div className='flex h-full items-center justify-center text-gray-500'>
            <p>Selecciona una conversación o crea una nueva.</p>
            </div>
          )}

                  {/* MAPEO DE MENSAJES */}
                  {chatContext?.messages && chatContext?.messages.map((msg, index) => {
                    const isUser = msg.role === "user";
                    return (
                      <div key={index}
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[75%] p-3 rounded-2xl shadow-md my-3 ${
                          isUser
                          ? 'bg-amber-700 text-white rounded-br-none'
                          : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'
                        }`}>
                          <p className='text-sm whitespace-pre-wrap'>
                            {msg.content}
                          </p>
                        </div>
                        </div>
                      )
                    })}
                    
                    {/* --- INDICADOR DE CARGA (TRES PUNTOS) --- */}
                    {chatContext?.isLoading && (
                      <div className="flex justify-start">
                      <div className="bg-gray-800 border border-gray-700 p-4 rounded-2xl rounded-bl-none shadow-md">
                      <div className="flex gap-1.5 items-center">
                      {/* Animación de puntos usando Tailwind */}
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                  <div ref={chatEndRef} />
                </div>
        
                {/* INPUT AREA*/}
                <footer className="p-4 bg-gray-900 border-t border-gray-800">
                <form className='max-w-4xl mx-auto flex gap-2'
                onSubmit={handleSend}
                >
                <input type="text" 
                className='flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600 transition-all' 
                      value={input} 
                      onChange={(e) => setInput(e.target.value)}
                      placeholder='Escribe algo...' 
                    />
                    <button type='submit'
                      className='bg-amber-700 hover:bg-amber-600 px-6 py-3 rounded-xl font-bold transition-transform active:scale-95' >
                      Enviar
                      </button>
                      </form>
                      </footer>
                      </div>
                      </main>
                      </SidebarInset>
                      </SidebarProvider>
          </>
                      
                    );
}


export default Chat