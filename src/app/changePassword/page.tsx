import ChangePasswordForm from "@/components/changePasswordForm";
import { getSession } from "../authentication";
import { redirect } from "next/navigation";

const page = async () => {
    const session = await getSession();;

    if (session === null) {
        redirect("/login")
    } else {
        return (
            <ChangePasswordForm username={session.user.username}/>
        )
    }
}

export default page