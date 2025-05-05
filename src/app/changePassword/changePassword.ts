"use server";
import axios, { AxiosError } from "axios";

interface User {
    username: string,
    password: string,
}



export async function getUser(user: User){
    const response = await axios.post(`${process.env.BASE_URL}/api/users/changePassword`,
        {
            username: user.username
        }, 
        { headers: {
                Authorization: process.env.API_KEY
            }
        }
    );

    if (response === null) {
        return {error: "User doesn't exist"}
    }  else {
        return response.data
    }
}

export async function changePasswordUser(user: User) {
    try {
        await axios.put(`${process.env.BASE_URL}/api/users/changePassword`, 
            {
                username: user.username, 
                password: user.password,
            }, {
                headers: {
                    Authorization: process.env.API_KEY
                }
            }
        )

        return {success: "Changed password successfully!"}
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

export async function changePasswordAdmin(user: User) {
    try {
        await axios.put(`${process.env.BASE_URL}/api/users/changePassword`, user, {
            headers: {
                Authorization: process.env.API_KEY
            }
        })
        return {success: "Changed password successfully!"}
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