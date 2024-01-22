import React from 'react'
import { auth } from '../config/firebase'
import logOut from './logOut'

function Nav() {
  return (
    <div>
        <p className='text-2xl'>Mark your Attendence!</p>
        {auth?.currentUser?.email &&
        <div>
        <h1>Welcome {auth?.currentUser?.email}</h1>
        <button onClick={logOut}>Logout</button>
        </div>
        }

    </div>
  )
}

export default Nav