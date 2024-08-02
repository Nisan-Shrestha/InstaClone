export interface IComment {
  id: string;
  username: string;
  pfpUrl: string | null;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  parentId?: string;
  hasChild?: boolean;
}
