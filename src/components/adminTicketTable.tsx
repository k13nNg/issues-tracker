"use client";
import React, {useState} from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import Markdown from "react-markdown";
import { CiTrash } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { Button } from './ui/button';
import { CiCircleCheck } from "react-icons/ci";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { BsThreeDotsVertical } from "react-icons/bs";


const AdminTicketTable = (props: any) => {
    const [status, setStatus] = useState("all");
    const [priority, setPriority] = useState("all");
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [updatedPriority, setUpdatedPriority] = useState("");
    const [updatedStatus, setUpdatedStatus] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const router = useRouter();

    interface Issue {
        id: string;
        title: string;
        desc: string;
        priority: string;
        status: string;
        author: string;
    }

    const success = (msg: string) => toast.success(msg, {
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

    const error = (msg: string) => toast.error(msg, {
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

    function Priority(props: any) {
        if (props.priority === "LOW") {
            return (
                <div className='flex justify-center'>
                    <div className="px-5 bg-green-200 rounded-sm text-center text-green-600">{props.priority}</div>
                </div>
            )
        } else if (props.priority === "MEDIUM") {
            return (
                <div className='flex justify-center'>
                    <div className="px-5 bg-yellow-200 rounded-sm text-center text-yellow-600">{props.priority}</div>
                </div>
            )
        } else {
            return (
                <div className='flex justify-center'>
                    <div className="px-5 bg-red-200 rounded-sm text-center text-red-600">{props.priority}</div>
                </div>
            )
        }
    }
        
    function Status(props: any) {
        if (props.status === "OPEN") {
            return (
                <div className='flex justify-center'>
                    <div className="px-5 bg-blue-200 rounded-sm text-center text-blue-600">{props.status}</div>
                </div>
            )
        } else if (props.status === "IN_PROGRESS") {
            return (
                <div className='flex justify-center'>
                    <div className="px-5 bg-orange-200 rounded-sm text-center text-orange-600">{props.status.replace("_", " ")}</div>
                </div>
            )
        } else {
            return (
                <div className='flex justify-center'>
                    <div className="px-5 bg-purple-200 rounded-sm text-center text-purple-600">{props.status}</div>
                </div>
            )
        }
    }

    async function handleSubmit(data: Issue) {
        try {
            await axios.put("/api/tickets", data, {
                headers: {"Authorization": process.env.API_KEY}
            }) 
            success("Updated ticket successfully!");
            router.refresh();
        } catch (e) {
            error(`An unexpected error has occured: ${e}`);
        }

    }

    async function handleDelete(data: Issue) {
        try {
            await axios.delete("/api/tickets", {
            headers: {
                    "Authorization": process.env.API_KEY
                },
                data
            })
            success("Deleted ticket successfully!")
            router.refresh();
        } catch (e) {
            error(`An unexpected error has occured: ${e}`);
        }
    }

    return (
        <div className='w-7xl'>
            <ToastContainer/>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className='w-[240px]'>Title</TableHead>
                    <TableHead className='w-[550px]'>Description</TableHead>
                    <TableHead className='text-center'>Camp</TableHead>
                    <TableHead>
                        <div className='flex items-center justify-center'>
                            <select className='text-center' id="priority" defaultValue="all" onChange={(e) => {
                                if (e.target.value !== "all") {
                                    setStatus("all");
                                }
                                setPriority(e.target.value);
                            }}>
                                <option value="all">All</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </TableHead>
                    <TableHead>
                        <div className='flex items-center justify-center'>
                            <select className='text-center' id="status" defaultValue="all" onChange={(e) => {
                                if (e.target.value !== "all") {
                                    setPriority("all");
                                }
                                setStatus(e.target.value);
                            }}>
                                <option value="all">All</option>
                                <option value="open">Open</option>
                                <option value="inProgress">In Progress</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </TableHead>
                    <TableHead className='text-center'>
                        Actions
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                    {
                            props.tickets.map((issue: Issue, index: number) => {
                                if ( (issue.priority.toLowerCase() === priority || 
                                    priority === "all") && 
                                    (issue.status.toLowerCase() === status || 
                                    status === "all" || 
                                    (issue.status === "IN_PROGRESS" && 
                                    status === "inProgress")) ) {
                                        return (
                                            <TableRow key={index} className='w-[240px]'>
                                            <TableCell>{issue.title}</TableCell>
                                            <TableCell className='w-[550px]'>
                                                <Markdown>{issue.desc}</Markdown>
                                            </TableCell>
                                            <TableCell className='text-center'>
                                                {issue.author}
                                            </TableCell>
                                            <TableCell className=''>
                                                {
                                                    (isEditing && editingIndex === index)? (
                                                    <select className='border border-gray-300 rounded-sm px-2 py-1 h-full text-center' id="priority" aria-placeholder='LOW' defaultValue="null" onChange={(e) => setUpdatedPriority(e.target.value)}>
                                                        <option value="LOW">LOW</option>
                                                        <option value="MEDIUM">MEDIUM</option>
                                                        <option value="HIGH">HIGH</option>
                                                </select>) : (<Priority priority={issue.priority}/>)
                                                }
                                                
                                            </TableCell>
                                            <TableCell className='text-center'>
                                                {
                                                    (isEditing && editingIndex === index)? (
                                                    <select className='border border-gra-300 rounded-sm px-2 py-1 h-full text-center' id="priority" aria-placeholder='LOW' defaultValue="null" onChange={(e) => setUpdatedStatus(e.target.value)}>
                                                        <option value="OPEN">OPEN</option>
                                                        <option value="IN_PROGRESS">IN PROGRESS</option>
                                                        <option value="CLOSED">CLOSED</option>
                                                    </select>) : (<Status status={issue.status}/>)
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {(isEditing && editingIndex === index) ? (<div className='flex flex-col gap-3'>
                                                    <Button className='hover:cursor-pointer' type="button" onClick={() => {
                                                        setIsEditing(!isEditing);
                                                        setEditingIndex(-1);
                                                        if (updatedPriority !== "" || updatedStatus !== "") {

                                                            handleSubmit({
                                                                id: issue.id,
                                                                title: issue.title,
                                                                desc: issue.desc,
                                                                priority: (updatedPriority === "")? issue.priority : updatedPriority,
                                                                status: (updatedStatus === "")? issue.status : updatedStatus,
                                                                author: issue.author
                                                            })
                                                        }

                                                    }
                                                    }>Submit<CiCircleCheck/></Button>
                                                </div>) : ( (showOptions && editingIndex === index)? (<div className='flex flex-col gap-3'>
                                                        <Button className='bg-blue-500 hover:bg-blue-400 hover:cursor-pointer' onClick={() => {
                                                            setIsEditing(!isEditing);
                                                            // setEditingIndex(index);
                                                        }}>Edit <CiEdit/></Button>
                                                        <Button className='bg-red-500 hover:bg-red-400 hover:cursor-pointer' onClick={() => {
                                                            handleDelete(issue)
                                                            setEditingIndex(-1);
                                                        }}>Delete <CiTrash/></Button>
                                                    </div>) : (<div className='flex justify-center items-center'>
                                                        <BsThreeDotsVertical className="hover:cursor-pointer" onClick={() => {
                                                            setEditingIndex(index);
                                                            setShowOptions(!showOptions);
                                                        }}/>
                                                    </div>)
                                                )}
                                            </TableCell>
                                            </TableRow>
                                        )
                                }
                            }
                                
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminTicketTable