import { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { validateLocaleAndSetLanguage } from "typescript";

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
  visibleAttributes: string[];
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

export class ProfileUser {
  firstName: string;
  lastName: string;
  profileURL: string | undefined;

  constructor(firstName: string, lastName: string, profileURL: string | undefined) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.profileURL = profileURL;
  }
}

//Announcements 
export class Announcement {
  title: string;
  message: string;
  author: ProfileUser;
  date: Date;
  id: string;

  constructor(title: string, message: string, author: ProfileUser, date: Date, id: string) {
    this.title = title;
    this.message = message;
    this.author = author;
    this.date = date;
    this.id = id;
  }
}

export const announcementConverter = {
  toFirestore: (announcement: Announcement) => {
    return {
      title: announcement.title,
      message: announcement.message,
      author: announcement.author,
      date: announcement.date,
      id: announcement.id
    }
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    return new Announcement(
      data.title,
      data.message,
      data.author,
      data.date.toDate(),
      data.id
    );
  }
}

export enum NodeDisplayStatus {
  Display,
  Edit
}

export enum ProfileAttributeType {
  Email,
  PhoneNumber,
  College,
  CurrentGrade,
  Major,
  APSeminarTestScore,
  APResearchTestScore,
  APSeminarPaperTitle,
  APSeminarPaperURL,
  APResearchPaperTitle,
  APResearchPaperURL
}

// namespace ProfileAttributeType {
//   export function toString(type: ProfileAttributeType): string {
//     return 
//   }
// }