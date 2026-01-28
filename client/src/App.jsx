import './index.css'
import {Routes, Route} from "react-router-dom"
import Home from './pages/Home';
import Chat from './pages/Chat';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';
import Experiment from './pages/Experiment';
import { Toaster } from 'sonner';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';

function App() {


  
  return (
      <main className="flex-1 flex flex-col min-h-screen min-w-0 dark">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/chat' element={
              <ProtectedRoute>
                <Chat/>
              </ProtectedRoute>
          }/>
          <Route path='/experiment' element={<Experiment/>}/>
          <Route path='/*' element={<NotFound/>}/>
        </Routes>
        <Toaster theme='dark' position='top-center'/>
      </main>
  )
}

export default App;