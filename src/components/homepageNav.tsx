import React from 'react'
import { getSession } from '@/app/authentication'
import LoginButton from './loginButton';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

const HomepageNav = async () => {
    const session = await getSession();

    if (session === null) {
        return (
            <LoginButton/>
        )
    } else if (session.user.role === "USER") {
        console.log("asdf")
        return (
            <div>
                <Link href = "/tickets" className='text-black'><ul>Go to Tickets <FiArrowRight/></ul></Link>
            </div>
        )
    } else {
        return (
            <div>
                <Link href = "/admin"><ul>Go to Dashboard <FiArrowRight/></ul></Link>
            </div>
        )
    }
}

export default HomepageNav