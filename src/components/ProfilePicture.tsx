import React, { useEffect } from "react";
import { User } from "../Interfaces+Classes";

interface ProfilePictureProps {
    user: User | undefined;
    imgUrl: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ imgUrl, user }) => {
    return (
        <>
            {/* No ImgURl */}
            {
                !imgUrl &&
                <div className="flex justify-center mb-3">
                    <div className="bg-gray-400 rounded-full w-32 h-32 drop-shadow-2xl">
                        <p className="relative top-10 text-5xl text-white drop-shadow-lg">{user?.firstName[0]}{user?.lastName[0]}</p>
                    </div>
                </div>
            }
            {/* ImgURL Exists */}
            {
                imgUrl && 
                <div className="flex justify-center mb-3">
                    <img src={imgUrl} alt='uploaded file' className="drop-shadow-2xl cropped-image rounded-full"/>
                </div>
            }
        </>
    );
}

export default ProfilePicture;