"use client";

import { Button } from '@/components/ui/button';
import React from 'react';
import {useForm, SubmitHandler, SubmitErrorHandler} from 'react-hook-form';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import bcrypt from "bcryptjs";
import { Input } from './ui/input';
import { changePasswordUser, getUser } from '@/app/changePassword/changePassword';

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

    const successToast = (msg: string) => toast.success(msg, {
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

    const errorToast = (msg: string) => toast.error(msg, {
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
        
        const user = await getUser({username: props.username, password: data.newPassword});

        if (await bcrypt.compareSync(data.oldPassword, user.password) === false){
            errorToast("Current password doesn't match");
            reset();
        } else if (data.newPassword !== data.confirmNewPassword) {
            errorToast("Passwords don't match!");
            reset();
        } else if (!isValidPassword(data.newPassword)) {
            errorToast("Please make sure your password contains at leat 1 uppercase letter, 1 lowercase letter, 1 special character and is at least 8 characters long");
            reset();
        } else {
            const hashedPassword = await bcrypt.hash(data.newPassword, generatedSalt);
            
            const result = await changePasswordUser({username: props.username, password: hashedPassword});

            if (result.success) {
                successToast(result.success);
            } else {
                errorToast(result.error);
            }
            reset();
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