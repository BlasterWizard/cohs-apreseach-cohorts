import { AuthErrorCodes } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { User, ProfileUser } from "../Interfaces+Classes";

interface ProfilePictureProps {
    user: ProfileUser;
    size: ProfilePictureSize;
}

export enum ProfilePictureSize {
    Large,
    Medium,
    Small
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ user, size }) => {
    const [profilePictureClassName, setProfilePictureClassName] = useState<string>("");
    const [textClassName, setTextClassName] = useState<string>("");

    useEffect(() => {
        determineProfilePictureClassName();
    }, []);

    const determineProfilePictureClassName = () => {
        switch (size) {
            case ProfilePictureSize.Large:
                setTextClassName("relative top-10 text-5xl text-white drop-shadow-lg text-center");
                !user.profileURL ? setProfilePictureClassName("bg-gray-400 rounded-full w-32 h-32 drop-shadow-2xl") : setProfilePictureClassName("drop-shadow-2xl object-cover h-32 w-32 rounded-full");
                break;
            case ProfilePictureSize.Medium:
                setTextClassName("relative top-5 text-xl text-white drop-shadow-lg text-center");
                !user.profileURL ? setProfilePictureClassName("bg-gray-400 rounded-full w-16 h-16 drop-shadow-2xl") : setProfilePictureClassName("drop-shadow-2xl object-cover h-16 w-16 rounded-full");
                break;
            case ProfilePictureSize.Small:
                setTextClassName("relative top-1.5 text-sm text-white drop-shadow-lg text-center");
                !user.profileURL ? setProfilePictureClassName("bg-gray-400 rounded-full w-8 h-8 drop-shadow-2xl") : setProfilePictureClassName("drop-shadow-2xl object-cover h-8 w-8 rounded-full");
        }
    }

    return (
        <>
            {/* No ImgURl */}
            {
                !user.profileURL &&
                <div className="flex justify-center">
                    <div className={profilePictureClassName}>
                        <p className={textClassName}>{user.firstName[0]}{user.lastName[0]}</p>
                    </div>
                </div>
            }
            {/* ImgURL Exists */}
            {
                user.profileURL && 
                <div className="flex justify-center">
                    <img src={user.profileURL} alt='uploaded file' className={profilePictureClassName}/>
                </div>
            }
        </>
    );
}

export default ProfilePicture;