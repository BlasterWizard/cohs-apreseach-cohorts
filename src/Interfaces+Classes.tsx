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
  APResearchPaperTitle: string;
  APResearchPaperURL: string;
}

export interface UserApprovalStatus {
  isApproved: boolean;
  deniedReason?: string;
}

export interface ProfileInfo {
  graduatingYear: string;
  phoneNumber: string | undefined;
  profilePictureURL: string | undefined;
  school: string | undefined;
  major: string | undefined;
  grade: string | undefined;
  apInfo?: UserAPResearchInfo;
}

export class User {
  firstName: string;
  lastName: string;
  studentUID: string;
  studentDocID: string;
  isAdmin: boolean;
  profile?: ProfileInfo;
  approvalStatus: UserApprovalStatus;


  constructor(firstName: string, 
              lastName: string, 
              studentUID: string, 
              studentDocID: string, 
              isAdmin: boolean, 
              profile: ProfileInfo,
              approvalStatus: UserApprovalStatus
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.studentUID = studentUID;
    this.studentDocID = studentDocID;
    this.isAdmin = isAdmin;
    this.profile = profile;
    this.approvalStatus = approvalStatus;
  }
}

export const userConverter = {
  toFirestore: (user: User) => {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      studentUID: user.studentUID,
      studentDocID: user.studentDocID,
      isAdmin: user.isAdmin,
      profile: user.profile,
      approvalStatus: user.approvalStatus
    }
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    return new User(
      data.firstName, 
      data.lastName, 
      data.studentUID, 
      data.studentDocID, 
      data.isAdmin, 
      data.profile,
      data.approvalStatus
    );
  }
}