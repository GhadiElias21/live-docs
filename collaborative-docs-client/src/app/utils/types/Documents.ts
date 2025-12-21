export interface DocumentUser {
  _id: string;
  username: string;
  email: string;
}

export interface SharedWithUser {
  _id: string; // required
  user: User;
  role: "viewer" | "editor";
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

interface User {
  _id: string;
  username: string;
  email: string;
}

interface SharedWith {
  _id: string;
  role: "viewer" | "editor";
  user: User;
}

export interface DocumentHeaderProps {
  title?: string;
  setTitle?: (v: string) => void;
  isSaving?: boolean;
  lastSaved?: string;
  onSave?: () => void;
  backLink?: string;
  backLabel?: string;
  owner?: User;
  sharedWith?: SharedWith[];
  loggedInUser?: User;
  isOwner?: boolean;
}
