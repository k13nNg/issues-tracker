"use server";
import axios, { AxiosError } from "axios";

enum Priority {
    LOW,
    MEDIUM,
    HIGH
}

interface Ticket {
    title: string,
    priority: Priority,
    desc: string,
    author: string
}
export async function createTicket(ticket: Ticket) {

    
    try {
        await axios.post(`${process.env.BASE_URL}/api/tickets`, ticket, {
            headers: {"Authorization": process.env.API_KEY}
        })
        return {success: "Submitted ticket succesfully!"};
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
            // Unknown erro
            return { error: "An unknown error occurred." };
        }
    }


}