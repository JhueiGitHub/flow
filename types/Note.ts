// /root/app/types/Note.ts

export interface Note {
  id: string;
  title: string;
  content: string;
  parentId: string | null;
  children: Note[];
  profileId: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  isFolder: boolean;
}
