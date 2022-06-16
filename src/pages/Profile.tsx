import React, { useEffect, useState } from "react";
import { User } from "../Interfaces+Classes";
import {  UserCredential } from "firebase/auth";
import ProfileEditModal from "./ProfileEditModal";
import { spawn } from "child_process";

interface ProfileProps {
	user: UserCredential["user"] | undefined;
	currentUser: User | undefined;
}

const Profile: React.FC<ProfileProps> = ({ user, currentUser }) => {
	const [showEditModal, setShowEditModal] = useState(false);

	const handleEditModal = () => setShowEditModal(!showEditModal);

	return (
		<main>
			<div className="bg-white/60 rounded-md p-10 w-1/2 flex flex-col focus:outline-none">
				<button onClick={handleEditModal}><i className="fa-solid fa-pen-to-square bg-violet-300 px-3 py-2 rounded-lg w-fit float-right"></i></button>
				<h1 className="font-bold text-3xl text-center mb-5">Profile</h1>
				<div className="flex flex-col">
					<p className="text-xl text-center font-bold m-2">Personal Info</p>
					<div className="grid grid-cols-2">
						<p><span className="font-bold">First Name: </span>{currentUser?.firstName ?? "Can't Find User's First Name"}</p>
		            	<p><span className="font-bold">Last Name: </span>{currentUser?.lastName ?? "Can't Find User's Last Name"}</p>
					</div>
		            <p><span className="font-bold">Graduating Year: </span>{currentUser?.graduatingYear ?? "Can't Find User's Graduating Year"}</p>
		            <p><span className="font-bold">Email: </span>{user?.email ?? "Can't Find User's Email"}</p>
		            <p><span className="font-bold">Phone: </span>{currentUser?.phoneNumber ?? <span className="text-red-500">Phone Number Not Found</span>}</p>
	          	</div>
	          	<hr/>
	          	<div className="flex flex-col">
	          		<p className="text-xl text-center font-bold m-2">College</p>
	          		<p><span className="font-bold">College: </span>{currentUser?.school ?? <span className="text-red-500">"School Not Found"</span>}</p>
	          		<p><span className="font-bold">Current Grade: </span>{currentUser?.grade ?? <span className="text-red-500">"Grade Not Found"</span>}</p>
	          		<p><span className="font-bold">Major: </span>{currentUser?.major ?? <span className="text-red-500">"Major Not Found"</span>}</p>
	          	</div>
	          	<hr/>
	          	<div className="flex flex-col">
	          		<p className="text-xl text-center font-bold m-2">AP Capstone</p>
	          		<p><span className="font-bold">AP Seminar Test Score: </span>{currentUser?.apInfo?.APSeminarScore ?? <span className="text-red-500">AP Seminar Score Not Found</span>}</p>
	          		<p><span className="font-bold">AP Research Test Score: </span>{currentUser?.apInfo?.APResearchScore ?? <span className="text-red-500">AP Research Score Not Found</span>}</p>
	          		<p><span className="font-bold">AP Research Paper: </span>Building the Future</p>
	          	</div>
			</div>

			{/*Edit Modal*/}
			<ProfileEditModal 
				showEditModal={showEditModal} 
				handleEditModal={handleEditModal} 
				currentUser={currentUser}
				user={user}
			/>
		</main>
	);
}

export default Profile;