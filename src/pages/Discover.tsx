import React, { useEffect, useState } from "react";
import { User, CohortGroup, ProfileUser, Announcement } from "../Interfaces+Classes";
import ProfilePicture, { ProfilePictureSize } from "../components/ProfilePicture";
import { determineCohortGroups } from "../HelperFunctions";
import { Spinner } from "react-bootstrap";
import UnauthorizedAccess from "./Special Pages/UnauthorizedAccess";

interface DiscoverProps {
  users: User[];
  announcements: Announcement[];
}

const Discover: React.FC<DiscoverProps> = ({ users, announcements }) => {
  const [cohortGroups, setCohortGroups] = useState<CohortGroup[]>([]);

  useEffect(() => {
    setCohortGroups(determineCohortGroups(users));
  }, [users]);

  return (
    <>
      <main>
        {
            (JSON.parse(localStorage.getItem("isLoggedIn")!) && JSON.parse(localStorage.getItem("isApproved")!)) 
              ? 
            (cohortGroups.length === 0  ?
              <Spinner animation="border" /> :
              <>
                <AnnouncementsListView announcements={announcements} />
                <CohortGroupsView cohortGroups={cohortGroups}/> 
              </>)

              :
              <UnauthorizedAccess/>
        }
      </main>
    </>
  );
};

interface CohortGroupsViewProps {
  cohortGroups: CohortGroup[];
}

const CohortGroupsView: React.FC<CohortGroupsViewProps> = ({ cohortGroups }) => {
  return (
    <>
      {
        cohortGroups.map((cohortGroup: CohortGroup, index: number) => {
          return <div key={index} className="m-5 w-full space-y-5">
            <h3 className="font-bold text-3xl text-white">{cohortGroup.year}</h3>
            <DiscoverUsersView users={cohortGroup.users}/>
            {
              (index === cohortGroups.length) &&  <hr/>
            }
          </div>
        })
      }
    </>
  );
}

interface DiscoverUsersViewProps {
  users: User[];
}

const DiscoverUsersView: React.FC<DiscoverUsersViewProps> = ({ users }) => {
  const [gridClassname, setGridClassname] = useState<string>("");

  useEffect(() => {
    determineCorrectGridClassname();
  }, [users]);

  function determineCorrectGridClassname() {
    if (users.length == 1) {
      setGridClassname("grid grid-cols-1 gap-5 w-fit");
    } else if (users.length == 2) {
      setGridClassname("grid grid-cols-2 gap-5 w-fit");
    } else {
      setGridClassname("grid grid-cols-3 gap-5 w-fit");
    }
  }

  return (
    <div className={gridClassname}>
      {
        users.map((user: User, index: number) => {
          return <div className="bg-white/60 h-fit w-48 p-3 rounded-md flex flex-col text-center" key={index}>
                    <ProfilePicture user={new ProfileUser(user.firstName, user.lastName, user.profile?.profilePictureURL)} size={ProfilePictureSize.Large}/>
                    <p className="font-bold mt-3">{user.firstName} {user.lastName}</p>
                    {/* <p>{user.profile?.graduatingYear}</p> */}
                </div>
        })
      }
    </div>
  );
}

interface AnnouncementsListViewProps {
  announcements: Announcement[];
}

const AnnouncementsListView: React.FC<AnnouncementsListViewProps> = ({ announcements }) => {
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const sessionStorage = window.sessionStorage;

  useEffect(() => {
    setShowAnnouncements(sessionStorage.getItem("showAnnouncements") === "true" ? true : false);
  }, []);

  const toggleShowAnnouncements = () => {
    window.sessionStorage.setItem("showAnnouncements", !showAnnouncements ? "true": "false");
    setShowAnnouncements(!showAnnouncements);
  }
  return (
    <>
      {
        announcements.length > 0 &&
        <>
          <div className="flex items-center space-x-5">
            <h3 className="font-bold text-3xl text-white mb-2">Announcements</h3>
            <div className="flex-grow"></div>
            <button onClick={toggleShowAnnouncements}>
              {
                !showAnnouncements ?
                <i className="fa-solid fa-chevron-right text-white"></i> :
                <i className="fa-solid fa-chevron-down text-white"></i>
              }
            </button>
          </div>
          <div className="flex flex-col w-full items-center space-y-2">
            {
              showAnnouncements &&
              announcements.map((announcement: Announcement, index: number) => {
                return <AnnouncementView announcement={announcement} key={index} />;
              })
            }
          </div>
        </>
      }
    </>
  );
}

interface AnnouncementViewProps {
  announcement: Announcement;
}

const AnnouncementView: React.FC<AnnouncementViewProps> = ({ announcement }) => {
  return (
    <div className="flex flex-col bg-white/60 rounded-lg p-3 w-3/4 max-w-lg">
        <div className="flex items-center text-center mb-2">
            <div className="flex items-center space-x-2 w-full">
                <ProfilePicture user={new ProfileUser(announcement.author.firstName, announcement.author.lastName, announcement.author.profileURL)} size={ProfilePictureSize.Small}/>  
                <p className="font-bold text-lg text-slate-600">{announcement.author.firstName} {announcement.author.lastName}</p> 
                <div className="flex-grow"></div>
                <p className="text-sm text-slate-500">{announcement.date.toLocaleDateString("en-US")}</p>
            </div>
        </div>
        <p className="font-bold">{announcement.title}</p>
        <p>{announcement.message}</p>
    </div>
  );
}

export default Discover;


