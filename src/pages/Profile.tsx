import React, { useEffect, useState } from "react";
import { ProfileUser, User } from "../Interfaces+Classes";
import {  UserCredential } from "firebase/auth";
import ProfileEditModal from "./ProfileEditModal";
import ProfilePicture, { ProfilePictureSize } from "../components/ProfilePicture";
import Spinner from 'react-bootstrap/Spinner';
import UnauthorizedAccess from "./Special Pages/UnauthorizedAccess";

interface ProfileProps {
	user: UserCredential["user"] | undefined;
	currentUser: User | undefined;
}

const Profile: React.FC<ProfileProps> = ({ user, currentUser }) => {
	return (
		<main>
			 {
				(JSON.parse(localStorage.getItem("isLoggedIn")!) && JSON.parse(localStorage.getItem("isApproved")!)) 
				? 
				<ProfileView currentUser={currentUser} user={user} />
				:
				<UnauthorizedAccess />
        	}				
		</main>
	);
}

export default Profile;


const ProfileView: React.FC<ProfileProps> = ({ currentUser, user}) => {
	const [showEditModal, setShowEditModal] = useState(false);

	const handleEditModal = () => setShowEditModal(!showEditModal);

	return (
		<>
			{
				currentUser == undefined ?
				<Spinner animation="border" /> :
				<div className="bg-white/60 rounded-md p-10 w-3/4 flex flex-col focus:outline-none max-w-3xl min-w-fit">
					<div className="overflow-auto">
						<button onClick={handleEditModal} className="px-2 py-1 bg-violet-300 hover:bg-violet-400 rounded-lg w-fit float-right text-white font-bold">Edit</button>
					</div>
					<h1 className="font-bold text-3xl text-center">Profile</h1>
					{/* Profile Image */}
					<ProfilePicture user={new ProfileUser(currentUser.firstName, currentUser.lastName, currentUser.profile?.profilePictureURL)} size={ProfilePictureSize.Large} />
					<h1 className="text-center mt-2 text-2xl font-bold text-slate-500">{currentUser.firstName + " " + currentUser.lastName}</h1>
					<div className="flex flex-col mt-4">
						<p className="text-xl text-center font-bold m-2">Personal Info</p>
						<p><span className="font-bold">First Name: </span>{currentUser?.firstName ?? "Can't Find User's First Name"}</p>
						<p><span className="font-bold">Last Name: </span>{currentUser?.lastName ?? "Can't Find User's Last Name"}</p>
						<p><span className="font-bold">Graduating Year: </span>{currentUser?.profile?.graduatingYear ?? "Can't Find User's Graduating Year"}</p>
						<p><span className="font-bold">Email: </span>{user?.email ?? "Can't Find User's Email"}</p>
						<p><span className="font-bold">Phone: </span>
							{currentUser?.profile?.phoneNumber === undefined ||  currentUser?.profile?.phoneNumber === ""  ? 
							<span className="text-red-500">Phone Number Not Found</span> :
							currentUser?.profile?.phoneNumber
							}
						</p>
					</div>
					<hr/>
					<div className="flex flex-col">
						<p className="text-xl text-center font-bold m-2">College</p>
						<p><span className="font-bold">College: </span>
							{currentUser?.profile?.school === undefined ||  currentUser?.profile?.school === ""  ? 
							<span className="text-red-500">School Not Found</span> :
							currentUser?.profile?.school
							}
						</p>
						<p><span className="font-bold">Current Grade: </span>
							{currentUser?.profile?.grade === undefined ||  currentUser?.profile?.grade === ""  ? 
							<span className="text-red-500">Grade Not Found</span> :
							currentUser?.profile?.grade
							}
						</p>
						<p><span className="font-bold">Major: </span>
							{currentUser?.profile?.major === undefined ||  currentUser?.profile?.major === ""  ? 
							<span className="text-red-500">Major Not Found</span> :
							currentUser?.profile?.major
							}
						</p>
					</div>
					<hr/>
					<div className="flex flex-col">
						<p className="text-xl text-center font-bold m-2">AP Capstone</p>
						<p><span className="font-bold">AP Seminar Test Score: </span>
							{currentUser?.profile?.apInfo?.APSeminarScore === undefined ||  currentUser?.profile?.apInfo.APSeminarScore === 0  ? 
							<span className="text-red-500">AP Seminar Score Not Found</span> :
							currentUser?.profile?.apInfo?.APSeminarScore
							}
						</p>
						<p><span className="font-bold">AP Research Test Score: </span>
							{currentUser?.profile?.apInfo?.APResearchScore === undefined ||  currentUser?.profile?.apInfo.APResearchScore === 0  ? 
							<span className="text-red-500">AP Research Score Not Found</span> :
							currentUser?.profile?.apInfo?.APResearchScore
							}
						</p>
						<p>
							<span className="font-bold">AP Research Paper: </span> 
							{
								currentUser?.profile?.apInfo?.APResearchPaperURL == undefined || currentUser?.profile?.apInfo?.APResearchPaperURL === "" ? 
								<span className="text-red-500">AP Research Paper Link Not Found</span>:
								<a href={currentUser?.profile?.apInfo?.APResearchPaperURL} target="_blank">
								<span className="bg-gray-200 py-1 px-2 rounded-lg"><i className="fa-solid fa-link"></i> {currentUser?.profile?.apInfo?.APResearchPaperTitle}</span>
							</a>
							}
							
						</p>
					</div>
					{/*Edit Modal*/}
					<ProfileEditModal 
						showEditModal={showEditModal} 
						handleEditModal={handleEditModal} 
						currentUser={currentUser}
						user={user}
					/>
				</div>
			}
		</>
	);
}