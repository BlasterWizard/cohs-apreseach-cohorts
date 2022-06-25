import { UserCredential } from "firebase/auth";
import React from "react";
import { User } from "../Interfaces+Classes";

interface PendingUserPageProps {
    user: UserCredential["user"] | undefined;
    currentUser: User | undefined;
}

const PendingUserPage: React.FC<PendingUserPageProps> = ({ user, currentUser }) => {
    return (
        <main>
            {
                currentUser?.approvalStatus.deniedReason === undefined ? 
                <i className="fa-solid fa-hourglass text-5xl animate-spin-slow"></i> :
                <i className="fa-solid fa-circle-xmark text-7xl text-red-500"></i>
            }
           
            <div className="flex flex-col m-5 text-center space-y-5">
                {
                    currentUser?.approvalStatus.deniedReason === undefined ? 
                    <>
                        <h1 className="font-bold text-2xl text-white">Your sign up request is pending for authorization.</h1>
                        <p className="text-white">You will be notified via email (<span className="font-bold">{ user?.email ?? ""}</span>) if you are authorized.</p>
                    </> 
                    :
                    <>
                        <h1 className="font-bold text-2xl text-white">Your sign up request has been rejected.</h1>
                        <p className="text-white">Please email _____ to appeal the decision.</p>
                    </>
                }

            </div>
        </main>
    );
}

export default PendingUserPage;