import { getSession } from '@/app/authentication'
import Link from 'next/link'
import React from 'react'
import LogoutButton from './logoutButton';
import LoginButton from './loginButton';


const Navbar = async () => {
  const session = await getSession();
  
  if (!session) {
    return (
      <div className='mb-5'>
        <div className='flex flex-row justify-between bg-gray-200 py-3 px-5 items-center'>
          <p className='text-xl font-bold'>Trackr</p>
  
          <LoginButton/>
        </div>
  
      </div>
    )
  } else if (session.user.role === "USER") {
    return (
      <div className='mb-5'>  
        <div className='flex flex-row justify-between bg-gray-200 py-3 px-5 items-center'>
            <p className='text-xl font-bold'>Trackr</p>
    
            <ul className='flex flex-row gap-5 items-center'>
              <Link href="/tickets">Tickets</Link>
              <Link href="/changePassword">Change Password</Link>
              <LogoutButton/>
            </ul>
    
        </div>
      </div>
    )
  } else {
    return (
      <div className='mb-5'>  
        <div className='flex flex-row justify-between bg-gray-200 py-3 px-5 items-center'>
            <p className='text-xl font-bold'>Trackr</p>
    
            <ul className='flex flex-row gap-5 items-center'>
              <Link href="/admin">Dashboard</Link>
              <Link href="/admin/tickets">Tickets</Link>
              <Link href="/admin/users">Users</Link>
              <LogoutButton/>
            </ul>
    
        </div>
      </div>
    )
  }
  
}

export default Navbar