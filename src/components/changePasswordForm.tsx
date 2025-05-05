"use client";

import { Button } from '@/components/ui/button';
import React from 'react';
import {useForm, SubmitHandler, SubmitErrorHandler} from 'react-hook-form';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import bcrypt from "bcryptjs";
import axios from 'axios';
import { Input } from './ui/input';

type Inputs = {
  username: string,
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string,
}
const ChangePasswordForm = (props: any) => {
    const {
        reset,
        register,
        handleSubmit
    } = useForm<Inputs>()

    const registerSuccess = () => toast.success('Changed Password Succesfully!', {
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

    const registerError = (msg: string) => toast.error(msg, {
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
        const generatedSalt = await bcrypt.genSalt(10);
        const user = await axios.post("/api/users/changePassword",
            {
                username: props.username
            }, 
            { headers: {
                    Authorization: process.env.NEXT_PUBLIC_API_KEY
                }
            }
        );
        if (await bcrypt.compareSync(data.oldPassword, user?.data.password) === false){
            registerError("Current password doesn't match");
            reset();
        } else if (data.newPassword !== data.confirmNewPassword) {
            registerError("Passwords don't match!");
            reset();
        } else if (!isValidPassword(data.newPassword)) {
            registerError("Please make sure your password contains at leat 1 uppercase letter, 1 lowercase letter, 1 special character and is at least 8 characters long");
            reset();
        } else {
            try {
                const hashedPassword = await bcrypt.hash(data.newPassword, generatedSalt);
                
                const response = await axios.put("/api/users/changePassword", 
                    {
                        username: props.username, 
                        password: hashedPassword,
                    }, {
                        headers: {
                            Authorization: process.env.NEXT_PUBLIC_API_KEY
                        }
                    }
                )

                if (response.status !== null) {
                registerSuccess();
                reset();
                }
            } catch (e:any) {
                console.log(e);
                registerError("An unexpected error has occurred!");
                reset();
            }
        }
    };

    const onError: SubmitErrorHandler<Inputs> = (errors) => console.log(errors);    

    return (
        <div className='flex items-center justify-center grow'>
        <ToastContainer/>
        <div className='text-center flex flex-col gap-5 border-2 rounded-sm p-5'>
            <p className="text-lg md:text-3xl sm:text-5xl text-primary">Change Password</p>

            <div className='w-full'>
            <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
                <p><b></b> {props.username}</p>
                <Input placeholder="Old Password" className='border-2 px-2 rounded-xs' type='password' {...register("oldPassword")} />
                <Input placeholder="New Password" className='border-2 px-2 rounded-xs' type='password' {...register("newPassword")} />
                <Input placeholder="Confirm Password" className='border-2 px-2 rounded-xs' type='password' {...register("confirmNewPassword")} />
            </form>
            <div className='text-right pt-5'>
                <Button type="button" onClick={(e) => {handleSubmit(onSubmit, onError)(e)}} className='hover:cursor-pointer'>Submit</Button>
            </div>
            </div>
        </div>
        </div>
    )
}

export default ChangePasswordForm;