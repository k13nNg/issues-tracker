import axios from 'axios'
import React from 'react'

const Dashboard = async () => {
  interface Ticket {
    id: string;
    title: string;
    desc: string;
    priority: string;
    status: string;
    author: string;
}

  async function getAllTickets() {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tickets`, {headers: {
      "Authorization": process.env.NEXT_PUBLIC_API_KEY
    }})

    return response.data;
  }

  const allTickets = await getAllTickets();

  return (
    <div className='flex justify-center items-center grow'>
        <div className='flex flex-col gap-5'>
          <div className='p-5 border-2 rounded-sm flex flex-col gap-5'>
            <p className='font-bold text-center'>All Tickets</p>
            <p className='text-center'>{allTickets.length}</p>
          </div>
        <div className='grid grid-cols-3 gap-5'>
          <div className='p-5 border-2 rounded-sm flex flex-col gap-5'>
            <p className='font-bold'><span className='px-2 bg-blue-200 rounded-sm text-center text-blue-600'>Open</span> Tickets</p>
            <p className='text-center'>{(allTickets.filter((ticket: Ticket) => ticket.status === "OPEN")).length}</p>
          </div>
          <div className='p-5 border-2 rounded-sm flex flex-col gap-5'>
            <p className='font-bold'><span className='px-2 bg-orange-200 rounded-sm text-center text-orange-600'>In Progress</span> Tickets</p>
            <p className='text-center'>{(allTickets.filter((ticket: Ticket) => ticket.status === "IN_PROGRESS")).length}</p>
          </div>
          <div className='p-5 border-2 rounded-sm flex flex-col gap-5'>
            <p className='font-bold'><span className="px-2 bg-purple-200 rounded-sm text-center text-purple-600">Closed</span> Tickets</p>
            <p className='text-center'>{(allTickets.filter((ticket: Ticket) => ticket.status === "CLOSED")).length}</p>
          </div>

          <div className='p-5 border-2 rounded-sm flex flex-col gap-5'>
            <p className='font-bold'><span className='px-2 bg-red-200 rounded-sm text-center text-red-600'>HIGH</span> Tickets</p>
            <p className='text-center'>{(allTickets.filter((ticket: Ticket) => ticket.priority === "HIGH")).length}</p>
          </div>
          <div className='p-5 border-2 rounded-sm flex flex-col gap-5'>
            <p className='font-bold'><span className='px-2 bg-yellow-200 rounded-sm text-center text-yellow-600'>MEDIUM</span> Tickets</p>
            <p className='text-center'>{(allTickets.filter((ticket: Ticket) => ticket.priority === "MEDIUM")).length}</p>
          </div>
          <div className='p-5 border-2 rounded-sm flex flex-col gap-5'>
            <p className='font-bold'> <span className='px-2 bg-green-200 rounded-sm text-center text-green-600'>LOW</span> Tickets</p>
            <p className='text-center'>{(allTickets.filter((ticket: Ticket) => ticket.priority === "LOW")).length}</p>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Dashboard