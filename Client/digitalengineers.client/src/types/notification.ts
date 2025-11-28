export interface Notification {
  id: number;
  type: NotificationType;
  subType: NotificationSubType;
  title: string;
  body: string;
  additionalData?: Record<string, string>;
  senderId: string;
  senderName: string;
  senderProfilePicture?: string;
  isDelivered: boolean;
  isRead: boolean;
  deliveredAt?: string;
  readAt?: string;
  createdAt: string;
}

export enum NotificationType {
  Task = 'Task',
  Project = 'Project',
  Bid = 'Bid',
  Quote = 'Quote',
  System = 'System'
}

export enum NotificationSubType {
  // Task & Project actions
  Created = 'Created',
  Assigned = 'Assigned',
  StatusChanged = 'StatusChanged',
  Message = 'Message',
  Completed = 'Completed',
  DeadlineApproaching = 'DeadlineApproaching',
  
  // Bid actions
  RequestReceived = 'RequestReceived',
  ResponseReceived = 'ResponseReceived',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  
  // Quote actions
  Submitted = 'Submitted',
  
  // System actions
  AccountActivation = 'AccountActivation',
  PasswordReset = 'PasswordReset',
  WelcomeMessage = 'WelcomeMessage'
}
