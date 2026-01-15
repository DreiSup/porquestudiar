import './index.css'
import {Routes, Route} from "react-router-dom"
import Home from './pages/Home';
import Chat from './pages/Chat';
import SignUp from './pages/SignUp';
import Login from './pages/Login';

function App() {
  
  return (
    <main>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </main>
  )
}

export default App;