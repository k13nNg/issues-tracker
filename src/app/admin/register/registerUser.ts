"use server";
import axios, { AxiosError } from "axios";
import bcrypt from "bcryptjs";

interface User {
    username: string,
    password: string,
    role: "ADMIN" | "USER"
}
export async function registerUser(user: User) {
    const generatedSalt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(user.password, generatedSalt);
    
    try {
        await axios.post(`${process.env.BASE_URL}/api/users/register`, 
            {
                username: user.username, 
                password: hashedPassword, 
                role: user.role
            }, {
              headers: {
                Authorization: process.env.API_KEY
              }
            }
        )
        return {success: "Registered user succesfully!"};
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