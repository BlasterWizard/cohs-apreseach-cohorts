import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Button, Modal } from "react-bootstrap";
import { User } from "../Interfaces+Classes";
import { UserCredential } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import db from "../firebase";
import { SelectOption } from "../Interfaces+Classes";
import Select from "react-select";
import toast from "react-hot-toast";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import ProfilePicture from "../components/ProfilePicture";
import Spinner from 'react-bootstrap/Spinner';

interface ProfileEditModalProps {
	handleEditModal: () => void;
	showEditModal: boolean;
	currentUser: User | undefined;
	user: UserCredential["user"] | undefined;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ showEditModal, handleEditModal, currentUser, user }) => {
	const [imgUrl, setImgUrl] = useState<string>("");
	const [PEMFirstName, setPEMFirstName] = useState("");
	const [PEMLastName, setPEMLastName] = useState("");
	const [PEMEmail, setPEMEmail] = useState("");
	const [PEMPhoneNumber, setPEMPhoneNumber] = useState("");
	const [PEMSchool, setPEMSchool] = useState("");
	const [gradeSelectedOption, setGradeSelectionOption] = useState<SelectOption>();
	const gradesOptions = [
		{value: "Freshmen", label: "Freshmen"},
		{value: "Sophomore", label: "Sophomore"},
		{value: "Junior", label: "Junior"},
		{value: "Senior", label: "Senior"}
	];
	const [PEMMajor, setPEMMajor] = useState("");
	const APTestScoreOptions = [
		{value: 5, label: "5"},
		{value: 4, label: "4"},
		{value: 3, label: "3"},
		{value: 2, label: "2"},
		{value: 1, label: "1"},
		{value: 0, label: "None"}
	];
	const [APResearchScore, setAPResearchScore] = useState<SelectOption>(APTestScoreOptions[5]);
	const [APSeminarScore, setAPSeminarScore] = useState<SelectOption>(APTestScoreOptions[5]);
	const [profilePicUploadFinished, setProfilePicUploadFinished] = useState<boolean>(true);
	
	useEffect(() => {
		setImgUrl(currentUser?.profilePictureURL ?? "");
		setPEMFirstName(currentUser?.firstName ?? "");
		setPEMLastName(currentUser?.lastName ?? "");
		setPEMEmail(user?.email ?? "");
		setPEMPhoneNumber(currentUser?.phoneNumber ?? "");
		setPEMSchool(currentUser?.school ?? "");
		setGradeSelectionOption(gradesOptions[0]);
		setPEMMajor(currentUser?.major ?? "");
		setAPSeminarScore(APTestScoreOptions[Math.abs((currentUser?.apInfo?.APSeminarScore ?? 0) - 5)]);
		setAPResearchScore(APTestScoreOptions[Math.abs((currentUser?.apInfo?.APResearchScore ?? 0) - 5)]);
	}, [user, currentUser]);

	const PEMFirstNameHandler = (e: any) => { setPEMFirstName(e.target.value); }
	const PEMLastNameHandler = (e: any) => { setPEMLastName(e.target.value); }
	const PEMEmailHandler = (e: any) => { setPEMEmail(e.target.value); }
	const PEMPhoneNumberHandler = (e: any) => { setPEMPhoneNumber(e.target.value); }
	const PEMSchoolHandler = (e: any) => { setPEMSchool(e.target.value); }
	const PEMSchoolMajorHandler = (e: any) => { setPEMMajor(e.target.value); } 

	async function saveProfileEditChanges() {
		if (currentUser?.studentDocID != undefined) {
			const currentUserRef = doc(db, "users", currentUser?.studentDocID);
			await updateDoc(currentUserRef, {
				firstName: PEMFirstName,
				lastName: PEMLastName,
				school: PEMSchool,
				grade: gradeSelectedOption?.value,
				major: PEMMajor,
				phoneNumber: PEMPhoneNumber,
				apInfo: {
					APResearchScore: APResearchScore.value,
					APSeminarScore: APSeminarScore.value
				},
				profilePictureURL: imgUrl
			}).then(() => {
				toast.success("Profile Changes Saved!");
			}).catch((error) => {
				toast.error(error.description);
			});
			handleEditModal();
		}
	}

	const selectGradeSelectOptionHandler = (selectedOption: any) => { setGradeSelectionOption(selectedOption); }
	const selectAPSeminarScoreSelectOptionHandler = (selectedOption: any) => { setAPSeminarScore(selectedOption); }
	const selectAPResearchScoreSelectOptionHandler = (selectedOption: any) => { setAPResearchScore(selectedOption); }

	const uploadProfileImageToFirestore = (e: any) => {
		e.preventDefault();
		const file = e.target[0]?.files[0];
		if (!file) {
			toast.error("Can't find File");
			return;
		}
		const storage = getStorage();
		let refName = `profileImages/${currentUser?.studentUID}.jpg`;
		const profileImagesRef = ref(storage, refName);
		const uploadTask = uploadBytesResumable(profileImagesRef, file);

		//delete any existing profile image from the same user
		deleteObject(profileImagesRef).then(() => {
			console.log("File Deleted Successfully");
		});
		uploadTask.on("state_changed", (snapshot) => {
			setProfilePicUploadFinished(false);
		}, (error) => {
			toast.error(error.message);
		},
		() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					setImgUrl(downloadURL);
					toast.success("Profile Picture Upload Success!");
					setProfilePicUploadFinished(true);
				});
			}
		);
	}

	return (
		<Modal show={showEditModal} onHide={handleEditModal} centered scrollable>
		    <Modal.Header closeButton>
		          <Modal.Title>Edit Profile</Modal.Title>
	        </Modal.Header>
	        <Modal.Body>
				<ProfilePicture user={currentUser} imgUrl={imgUrl} />
				{/* Profile Picture Upload Progress Bar  */}
				{
					!profilePicUploadFinished &&
					<div className="flex justify-center">
						<Spinner animation="border" />
					</div>
					
				}
				{/* Profile Image Upload */}
				<form className='form' onSubmit={uploadProfileImageToFirestore}>
					<input type='file' accept=".jpg, .jpeg, .png"/>
					<button type='submit' className="bg-sky-400 hover:bg-sky-500 px-2 py-1 rounded-lg text-white">Upload</button>
				</form>

				<hr/>

	        	 <Form>	
	        	 	<h3 className="text-xl mb-3 text-center">Personal Info</h3>
	        	 	{/*First Name*/}
					<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="firstName">
						<Form.Label className="font-bold">First Name: </Form.Label>
						<div className="flex-grow"></div>
						<Form.Control value={PEMFirstName} onChange={PEMFirstNameHandler} type="text" className="w-1/2"/>
					</Form.Group>
					{/*Last Name*/}
					<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="lastName">
						<Form.Label className="font-bold">Last Name: </Form.Label>
						<div className="flex-grow"></div>
						<Form.Control value={PEMLastName} onChange={PEMLastNameHandler} type="text" className="w-1/2"/>
					</Form.Group>
					{/*Email*/}
					<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="email">
						<Form.Label className="font-bold">Email: </Form.Label>
						<div className="flex-grow"></div>
						<Form.Control value={PEMEmail} onChange={PEMEmailHandler} type="email" className="w-1/2"/>
					</Form.Group>
					{/*Phone Number*/}
					<Form.Group className="mb-3 flex flex-col whitespace-nowrap" controlId="phoneNumber">
						<div className="flex whitespace-nowrap items-center">
							<Form.Label className="font-bold">Phone Number: </Form.Label>
							<div className="flex-grow"></div>
							<Form.Control value={PEMPhoneNumber} onChange={PEMPhoneNumberHandler} type="text" className="w-1/2" aria-describedby="phoneNumberHelpBlock"/>
						</div>
						<Form.Text id="phoneNumberHelpBlock" muted>
					    	Your phone number must be in this format: (XXX) XXX-XXXX
				      	</Form.Text>
					</Form.Group>
					<hr/>
					<h3 className="text-xl mb-3 text-center">School</h3>
					{/* School */}
					<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="School">
						<Form.Label className="font-bold">School Name: </Form.Label>
						<div className="flex-grow"></div>
						<Form.Control value={PEMSchool} onChange={PEMSchoolHandler} type="text" className="w-1/2"/>
					</Form.Group>
					<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="collegeGrade">
						<Form.Label className="font-bold">Current Grade: </Form.Label>
						<div className="flex-grow"></div>
						<Select
						defaultValue={gradeSelectedOption}
						onChange={selectGradeSelectOptionHandler}
						options={gradesOptions}
						placeholder={"Current Grade"}
						/>
					</Form.Group>
					<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="major">
						<Form.Label className="font-bold">Major: </Form.Label>
						<div className="flex-grow"></div>
						<Form.Control value={PEMMajor} onChange={PEMSchoolMajorHandler} type="text" className="w-1/2"/>
					</Form.Group>
					<hr/>
					<h3 className="text-xl mb-3 text-center">AP Capstone</h3>
					<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="apseminarscore">
						<Form.Label className="font-bold">AP Seminar: </Form.Label>
						<div className="flex-grow"></div>
						<Select
						defaultValue={APSeminarScore}
						onChange={selectAPSeminarScoreSelectOptionHandler}
						options={APTestScoreOptions}
						placeholder={3}
						/>
					</Form.Group>
					<Form.Group className="mb-3 flex whitespace-nowrap items-center space-x-3" controlId="apresearchscore">
						<Form.Label className="font-bold">AP Research: </Form.Label>
						<div className="flex-grow"></div>
						<Select
						defaultValue={APResearchScore}
						onChange={selectAPResearchScoreSelectOptionHandler}
						options={APTestScoreOptions}
						placeholder={3}
						/>
					</Form.Group>
			    </Form>
	        </Modal.Body>
	        <Modal.Footer>
	          <Button variant="secondary" className="bg-red-400 hover:bg-red-500" onClick={handleEditModal}>
	            Close
	          </Button>
	          <Button variant="primary" className="bg-green-400 hover:bg-green-500" onClick={saveProfileEditChanges}>
	            Save Changes
	          </Button>
	        </Modal.Footer>
	     </Modal>
	);
}

export default ProfileEditModal;
