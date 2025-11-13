export interface UserManagement {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profilePictureUrl?: string;
    roles: string[];
    isActive: boolean;
    lastActive?: string;
    createdAt: string;
    licenseStatus?: string;
}
