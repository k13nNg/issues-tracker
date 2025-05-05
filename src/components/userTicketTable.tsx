"use client";
import React, {useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import Markdown from "react-markdown";

const UserTicketTable = (props: any) => {
    const [status, setStatus] = useState("all");
    const [priority, setPriority] = useState("all");

    interface Issue {
        title: string;
        desc: string;
        priority: string;
        status: string;
    }

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

    return (
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                {/* <TableHead className='text-center'>Priority</TableHead> */}
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
            </TableRow>
            </TableHeader>
            <TableBody>
                {
                        props.userIssues.map((issue: Issue, index: number) => {
                            if ( (issue.priority.toLowerCase() === priority || 
                                priority === "all") && 
                                (issue.status.toLowerCase() === status || 
                                status === "all" || 
                                (issue.status === "IN_PROGRESS" && 
                                status === "inProgress")) ) {
                                    return (
                                        <TableRow key={index}>
                                        <TableCell>{issue.title}</TableCell>
                                        <TableCell>
                                            <Markdown>{issue.desc}</Markdown>
                                        </TableCell>
                                        <TableCell className=''>
                                            {/* <div className='bg-green-200 rounded-sm text-center'>
                                            {issue.priority}
                                            </div> */}
                                            <Priority priority={issue.priority}/>
                                        </TableCell>
                                        <TableCell className='text-center'>
                                            {/* <div>
                                            {issue.status}
                                            </div> */}
                                            <Status status={issue.status}/>
                                        </TableCell>
                                        </TableRow>
                                    )
                            }
                        }
                            
                    )
                }
            </TableBody>
        </Table>
    )
}

export default UserTicketTable