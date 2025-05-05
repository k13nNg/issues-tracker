"use client"

import { Button } from '@/components/ui/button';
import React from 'react';
import {useForm, SubmitHandler, SubmitErrorHandler, Controller} from 'react-hook-form';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { registerUser } from './registerUser';


enum userRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

type Inputs = {
  username: string,
  password: string,
  confirmPassword: string,
  role: userRole
}

const Page = () => {
  const {
    reset,
    register,
    control,
    handleSubmit,
  } = useForm<Inputs>()

    const RegisterSuccess = (m: string) => toast.success(m, {
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

    const RegisterError = (msg: string) => toast.error(msg, {
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

  function isValidPassword(password: string): boolean {
    const minLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
  
    return minLength && hasSpecialChar && hasLowercase && hasUppercase && hasNumber;
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {


    if (!isValidPassword(data.password)) {
      RegisterError("Please make sure your password contains at leat 1 uppercase letter, 1 lowercase letter, 1 special character and is at least 8 characters long");
      reset();
    } else if (data.password !== data.confirmPassword) {
        RegisterError("Passwords don't match!");
        reset();
    } else if (data.role === undefined) {
      RegisterError("Please select a role for the user!");
    } else {
        const newUser = {
          username: data.username,
          password: data.password,
          role: data.role
        }
        const result = await registerUser(newUser);

        if (result.success) {
          RegisterSuccess(result.success);
        } else {
          RegisterError(result.error);
        } 
    }
  };

  const onError: SubmitErrorHandler<Inputs> = (errors) => console.log(errors);

  return (
    <div className='flex items-center justify-center grow'>
      <ToastContainer/>
      <div className='text-center flex flex-col gap-5 border-2 rounded-sm p-5'>
        <p className="text-lg md:text-3xl sm:text-5xl text-primary">Register</p>

        <div className='w-full'>
          <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select value={field.value !== undefined ? field.value : ""} onValueChange={field.onChange} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={userRole.USER}>User</SelectItem>
                  <SelectItem value={userRole.ADMIN}>Admin</SelectItem>
                </SelectContent>
              </Select>
            )}
          />


            <input placeholder='Username' className='border-2 px-2 rounded-xs' {...register("username")} />
            <input placeholder="Password" className='border-2 px-2 rounded-xs' type='password' {...register("password")} />
            <input placeholder="Confirm Password" className='border-2 px-2 rounded-xs' type='password' {...register("confirmPassword")} />
          </form>
          <div className='text-right pt-5'>
            <Button type="button" onClick={(e) => {handleSubmit(onSubmit, onError)(e)}} className='hover:cursor-pointer'>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page