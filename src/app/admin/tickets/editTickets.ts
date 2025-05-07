"use server";

import axios, { AxiosError } from "axios";

interface Ticket {
    id: string;
    title: string;
    desc: string;
    priority: string;
    status: string;
    author: string;
}

export async function editTicket(ticket: Ticket) {
    try {
        await axios.put(`${process.env.BASE_URL}/api/tickets`, ticket, {
            headers: {"Authorization": process.env.API_KEY}
        })

        return {success: "Updated ticket successfully!"};
    } catch (e) {
        if (e instanceof AxiosError) {
            // Axios-specific error
            if (e.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                return { error: e.response.data?.message};
            } else if (e.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in Node.js
                return { error: "No response from server." };
            } else {
                // Something happened in setting up the request that triggered an Error
                return { error: e.message };
            }
        } else if (e instanceof Error) {
            // Generic JavaScript error

            return { error: e.message };
        } else {
            // Unknown error
            return { error: "An unknown error occurred." };
        }
    }
}

export async function deleteTicket(ticket: Ticket) {
    try {
        await axios.delete(`${process.env.BASE_URL}/api/tickets`, {
            headers: {
                "Authorization": process.env.API_KEY
            },
            data: {
                ticket: ticket
            }
        })

        return {success: "Deleted ticket successfully!"}
    } catch (e) {
        if (e instanceof AxiosError) {
            // Axios-specific error
            if (e.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                return { error: e.response.data?.message};
            } else if (e.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in Node.js
                return { error: "No response from server." };
            } else {
                // Something happened in setting up the request that triggered an Error
                return { error: e.message };
            }
        } else if (e instanceof Error) {
            // Generic JavaScript error

            return { error: e.message };
        } else {
            // Unknown error
            return { error: "An unknown error occurred." };
        }
    }
}