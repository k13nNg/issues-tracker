import React from 'react'
import axios from 'axios';
import AdminTicketTable from '@/components/adminTicketTable';

async function getAllTickets() {
  const tickets = await axios.get(`${process.env.BASE_URL}/api/tickets`, {headers: {
    Authorization: process.env.API_KEY
  }})

  return tickets.data;
}

const page = async () => {
  const allTickets = await getAllTickets();
  return (
    <div className='p-5 flex justify-center items-center'>
      <AdminTicketTable tickets={allTickets}/>
    </div>
  )
}

export default page