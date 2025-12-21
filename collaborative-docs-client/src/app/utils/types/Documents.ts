export interface DocumentUser {
  _id: string;
  username: string;
  email: string;
}

export interface SharedWithUser {
  user: DocumentUser | string;
  role: "viewer" | "editor" | "commenter";
  sharedAt?: Date;
}

export interface Document {
  _id: string;
  title: string;
  content: string;
  owner: DocumentUser; // Always populated, not string
  sharedWith: Array<{
    user: DocumentUser; // Always populated
    role: "viewer" | "editor" | "commenter";
    sharedAt?: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
