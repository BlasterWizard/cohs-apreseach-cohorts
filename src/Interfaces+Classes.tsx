import { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export interface SelectOption {
  value: string | number;
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

export interface UserAPResearchInfo {
  APSeminarScore: number;
  APResearchScore: number;
}

export class User {
  firstName: string;
  lastName: string;
  studentUID: string;
  studentDocID: string;
  graduatingYear: string;
  isAdmin: boolean;
  phoneNumber: string;
  school: string | undefined;
  major: string | undefined;
  grade: string | undefined;
  apInfo?: UserAPResearchInfo;


  constructor(firstName: string, 
              lastName: string, 
              studentUID: string, 
              studentDocID: string, 
              graduatingYear: string, 
              isAdmin: boolean, 
              phoneNumber: string,
              school?: string,
              major?: string,
              grade?: string,
              apInfo?: UserAPResearchInfo
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.studentUID = studentUID;
    this.studentDocID = studentDocID;
    this.graduatingYear = graduatingYear;
    this.isAdmin = isAdmin;
    this.phoneNumber = phoneNumber;
    this.school = school;
    this.major = major;
    this.grade = grade;
    this.apInfo = apInfo;
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
      isAdmin: user.isAdmin,
      phoneNumber: user.phoneNumber,
      school: user.school ?? "",
      major: user.major ?? "",
      grade: user.grade ?? "",
      apInfo: user.apInfo
    }
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    return new User(
      data.firstName, 
      data.lastName, 
      data.studentUID, 
      data.studentDocID, 
      data.graduatingYear, 
      data.isAdmin, 
      data.phoneNumber,
      data.school ?? "",
      data.major ?? "",
      data.grade ?? "",
      data.apInfo
    );
  }
}