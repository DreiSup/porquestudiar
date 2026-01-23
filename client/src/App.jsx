import './index.css'
import {Routes, Route} from "react-router-dom"
import Home from './pages/Home';
import Chat from './pages/Chat';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ChatOnBuild from './pages/ChatOnBuild';
import { useAuth } from './context/AuthContext';
import Experiment from './pages/Experiment';
import NavBar from './components/Nav';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import SideBar from './components/SideBar';

function App() {

  const auth = useAuth()
  console.log(auth.isLoggedIn)
  
  return (
      <main className="flex-1 flex flex-col min-h-screen min-w-0 bg-slate-950 dark">
        {/* <NavBar /> */}
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/chat' element={<Chat/>}/>
          {/* <Route path='/chatonbuild' element={<ChatOnBuild/>}/> */}
          <Route path='/experiment' element={<Experiment/>}/>
          <Route path='/*' element={<NotFound/>}/>
        </Routes>
      </main>
  )
}

export default App;