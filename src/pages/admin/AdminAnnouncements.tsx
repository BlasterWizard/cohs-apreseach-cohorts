import { addDoc, collection, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Form, Modal, Spinner, Button } from "react-bootstrap";
import db from "../../firebase";
import { Announcement, announcementConverter, User, ProfileUser, NodeDisplayStatus } from "../../Interfaces+Classes";
import UnauthorizedAccess from "../Special Pages/UnauthorizedAccess";
import toast from "react-hot-toast";
import ProfilePicture, { ProfilePictureSize } from "../../components/ProfilePicture";

interface AdminAnnouncementsProps {
    announcements: Announcement[];
    currentUser: User | undefined;
}

const AdminAnnouncements: React.FC<AdminAnnouncementsProps> = ({ announcements, currentUser }) => {
    return (
        <>
            {
                (JSON.parse(localStorage.getItem("isLoggedIn")!) && JSON.parse(localStorage.getItem("isApproved")!)) 
                ? 
                (announcements.length === undefined ?
                <Spinner animation="border" /> :
                <AnnouncementsListView announcements={announcements} currentUser={currentUser} />) 
                :
                <UnauthorizedAccess />
            }
        </>
    );
}

const AnnouncementsListView: React.FC<AdminAnnouncementsProps> = ({ announcements, currentUser }) => {
    const [addNewAnnouncementMode, setAddNewAnnouncementMode] = useState(false);
    const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
    const [newAnnouncementMessage, setNewAnnouncementMessage] = useState("");

    useEffect(() => {
        setNewAnnouncementTitle("");
        setNewAnnouncementMessage("");
    }, []);

    const toggleAddNewAnnouncementMode = () => setAddNewAnnouncementMode(!addNewAnnouncementMode);

    async function postNewAnnouncement() {
        const newAnnouncementRef = doc(collection(db, "announcements").withConverter(announcementConverter));
        await setDoc(newAnnouncementRef, new Announcement(
            newAnnouncementTitle, 
            newAnnouncementMessage,
            {
                firstName: currentUser?.firstName ?? "",
                lastName: currentUser?.lastName ?? "",
                profileURL: currentUser?.profile?.profilePictureURL ?? ""
               
            }, 
            new Date(),
            newAnnouncementRef.id
        )).then(() => {
            toast.success("Announcement Posted!")
        }).catch((error) => {   
            toast.error(error.message);
        });
        toggleAddNewAnnouncementMode();
    }

    const newAnnouncementTitleHandler = (e: any) => setNewAnnouncementTitle(e.target.value);
    const newAnnouncementMessageHandler = (e: any) => setNewAnnouncementMessage(e.target.value);

    return (
        <>
            <h1 className="text-3xl font-bold">Manage Announcements</h1>
            {
                addNewAnnouncementMode &&
                    <div className="flex flex-col m-3 bg-white/60 p-3 rounded-lg w-1/2">
                    {/* Header  */}
                    <div className="flex items-center mb-3">
                        <h2 className="font-bold">New Announcement</h2>
                        <div className="flex-grow"></div>
                        <button className="bg-white/60 rounded-full px-2 py-0.3 text-slate-400" onClick={toggleAddNewAnnouncementMode}><i className="fa-solid fa-xmark"></i></button>
                    </div>

                    <Form.Group className="mb-3" >
                        <Form.Label className="font-bold">Title:</Form.Label>
                        <Form.Control value={newAnnouncementTitle} onChange={newAnnouncementTitleHandler} type="text" className="bg-white/70" />
                    </Form.Group>
                
                    <Form.Group className="mb-3">
                        <Form.Label className="font-bold">Message:</Form.Label>
                        <Form.Control value={newAnnouncementMessage} onChange={newAnnouncementMessageHandler} as="textarea" rows={3} className="bg-white/70"/>
                    </Form.Group>
        
                    {/* Footer  */}
                    <div className="flex">
                        <div className="flex-grow"></div>
                        <button className=" flex items-center space-x-2 bg-green-400 hover:bg-green-500 rounded-lg px-2 py-1 text-white" onClick={postNewAnnouncement}>
                            <p>Send</p>
                            <i className="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            }
            {
                !addNewAnnouncementMode && 
                <button className="flex items-center space-x-3 bg-emerald-400 rounded-lg p-2 my-4 text-white font-bold" 
                onClick={toggleAddNewAnnouncementMode}>
                    <i className="fa-solid fa-plus"></i>
                    <p>Post New Announcement</p>
                </button>
            }
            {
                announcements.map((announcement: Announcement, index: number) => {
                    return <AnnouncementView announcement={announcement} key={index} displayStatus={NodeDisplayStatus.Display}/>
                })
            }
        </>
    );
}

interface AnnouncementViewProps {
    announcement: Announcement;
    displayStatus: NodeDisplayStatus;
}

const AnnouncementView: React.FC<AnnouncementViewProps> = ({ announcement, displayStatus }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [bgColorClassName, setBgColorClassName] = useState("");

    useEffect(() => {
        switch (displayStatus) {
            case NodeDisplayStatus.Display:
                setBgColorClassName("flex flex-col bg-white/60 rounded-lg p-3 w-3/4 max-w-lg");
                break;
            case NodeDisplayStatus.Edit:
                setBgColorClassName("flex flex-col bg-blue-200/70 rounded-lg p-3 w-3/4 max-w-lg");
                break;
        }
    }, []);

    const toggleShowEditModal = () => setShowEditModal(!showEditModal);

    return (
        <div className={bgColorClassName}>
            <div className="flex items-center text-center mb-2">
                <div className="flex items-center space-x-2 w-full">
                    <ProfilePicture user={new ProfileUser(announcement.author.firstName, announcement.author.lastName, announcement.author.profileURL)} size={ProfilePictureSize.Small}/>  
                    <p className="font-bold text-lg text-slate-600">{announcement.author.firstName} {announcement.author.lastName}</p> 
                    <div className="flex-grow"></div>
                    <p className="text-sm text-slate-500">{announcement.date.toLocaleDateString("en-US")}</p>
                    {/* Edit/More Button  */}
                    {
                        displayStatus === NodeDisplayStatus.Display &&   
                        <button onClick={toggleShowEditModal}><i className="fa-solid fa-ellipsis text-slate-500"></i></button>
                    }
                </div>
            </div>
            <p className="font-bold">{announcement.title}</p>
            <p>{announcement.message}</p>
            <AnnouncementEditModal showModal={showEditModal} hideModal={toggleShowEditModal} announcement={announcement}/>
        </div>
    );
}

interface AnnouncementEditModalProps {
    showModal: boolean;
    hideModal: () => void;
    announcement: Announcement;
}

const AnnouncementEditModal: React.FC<AnnouncementEditModalProps> = ({ showModal, hideModal, announcement }) => {
    const [changedAnnouncementTitle, setChangedAnnouncementTitle] = useState("");
    const [changedAnnouncementMessage, setChangedAnnouncementMessage] = useState("");
    

    useEffect(() => {
        setChangedAnnouncementTitle(announcement.title);
        setChangedAnnouncementMessage(announcement.message);
    }, []);

    const changedAnnouncementTitleHandler = (e: any) => setChangedAnnouncementTitle(e.target.value);
    const changedAnnouncementMessageHandler = (e: any) => setChangedAnnouncementMessage(e.target.value);

    async function updateAnnouncement() {
        hideModal();
        await updateDoc(doc(db, "announcements", announcement.id), {
            title: changedAnnouncementTitle,
            message: changedAnnouncementMessage
        }).then(() => {
            toast.success("Announcement Successfully Updated!");
            hideModal();
        }).catch((error) => {
            toast.error(error.message);
        });
    }

    async function deleteAnnouncement() {
        await deleteDoc(doc(db, "announcements", announcement.id)).then(() => {
            toast.success("Announcement Successfully Deleted!");
        }).catch((error) => {
            toast.error(error.message);
        });
    }

    return (
        <Modal
        size="lg"
        show={showModal}
      >
        <Modal.Header className="flex items-center">
          <Modal.Title>Edit Announcement</Modal.Title>
          <button className="bg-gray-300/60 rounded-full px-2 py-0.3 text-slate-400" onClick={hideModal}><i className="fa-solid fa-xmark"></i></button>
        </Modal.Header>
        <Modal.Body className="flex flex-col items-center space-y-3">
            <AnnouncementView announcement={announcement} displayStatus={NodeDisplayStatus.Edit}/>
            <i className="fa-solid fa-arrow-down"></i>
            <div className="flex flex-col bg-blue-200/70 rounded-lg p-3 w-3/4 max-w-lg">
                <div className="flex items-center text-center mb-2">
                    <div className="flex items-center space-x-2 w-full">
                        <ProfilePicture user={new ProfileUser(announcement.author.firstName, announcement.author.lastName, announcement.author.profileURL)} size={ProfilePictureSize.Small}/>  
                        <p className="font-bold text-lg text-slate-600">{announcement.author.firstName} {announcement.author.lastName}</p> 
                        <div className="flex-grow"></div>
                        <p className="text-sm text-slate-500">{new Date().toLocaleDateString("en-US")}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    {/* New Announcement Title Text Field  */}
                    <Form.Group className="flex whitespace-nowrap items-center" controlId="firstName">
                        <Form.Control value={changedAnnouncementTitle} onChange={changedAnnouncementTitleHandler} type="text" className="h-1/2 font-bold bg-white/70"/>
                    </Form.Group>
                    {/* New Announcement Message Text Field  */}
                    <Form.Group className="flex whitespace-nowrap items-center" controlId="firstName">
                        <Form.Control value={changedAnnouncementMessage} onChange={changedAnnouncementMessageHandler} as="textarea" rows={2} type="text" className="bg-white/70"/>
                    </Form.Group>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" className="bg-red-400 hover:bg-red-500 flex space-x-2 items-center" onClick={deleteAnnouncement}>
                <i className="fa-solid fa-trash-can"></i>
                <p>Delete</p>
            </Button>
            <div className="flex-grow"></div>
            <Button variant="primary" className="bg-green-400 hover:bg-green-500 font-bold" onClick={updateAnnouncement}>
            Save Changes
            </Button>
	     </Modal.Footer>
      </Modal>
    );
}

export default AdminAnnouncements;