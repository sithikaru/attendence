import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../config/firebase';
import logOut from './logOut';

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className='bg-blue-500 text-white p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <div>
          <p className='text-2xl font-bold'>Mark Your Attendance!</p>
        </div>
        <div className='lg:hidden'>
          <button
            onClick={toggleMenu}
            className='text-white focus:outline-none focus:ring focus:border-blue-300'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h16m-7 6h7'
              ></path>
            </svg>
          </button>
        </div>
        <div className={`lg:flex items-center ${menuOpen ? 'block' : 'hidden'}`}>
          {auth?.currentUser?.email ? (
            <div className='lg:flex items-center'>
              <h1 className='mr-4'>Welcome, {auth?.currentUser?.email}</h1>
              <button
                onClick={logOut}
                className='px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-300'
              >
                Logout
              </button>
            </div>
          ) : (
            <div className='lg:flex items-center'>
              <Link
                to='/login'
                className='block lg:inline-block text-white hover:underline lg:mr-4'
              >
                Login
              </Link>
              <Link to='/register' className='block lg:inline-block text-white hover:underline'>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;
