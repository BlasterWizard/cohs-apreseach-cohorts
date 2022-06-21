import React, { useEffect, useState } from "react";
import { User, CohortGroup } from "../Interfaces+Classes";
import ProfilePicture, { ProfilePictureSize } from "../components/ProfilePicture";
import { determineCohortGroups } from "../HelperFunctions";
import { Spinner } from "react-bootstrap";
import UnauthorizedAccess from "./Special Pages/UnauthorizedAccess";

interface DiscoverProps {
  users: User[];
}

const Discover: React.FC<DiscoverProps> = ({ users }) => {
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
              <CohortGroupsView cohortGroups={cohortGroups}/>) 
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
            <h3 className="font-bold text-3xl">{cohortGroup.year}</h3>
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
          return <div className="bg-white/60 h-60 w-48 p-3 rounded-md flex flex-col text-center" key={index}>
                    <ProfilePicture user={user} imgUrl={user?.profile?.profilePictureURL ?? ""} size={ProfilePictureSize.Large}/>
                    <p className="font-bold">{user.firstName} {user.lastName}</p>
                    <p>{user.profile?.graduatingYear}</p>
                </div>
        })
      }
    </div>
  );
}

export default Discover;
