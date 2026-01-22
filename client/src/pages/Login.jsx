import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

const LogIn = () => {
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const auth = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")

        console.log("froooontendd")

        try {

            const res = await auth?.login(formData.email, formData.password);

            if (res) {
                navigate("/chat")
            } else {
                setError("Credenciales incorrectas")
            }

        } catch (error) {
            console.log("Ha habido un error al registrarte: ", error)
        }
    }

    /* useEffect(() => {
        if (auth?.user) {
            return navigate("/chat")
        }
    }, [auth, navigate]) */

  return (
    <div className='min-h-screen bg-gray-950 flex flex-col justify-center items-center p-4'>
        login page
        <div className='className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl'>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm mb-4 text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label className=''>Email</label>
                    <input 
                        type="email"
                        name='email'
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='email'
                        className='w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 transition-all' 
                    />
                </div>
                <div>
                    <label className=''>password</label>
                    <input 
                        type="password"
                        name='password'
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder='••••••••'
                        className='w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 transition-all' 
                    />
                </div>               
                <button
                    type='submit'
                    className='w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 rounded-xl mt-4 transition-all active:scale-95 shadow-lg shadow-amber-900/20'
                >
                    Iniciar Sesion
                </button>
            </form>
        </div>
    </div>
  )
}

export default LogIn