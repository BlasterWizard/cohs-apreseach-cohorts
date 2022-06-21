import React, { useEffect, useState } from "react";
import { User } from "../Interfaces+Classes";

interface ProfilePictureProps {
    user: User | undefined;
    imgUrl: string;
    size: ProfilePictureSize;
}

export enum ProfilePictureSize {
    Large,
    Small
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ imgUrl, user, size }) => {
    const [profilePictureClassName, setProfilePictureClassName] = useState<string>("");
    const [textClassName, setTextClassName] = useState<string>("");

    useEffect(() => {
        determineProfilePictureClassName();
    }, []);

    const determineProfilePictureClassName = () => {
        switch (size) {
            case ProfilePictureSize.Large:
                setTextClassName("relative top-10 text-5xl text-white drop-shadow-lg");
                !imgUrl ? setProfilePictureClassName("bg-gray-400 rounded-full w-32 h-32 drop-shadow-2xl") : setProfilePictureClassName("drop-shadow-2xl object-cover h-32 w-32 rounded-full");
                break;
            case ProfilePictureSize.Small:
                setTextClassName("relative top-5 text-xl text-white drop-shadow-lg");
                !imgUrl ? setProfilePictureClassName("bg-gray-400 rounded-full w-16 h-16 drop-shadow-2xl") : setProfilePictureClassName("drop-shadow-2xl object-cover h-16 w-16 rounded-full");
                break;
        }
    }

    return (
        <>
            {/* No ImgURl */}
            {
                !imgUrl &&
                <div className="flex justify-center">
                    <div className={profilePictureClassName}>
                        <p className={textClassName}>{user?.firstName[0]}{user?.lastName[0]}</p>
                    </div>
                </div>
            }
            {/* ImgURL Exists */}
            {
                imgUrl && 
                <div className="flex justify-center">
                    <img src={imgUrl} alt='uploaded file' className={profilePictureClassName}/>
                </div>
            }
        </>
    );
}

export default ProfilePicture;