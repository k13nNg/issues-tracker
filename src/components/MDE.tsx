"use client";

import {useMemo} from 'react'
import "easymde/dist/easymde.min.css";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import {useForm, Controller} from "react-hook-form";
import dynamic from 'next/dynamic';
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
    ssr: false,
});
import { useRouter } from 'next/navigation';
import { createTicket } from '@/app/tickets/submitTicket';
import { Bounce, toast, ToastContainer } from 'react-toastify';

const MDE = (props: any) => {
    const router = useRouter();

    const toolbar = [
        {
            name: "bold",
            action: function customFunction1(editor:any) {
                editor.toggleBold();
            },
            className: "fa fa-bold",
            title: "Bold"
        },
        {
            name: "italic",
            action: function customFunction2(editor:any) {
                editor.toggleItalic();
            },
            className: "fa fa-italic",
            title: "Italicize"
        },
        {
            name: "heading",
            action: function customFunction3(editor:any) {
                editor.toggleHeading1();
            },
            className: "fa fa-header header-1",
            title: "Heading"
        },
        {
            name: "preview",
            action: function customFunction4(editor: any) {
                editor.togglePreview();
            },
            className: "fa fa-eye no-disable",
            title: "Preview"
        }
    ];

    const options: EasyMDE.Options = useMemo(() => ({
        autofocus: false,
        spellChecker: true,
        toolbar: toolbar,
      }), []);
    
    enum Priority {
      LOW,
      MEDIUM,
      HIGH
    }
    
    interface TicketForm {
      title: string,
      priority: Priority,
      desc: string
    }

    const {register, control, handleSubmit, reset} = useForm<TicketForm>();

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
  return (
    <div className=''>
        <ToastContainer/>
        <div>
            <form onSubmit={handleSubmit(async (data) => {
                const payload = {
                    title: data.title,
                    priority: data.priority,
                    desc: data.desc,
                    author: props.username
                }
                const result = await createTicket(payload);

                if (result.success) {
                    successToast(result.success);
                    reset();
                    router.refresh();
                } else {
                    errorToast(result.error);
                }


            })}>
                <div className='flex flex-row items-start space-x-10 justify-between'>
                    <Input placeholder='Title' className='grow' {...register("title")}>
                    </Input>
                    <select className='border border-gray-300 rounded-sm px-2 py-1 h-full' id="priority" aria-placeholder='LOW' defaultValue="null" {...register("priority")}>
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                    </select>
                </div>
                <div className="mt-5">
                    <Controller
                        name="desc"
                        control={control}
                        render={({field}) => 
                        <SimpleMDE 
                            placeholder='Description' 
                            options={options}
                        {...field}/>}
                    />
                    <div className='text-right'>
                        <Button className='hover:cursor-pointer'>Submit</Button>
                    </div>
                </div>
            </form>
            </div>
            
    </div>
  )
}

export default MDE;