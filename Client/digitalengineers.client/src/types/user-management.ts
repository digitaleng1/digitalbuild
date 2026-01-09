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

export interface CreateAdminRequest {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber?: string;
}

export interface CreateClientRequest {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber?: string;
    companyName?: string;
    industry?: string;
    website?: string;
    companyDescription?: string;
}
