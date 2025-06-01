export type User = {
  uid: string;
  fullName: string;
  username: string;
  friends: string[];
};

export type UserPublic = {
  uid: string;
  fullName: string;
  username: string;
};

// types/userTypes.ts
export type UserProfile = {
  uid: string;
  email: string;
  fullName: string;
  username: string;
  createdAt?: number; // eller Timestamp
  friends?: string[];
};