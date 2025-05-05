import React from 'react';
import "easymde/dist/easymde.min.css";
import { redirect } from 'next/navigation';
import MDE from '@/components/MDE';
import { getSession } from '@/app/authentication';
import axios from 'axios';
import UserTicketTable from '@/components/userTicketTable';

async function getTicketsWithUsername(username: string) {

  try {

    const issues = await axios.get(`${process.env.BASE_URL}/api/tickets`, {headers: {
      Authorization: process.env.API_KEY
    }})
    
    const issues_array = issues.data.filter(
      (issue: {author: string}) => issue.author === username
    );
    return issues_array;
  } catch (e) {
    console.log(e);
  }

}

const page = async () => {
  const session = await getSession();
  
  if(!session) {
    redirect("/login");
  } else {
    const userIssues = await getTicketsWithUsername(session.user.username);
  
    return (
      <div className = "flex flex-col lg:flex-row">
        <div className='px-10 w-full lg:w-1/2 flex flex-col gap-3'>
          <p className='text-2xl'>Welcome back, {session.user.username}!</p>
          <MDE username={session.user.username}/>
        </div>
        <div className = "px-10 flex flex-col grow gap-3 sm:pb-5 min-h-screen">
            <p className='text-2xl'>Your Tickets</p>
            <UserTicketTable userIssues={userIssues}/>
        </div>
      </div>
    )
  }

  
}

export default page