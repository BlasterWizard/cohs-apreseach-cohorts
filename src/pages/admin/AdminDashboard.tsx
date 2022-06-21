import React, { useEffect, useState } from "react";
import { CohortGroup, User } from "../../Interfaces+Classes";
import { determineCohortGroups } from "../../HelperFunctions";
import ProfilePicture, { ProfilePictureSize } from "../../components/ProfilePicture";
import { Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import db from "../../firebase";
import { updateDoc, doc } from "firebase/firestore";
import Spinner from 'react-bootstrap/Spinner';
import UnauthorizedAccess from "../Special Pages/UnauthorizedAccess";

interface AdminDashboardProps {
    users: User[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users }) => {
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
        <main>
            {
              (JSON.parse(localStorage.getItem("isLoggedIn")!) && JSON.parse(localStorage.getItem("isApproved")!)) 
                ? 
              (cohortGroups.length === 0 && pendingUsers.length === 0 ?
                <Spinner animation="border" /> :
                <ApprovedAdminDashboardView pendingUsers={pendingUsers} cohortGroups={cohortGroups} />) 
                :
                <UnauthorizedAccess />
            }
        </main>
    );
}

interface ApprovedAdminDashboardViewProps {
    pendingUsers: User[];
    cohortGroups: CohortGroup[];
}

const ApprovedAdminDashboardView: React.FC<ApprovedAdminDashboardViewProps> = ({ pendingUsers, cohortGroups }) => {
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
                <h1 className="text-2xl font-bold my-2">Manage Cohorts</h1>
                {
                    cohortGroups.map((cohortGroup: CohortGroup, index: number) => {
                    return <div key={index} className=" w-full space-y-5">
                        <h3 className="font-bold text-3xl text-white">{cohortGroup.year}</h3>
                        {
                            <div className="flex justify-center">
                                {
                                    cohortGroup.users.map((user: User, index: number) => {
                                        return <HorizontalDiscoverUserView user={user} key={index} />
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
}
  
const HorizontalDiscoverUserView: React.FC<HorizontalDiscoverUserViewProps> = ({ user }) => {
    return (
        <div className="space-x-5 bg-white/60 w-3/4 max-w-lg p-2 rounded-md flex text-center items-center">
            <ProfilePicture user={user} imgUrl={user?.profile?.profilePictureURL ?? ""} size={ProfilePictureSize.Small}/>
            <p className="font-bold">{user.firstName} {user.lastName}</p>
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
        <div className="space-x-3 bg-white/60 w-3/4 max-w-lg  min-x-md p-2 rounded-md flex text-center items-center">
            <ProfilePicture user={user} imgUrl={user?.profile?.profilePictureURL ?? ""} size={ProfilePictureSize.Small}/>
            <div className="flex flex-col">
                <p className="font-bold whitespace-nowrap text-left">{user.firstName} {user.lastName}</p>
                <p className='text-slate-400 text-sm text-left'>Graduated in {user.profile?.graduatingYear}</p>
            </div>
            <div className="flex-grow"></div>
            <div className="space-x-5 px-2 whitespace-nowrap">
                <button className="bg-emerald-300 hover:bg-emerald-400 w-8 h-8 rounded-full" onClick={acceptPendingRequest}><i className="fa-solid fa-check text-white"></i></button>
                <button className="bg-red-300 hover:bg-red-400 w-8 h-8 rounded-full" onClick={handleShowDeleteConfirmationModal}><i className="fa-solid fa-xmark text-white"></i></button>
            </div>
            <DeletePendingUserModal showModal={showDeleteConfirmationModal} handleModal={handleShowDeleteConfirmationModal} />
        </div>
    );
}

interface DeletePendingUserModalProps {
    showModal: boolean;
    handleModal: () => void;
}

const DeletePendingUserModal: React.FC<DeletePendingUserModalProps> = ({ showModal, handleModal }) => {
    const [rejectionReasonText, setRejectionReasonText] = useState<string>("");

    const handleRejectionReasonText = (e: any) => { setRejectionReasonText(e.target.value) };

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
                <Button variant="primary" className="bg-green-400 hover:bg-green-500">Confirm</Button>
            </Modal.Footer>
        </Modal>
    );
}


export default AdminDashboard;