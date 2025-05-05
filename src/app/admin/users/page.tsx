import UsersTable from '@/components/usersTable'
import axios from 'axios'
import React from 'react'

async function getAllUsers() {
  try {
    const response = await axios.get(`${process.env.BASE_URL}/api/users`, {
      headers: {
        "Authorization": process.env.API_KEY
      }
    })

    return response.data;
  } catch (e) {
    console.log(e);
  }
}

const page = async () => {
  const allUsers = await getAllUsers();

  return (
    <div className='flex justify-center items-center px-5'>
      <UsersTable users={allUsers}/>
    </div>
  )
}

export default page