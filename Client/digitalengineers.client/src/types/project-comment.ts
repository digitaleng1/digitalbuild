export interface FileReference {
  id: number;
  projectFileId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  contentType: string;
}

export interface ProjectCommentViewModel {
  id: number;
  projectId: number;
  userId: string;
  userName: string;
  userProfilePictureUrl?: string;
  content: string;
  parentCommentId?: number;
  createdAt: string;
  updatedAt?: string;
  isEdited: boolean;
  repliesCount: number;
  replies?: ProjectCommentViewModel[];
  mentionedUserIds: string[];
  mentionedUserNames: string[];
  fileReferences: FileReference[];
}

export interface CreateProjectCommentRequest {
  content: string;
  parentCommentId?: number;
  mentionedUserIds?: string[];
  projectFileIds?: number[];
}

export interface UpdateProjectCommentRequest {
  content: string;
}

export interface MentionableUser {
  userId: string;
  name: string;
  profilePictureUrl?: string;
}
