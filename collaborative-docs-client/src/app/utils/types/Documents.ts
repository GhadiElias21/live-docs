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
  owner: DocumentUser;
  sharedWith: Array<{
    user: DocumentUser;
    role: "viewer" | "editor";
    sharedAt?: Date;
  }>;
  createdAt: string;
  updatedAt: string;
}
export interface DocumentsGridProps {
  documents: Document[];
  isCreating?: boolean;
  onCreate?: () => void;
  currentUserId: string;
}
export interface DocumentCardProps {
  _id: string;
  title: string;
  content: string;
  updatedAt?: string;

  owner?: DocumentUser | string;
  currentUserId: string;
}
