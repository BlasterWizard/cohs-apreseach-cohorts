import React, { useEffect, useState } from "react";
import { CohortGroup, User, ProfileUser } from "../../Interfaces+Classes";
import { determineCohortGroups } from "../../HelperFunctions";
import ProfilePicture, { ProfilePictureSize } from "../../components/ProfilePicture";
import { Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import db from "../../firebase";
import { updateDoc, doc } from "firebase/firestore";
import Spinner from 'react-bootstrap/Spinner';
import UnauthorizedAccess from "../Special Pages/UnauthorizedAccess";
import { Link, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import PaginationLinkButton from "../../components/PaginationLinkButton";

interface AdminDashboardProps {
    users: User[];
}

export const AdminDashboard = () => {
    return (
        <main>
            <div className="flex w-full">
                <div className="flex-grow"></div>
                <div className="flex w-fit space-x-3 m-2 bg-white/30 rounded-lg p-2">
                    {/* Dashboard Button  */}
                    <PaginationLinkButton link={"/admin/dashboard"} destinationName={"Dashboard"} />
                    {/* Announcements Button */}
                    <PaginationLinkButton link={"/admin/adminAnnouncements"} destinationName={"Announcements"} />
                    {/* Settings Button  */}
                    <PaginationLinkButton link={"/admin/adminSettings"} destinationName={"Settings"} />
                </div>
            </div>
            

            <Outlet />
        </main>
    );
}

export const AdminDashboardView: React.FC<AdminDashboardProps> = ({ users }) => {
    const [cohortGroups, setCohortGroups] = useState<CohortGroup[]>([]);
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);

    useEffect(() => {
        findPendingUsers();
        setCohortGroups(determineCohortGroups(users));
    }, [users]);

    const findPendingUsers = () => {
        let pendingUsers: User[] = [];
        users.forEach((user: User) => {
            if (!user.approvalStatus.isApproved) {
                pendingUsers.push(user);
            }
        });
        setPendingUsers(pendingUsers);
    }
    
    return (
        <>
            {
              (JSON.parse(localStorage.getItem("isLoggedIn")!) && JSON.parse(localStorage.getItem("isApproved")!)) 
                ? 
              (cohortGroups.length === 0 && pendingUsers.length === 0 ?
                <Spinner animation="border" /> :
                <ApprovedAdminDashboardView pendingUsers={pendingUsers} cohortGroups={cohortGroups} />) 
                :
                <UnauthorizedAccess />
            }
        </>
    );
}

interface ApprovedAdminDashboardViewProps {
    pendingUsers: User[];
    cohortGroups: CohortGroup[];
}

const ApprovedAdminDashboardView: React.FC<ApprovedAdminDashboardViewProps> = ({ pendingUsers, cohortGroups }) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleIsEditing = () => setIsEditing(!isEditing);

    return (
        <>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            {
                pendingUsers.length > 0 &&
                <div className="my-5 bg-white/60 p-3 rounded-lg w-full max-w-3xl">
                    <h1 className="text-2xl font-bold my-2">Pending Requests</h1>
                    <div className="flex justify-center">
                        {
                            pendingUsers.map((user: User, index: number) => {
                                return <HorizontalPendingUserView user={user} key={index} />
                            })
                        }
                    </div>
                </div>
            }
           
           
            {/* Manage Cohorts  */}
            <div className="my-5 bg-white/60 p-3 rounded-lg w-full max-w-3xl">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold my-2">Manage Cohorts</h1>
                    <div className="flex-grow"></div>
                    <button className="font-bold text-white bg-violet-300 hover:bg-violet-400 px-2 h-7 rounded-lg" onClick={toggleIsEditing}>
                        {
                            !isEditing ? <p>Edit</p> : <p>Done</p>
                        }
                    </button>
                </div>

                {
                    cohortGroups.map((cohortGroup: CohortGroup, index: number) => {
                    return <div key={index} className=" w-full space-y-5">
                        <h3 className="font-bold text-3xl text-white">{cohortGroup.year}</h3>
                        {
                            <div className="flex flex-col items-center space-y-2">
                                {
                                    cohortGroup.users.map((user: User, index: number) => {
                                        return <HorizontalDiscoverUserView user={user} key={index} isEditing={isEditing}/>
                                    })
                                }
                            </div>
                        }
                        {
                            //Cohort Horizontal Divider 
                            (index === cohortGroups.length) &&  <hr/>
                        }
                    </div>
                    })
                }
            </div>
        </>
    );
}

// HorizontalDiscoverUserView 
interface HorizontalDiscoverUserViewProps {
    user: User;
    isEditing: boolean;
}
  
const HorizontalDiscoverUserView: React.FC<HorizontalDiscoverUserViewProps> = ({ user, isEditing }) => {
    return (
        <div className="bg-white/60 w-3/4 max-w-lg p-2 rounded-md flex text-center items-center">
            <div className="space-x-3 flex items-center">
                <ProfilePicture user={new ProfileUser(user.firstName, user.lastName, user.profile?.profilePictureURL)} size={ProfilePictureSize.Small}/>
                <p className="font-bold">{user.firstName} {user.lastName}</p>
            </div> 
            <div className="flex-grow"></div>
            {
                isEditing && 
                <div className="flex">
                    <button className="bg-red-300 hover:bg-red-400 w-8 h-8 rounded-full"><i className="fa-solid fa-xmark text-white"></i></button>
                </div>
            }
        </div>
    );
}

//HorizontalPendingUserViewProps
interface HorizontalPendingUserViewProps {
    user: User;
}
  
const HorizontalPendingUserView: React.FC<HorizontalPendingUserViewProps> = ({ user }) => {
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<boolean>(false);

    const handleShowDeleteConfirmationModal = () => setShowDeleteConfirmationModal(!showDeleteConfirmationModal);

    async function acceptPendingRequest() {
        await updateDoc(doc(db, "users", user.studentDocID), {
            isApproved: true
        });
    }

    return (
        <div className="space-x-3 bg-white/60 w-3/4 max-w-lg min-x-md p-2 rounded-md flex text-center items-center">
            <ProfilePicture user={new ProfileUser(user.firstName, user.lastName, user.profile?.profilePictureURL)} size={ProfilePictureSize.Small}/>
            <div className="flex flex-col">
                <p className="font-bold whitespace-nowrap text-left">{user.firstName} {user.lastName}</p>
                <p className='text-slate-400 text-sm text-left'>Graduated in {user.profile?.graduatingYear}</p>
            </div>
            <div className="flex-grow"></div>
            <div className="space-x-5 px-2 whitespace-nowrap">
                {
                    user.approvalStatus.deniedReason === undefined ?
                    <>
                        <button className="bg-emerald-300 hover:bg-emerald-400 w-8 h-8 rounded-full" onClick={acceptPendingRequest}><i className="fa-solid fa-check text-white"></i></button>
                        <button className="bg-red-300 hover:bg-red-400 w-8 h-8 rounded-full" onClick={handleShowDeleteConfirmationModal}><i className="fa-solid fa-xmark text-white"></i></button>
                    </> :
                    <p className="bg-red-400 px-2 py-0.5 rounded-full text-white font-bold">Rejected</p>
                }
            </div>
            <DeletePendingUserModal showModal={showDeleteConfirmationModal} handleModal={handleShowDeleteConfirmationModal} user={user}/>
        </div>
    );
}

interface DeletePendingUserModalProps {
    showModal: boolean;
    handleModal: () => void;
    user: User;
}

const DeletePendingUserModal: React.FC<DeletePendingUserModalProps> = ({ showModal, handleModal, user }) => {
    const [rejectionReasonText, setRejectionReasonText] = useState<string>("");

    const handleRejectionReasonText = (e: any) => { setRejectionReasonText(e.target.value) };

    async function confirmRejectPendingRequest() {
        await updateDoc(doc(db, "users", user.studentDocID), {
            approvalStatus: {
                deniedReason: rejectionReasonText
            }
        }).then(() => {
            toast.success("Pending request successfully rejected");
            handleModal();
        }).catch((error) => {
            toast.error(error.message);
        });
    }

    return (
        <Modal show={showModal} onHide={handleModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Delete Pending User</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <h1 className="font-bold">Are you sure you want to delete this request?</h1>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>If so, please state reason for rejection below: </Form.Label>
                    <Form.Control value={rejectionReasonText} onChange={handleRejectionReasonText} as="textarea" rows={3} />
                </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" className="bg-red-400 hover:bg-red-500" onClick={handleModal}>Cancel</Button>
                <Button variant="primary" className="bg-green-400 hover:bg-green-500" onClick={confirmRejectPendingRequest}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    );
}
