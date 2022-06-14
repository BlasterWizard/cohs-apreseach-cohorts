import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase";
import { userConverter, User, CohortGroup } from "../Interfaces+Classes";

const Discover = () => {
  const [users, setUsers] = useState<Array<User>>([]);
  const [cohortGroups, setCohortGroups] = useState<CohortGroup[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    determineCohortGroups();
  }, [users])

  async function fetchUsers() {
    const allUsersQS = await getDocs(collection(db, "users").withConverter(userConverter));
    setUsers([]);
    allUsersQS.forEach((doc) => {
      setUsers((users) => [...users, doc.data()]);
    });
  }


  function determineCohortGroups() {
    let newCohortGroups: CohortGroup[] = [];
    users.forEach((user: User) => {
      //check to see if there's already a cohort group with the same year as {user}
      const indexOfUserInNewCohortGroups = isUserAlreadyInCohortGroups(user, newCohortGroups);
      if (indexOfUserInNewCohortGroups > 0) {
        newCohortGroups[indexOfUserInNewCohortGroups].users.push(user);
      } else {
         //if not create new CohortGroup
        newCohortGroups.push(new CohortGroup(user.graduatingYear, [user]));
      }
    });

    //sort newCohortGroups from greatest year first 
    newCohortGroups.sort(function(a, b) {
      const yearA = parseInt(a.year);
      const yearB = parseInt(b.year);

      if (yearA < yearB) {
        return 1;
      } else if (yearA > yearB) {
        return -1;
      } 
      return 0;
    });
    
    setCohortGroups(newCohortGroups);
  }

  function isUserAlreadyInCohortGroups(user: User, newCohortGroups: CohortGroup[]): number {
    for(var i = 0; i < newCohortGroups.length; i++) {
      if (newCohortGroups[i].year === user.graduatingYear) {
        return i;
      }
    }
    return -1;
  }

  return (
    <>
      <main>
      {
        cohortGroups.map((cohortGroup: CohortGroup, index: number) => {
          return <div key={index} className="m-5">
            <h3 className="font-bold">{cohortGroup.year}</h3>
            <DiscoverUsersView users={cohortGroup.users}/>
          </div>
        })
      }
      </main>
    </>
  );
};

interface DiscoverUsersViewProps {
  users: User[];
}

const DiscoverUsersView: React.FC<DiscoverUsersViewProps> = ({ users }) => {
  const [gridClassname, setGridClassname] = useState<string>("");

  useEffect(() => {
    determineCorrectGridClassname();
  }, []);

  function determineCorrectGridClassname() {
    if (users.length == 1) {
      setGridClassname("grid grid-cols-1 gap-5");
    } else if (users.length == 2) {
      setGridClassname("grid grid-cols-2 gap-5");
    } else {
      setGridClassname("grid grid-cols-3 gap-5");
    }
  }

  return (
    <div className={gridClassname}>
      {
        users.map((user: User, index: number) => {
          return <div className="bg-white/60 p-5 rounded-md flex flex-col text-center" key={index}>
                  <p className="font-bold">{user.firstName} {user.lastName}</p>
                  <p>{user.graduatingYear}</p>
                </div>
        })
      }
    </div>
  );
}

export default Discover;
