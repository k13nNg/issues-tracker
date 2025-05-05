"use client";
import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './ui/button';
import { FaKey } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import {useForm, SubmitHandler} from 'react-hook-form';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import bcrypt from "bcryptjs";
import { changePasswordAdmin} from '@/app/changePassword/changePassword';

interface User {
    username: string,
    role: string
}

type Inputs = {
    newPassword: string,
    confirmNewPassword: string,
  }

function ChangePasswordDialog(props:any) {
    const {
        reset,
        register,
        handleSubmit
    } = useForm<Inputs>();

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

        if (data.newPassword !== data.confirmNewPassword) {
            errorToast("Passwords don't match!");
            reset();
        } else if (!isValidPassword(data.newPassword)) {

            errorToast("Please make sure your password contains at leat 1 uppercase letter, 1 lowercase letter, 1 special character and is at least 8 characters long");
            reset();
        } else {
            const hashedPassword = await bcrypt.hash(data.newPassword, generatedSalt);
            
            const result = await changePasswordAdmin({username: props.user, password: hashedPassword});

            if (result.success) {
                successToast(result.success);
            } else {
                errorToast(result.error);
            }
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='hover:cursor-pointer'>Change Password <FaKey /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle className='text-center'>Change Password</DialogTitle>
                <DialogDescription className='text-center'>
                    Change {props.user}&apos;s password here
                </DialogDescription>
                </DialogHeader>
                <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
                    <Input placeholder="New Password" className='border-2 px-2 rounded-xs' type='password' {...register("newPassword")} />
                    <Input placeholder="Confirm Password" className='border-2 px-2 rounded-xs' type='password' {...register("confirmNewPassword")} />
                <DialogFooter>
                <Button type="submit" className='hover:cursor-pointer'>Submit</Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const UsersTable = (props: any) => {

    return (
        <div className='w-3/4'>
            <ToastContainer/>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead className='text-center'>Role</TableHead>
                        <TableHead className='text-right' >Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    {
                        props.users.map((user: User, index: number) => (
                            <TableRow key={index}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell className='text-center'>
                                    {user.role}
                                </TableCell>
                                <TableCell>
                                    <div className='flex justify-end gap-5'>
                                        <ChangePasswordDialog user = {user.username}/>
                                    </div>
                                </TableCell>
                            </TableRow>
                            )
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default UsersTable