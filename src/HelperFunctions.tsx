import { getDoc, doc } from "firebase/firestore";
import db from "./firebase";
import { CohortGroup, SelectOption, User } from "./Interfaces+Classes";

export async function getAvailableGraduatingYears() {
    let options: SelectOption[] = [];
    const availableGraduatingYearsSnap = await getDoc(
      doc(db, "settings", "availableGraduatingYears")
    );
    if (availableGraduatingYearsSnap.exists()) {
      availableGraduatingYearsSnap.data().years.forEach((year: string) => {
        options.push({ value: year, label: year });
      });
    } else {
      console.log("Can't Find Doc");
    }
    return options;
  }

  export function determineCohortGroups(users: User[]): CohortGroup[] {
    let newCohortGroups: CohortGroup[] = [];
    users.forEach((user: User) => {
      if (user.approvalStatus.isApproved) {
        //check to see if there's already a cohort group with the same year as {user}
        const indexOfUserInNewCohortGroups = isUserAlreadyInCohortGroups(user, newCohortGroups);
        if (indexOfUserInNewCohortGroups >= 0) {
          newCohortGroups[indexOfUserInNewCohortGroups].users.push(user);
        } else {
            //if not create new CohortGroup
          newCohortGroups.push(new CohortGroup(user.profile?.graduatingYear ?? "N/A", [user]));
        }
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
    return newCohortGroups;
  }

  function isUserAlreadyInCohortGroups(user: User, newCohortGroups: CohortGroup[]): number {
    for(var i = 0; i < newCohortGroups.length; i++) {
      if (newCohortGroups[i].year === user.profile?.graduatingYear) {
        return i;
      }
    }
    return -1;
  }