import { UserCredential } from "firebase/auth";
import React from "react";

interface PendingUserPageProps {
    user: UserCredential["user"] | undefined;
}

const PendingUserPage: React.FC<PendingUserPageProps> = ({ user }) => {
    return (
        <main>
            <i className="fa-solid fa-hourglass text-5xl animate-spin-slow"></i>
            <div className="flex flex-col m-5 text-center space-y-5">
                <h1 className="font-bold text-2xl text-white">Your sign up request is pending for authorization.</h1>
                <p className="text-white">You will be notified via email (<span className="font-bold">{ user?.email ?? ""}</span>) if you are authorized.</p>
            </div>
        </main>
    );
}

export default PendingUserPage;