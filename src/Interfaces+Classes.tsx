import { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export interface SelectOption {
  value: string;
  label: string;
}

export class CohortGroup {
  year: string;
  users: Array<User>;

  constructor(year: string, users: Array<User>) {
    this.year = year;
    this.users = users;
  }
}

export class User {
  firstName: string;
  lastName: string;
  studentUID: string;
  studentDocID: string;
  graduatingYear: string;
  isAdmin: boolean;


  constructor(firstName: string, lastName: string, studentUID: string, studentDocID: string, graduatingYear: string, isAdmin: boolean) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.studentUID = studentUID;
    this.studentDocID = studentDocID;
    this.graduatingYear = graduatingYear;
    this.isAdmin = isAdmin;
  }
}

export const userConverter = {
  toFirestore: (user: User) => {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      studentUID: user.studentUID,
      studentDocID: user.studentDocID,
      graduatingYear: user.graduatingYear,
      isAdmin: user.isAdmin
    }
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    return new User(data.firstName, data.lastName, data.studentUID, data.studentDocID, data.graduatingYear, data.isAdmin);
  }
}