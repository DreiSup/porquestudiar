import { useState, useEffect, useRef} from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.jsx';
import SideBar from '@/components/SideBar.jsx';
import ChatHeader from '@/components/ChatHeader.jsx';
import { useChat } from '@/context/ChatContext.jsx';
import { useAuth } from '@/context/AuthContext';
import { Field, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ButtonGroup } from '@/components/ui/button-group';


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
        console.log("ESTO ES EL USESTATE DE CHATS:",chatContext?.chats)
      }, [chatContext?.chats])
      
    
      return (
        //arreglado flow chapuza con overflow-hidden, pero sin él se puede hacer
        <main className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden min-w-0">
          <SidebarProvider>
            <SideBar/>
            <SidebarInset className="flex flex-col flex-1 h-screen bg-slate-950">
              <ChatHeader/>
              
              <div className="flex flex-col flex-1 overflow-hidden bg-black text-gray-100 font-sans">
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
                          ? 'bg-neutral-800 text-white rounded-br-none'
                          : 'bg-neutral-800 text-gray-200 border border-neutral-700 rounded-bl-none'
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
                      <div className="bg-black border border-gray-900 p-4 rounded-2xl rounded-bl-none shadow-md">
                      <div className="flex gap-1.5 items-center">
                      {/* Animación de puntos usando Tailwind */}
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                          </div>
                        </div>
                      </div>
                    )}
                        
                    <div ref={chatEndRef} /></div>
            
                    {/* INPUT AREA*/}
                    <footer className="p-4 bg-black border-t border-gray-900">
                        <form className='max-w-4xl mx-auto flex gap-2'
                        onSubmit={handleSend}
                        >
                        <Field>
                          <FieldLabel></FieldLabel>
                          <ButtonGroup>
                            <Input 
                              className='flex-1 border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600 transition-all'
                              id="input-button-group" 
                              placeholder="Ask something" 
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                            />
                            <Button variant="outline"
                              type='submit'  
                            >
                              Send
                            </Button>
                          </ButtonGroup>
                        </Field>

                      </form>
                    </footer>
              </div>
          </SidebarInset>
        </SidebarProvider>
      </main>   
);
}


export default Chat