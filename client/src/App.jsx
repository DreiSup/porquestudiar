import './index.css'
import {Routes, Route} from "react-router-dom"
import Home from './pages/Home';
import Chat from './pages/Chat';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ChatOnBuild from './pages/ChatOnBuild';

function App() {
  
  return (
    <main>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/chatonbuild' element={<ChatOnBuild/>}/>
        <Route path='/*' element={<NotFound/>}/>
      </Routes>
    </main>
  )
}

export default App;