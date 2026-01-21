import React from 'react'
import { useAuth } from '../context/AuthContext'

const Experiment = () => {

    const auth = useAuth()

  return (
    <>
       <h2 className='text-6xl'>EXPERIMENT</h2>
        <div>
        {auth.isLoggedIn
            ? <div> klk mi rey </div>
            : <></>
        }

        </div>
    </>
  )
}

export default Experiment