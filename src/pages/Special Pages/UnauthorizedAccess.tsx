import React from "react";

const UnauthorizedAccess = () => {
    return (
        <div className="flex flex-col items-center">
            <i className="fa-solid fa-triangle-exclamation text-5xl text-red-600"></i>
            <div className="flex flex-col m-3 text-center space-y-5">
                <h1 className="font-bold text-3xl text-white">You do not have authorized access to this page.</h1>
                <p className="font-bold text-2xl text-white">Please return to previous page.</p>
            </div>              
        </div>
    );
}

export default UnauthorizedAccess;