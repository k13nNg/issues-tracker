"use client"
import { Button } from '@/components/ui/button';
import React from 'react';
import {useForm, SubmitHandler, SubmitErrorHandler} from 'react-hook-form';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { authenticateUser } from '../authentication';
import { useRouter } from 'next/navigation';

type Inputs = {
  username: string,
  password: string
}

const forgotPasswordToast = () => toast('Please contact the Technical Program Assistant for password reset!', {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
  });

const errorToast = (m: string) => toast.error(m, {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
});

const successToast = (m: string) => toast.success(m, {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
});

const Page = () => {
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>();

  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {

    const result = await authenticateUser(data.username, data.password);

    if (result.error) {
      errorToast(result.error);
    } else if (result.success) {
      successToast(result.success);
       
      if (result.userRole === "USER") {
        router.push("/tickets");
      } else {
        router.push("/admin");
      }
    } else {
      errorToast("An unexpected error has occurred!");
    }

  };
  
  const onError: SubmitErrorHandler<Inputs> = (errors) => console.log(errors);

  return (
    <div className='flex items-center justify-center grow'>
    <ToastContainer/>
      <div className='text-center flex flex-col gap-5 border-2 rounded-sm p-5'>
        <p className="text-lg md:text-3xl sm:text-5xl text-primary">Log in</p>

        <div className='w-full'>
          <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
            <input placeholder='Username' className='border-2 px-2 rounded-xs' {...register("username")} />
            <input placeholder="Password" className='border-2 px-2 rounded-xs' type='password' {...register("password")} />
          </form>
          <div className='flex flex-row space-between mt-5 items-center'>
            <p className='pr-15 hover:cursor-pointer' onClick={forgotPasswordToast}><u>Forgot Password</u></p>
            <Button type="button" onClick={(e) => {handleSubmit(onSubmit, onError)(e)}} className='hover:cursor-pointer'>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page;