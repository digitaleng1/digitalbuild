import { useState, useCallback } from 'react';
import { Table, Dropdown, Badge, Form, Spinner, Alert } from 'react-bootstrap';
import type { UserManagement } from '@/types/user-management';
import { useUserManagement } from '@/app/shared/hooks';

interface UserManagementTableProps {
    role: 'Client' | 'Provider';
}

const UserManagementTable = ({ role }: UserManagementTableProps) => {
    const { users, loading, error, toggleUserStatus } = useUserManagement(role);
    const [togglingUserId, setTogglingUserId] = useState<string | null>(null);

    const handleToggleStatus = useCallback(async (userId: string, currentStatus: boolean) => {
        setTogglingUserId(userId);
        try {
            await toggleUserStatus(userId, !currentStatus);
        } catch {
            // Error handled in hook
        } finally {
            setTogglingUserId(null);
        }
    }, [toggleUserStatus]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger">
                <Alert.Heading>Error</Alert.Heading>
                <p>{error}</p>
            </Alert>
        );
    }

    if (!users || users.length === 0) {
        return (
            <Alert variant="info">
                No {role.toLowerCase()}s found.
            </Alert>
        );
    }

    return (
        <div className="table-responsive">
            <Table className="table table-centered table-nowrap mb-0">
                <thead className="table-light">
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role(s)</th>
                        <th>Status</th>
                        {role === 'Provider' && <th>License Status</th>}
                        <th>Join Date</th>
                        <th>Last Active</th>
                        <th className="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0">
                                        {user.profilePictureUrl ? (
                                            <img
                                                src={user.profilePictureUrl}
                                                alt={`${user.firstName} ${user.lastName}`}
                                                className="rounded-circle"
                                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                                                style={{ width: '40px', height: '40px', fontSize: '14px', fontWeight: 'bold' }}
                                            >
                                                {user.firstName?.[0]}{user.lastName?.[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ms-2">
                                        <h6 className="mb-0">{user.firstName} {user.lastName}</h6>
                                        <small className="text-muted">@{user.email.split('@')[0]}</small>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <small>{user.email}</small>
                            </td>
                            <td>
                                {user.roles.map((role, index) => (
                                    <Badge key={index} bg="primary" className="me-1">
                                        {role}
                                    </Badge>
                                ))}
                            </td>
                            <td>
                                <div className="form-check form-switch">
                                    <Form.Check
                                        type="switch"
                                        id={`status-${user.id}`}
                                        checked={user.isActive}
                                        onChange={() => handleToggleStatus(user.id, user.isActive)}
                                        disabled={togglingUserId === user.id}
                                        label={user.isActive ? 'Active' : 'Inactive'}
                                    />
                                </div>
                            </td>
                            {role === 'Provider' && (
                                <td>
                                    {user.licenseStatus === 'Active' && <Badge bg="success">Active</Badge>}
                                    {user.licenseStatus === 'Pending' && <Badge bg="warning" text="dark">Pending</Badge>}
                                    {user.licenseStatus === 'None' && <Badge bg="secondary">None</Badge>}
                                    {!user.licenseStatus && <span className="text-muted">N/A</span>}
                                </td>
                            )}
                            <td>
                                <small>{new Date(user.createdAt).toLocaleDateString()}</small>
                            </td>
                            <td>
                                <small>{user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'N/A'}</small>
                            </td>
                            <td className="text-end">
                                <Dropdown align="end">
                                    <Dropdown.Toggle variant="link" className="arrow-none card-drop p-0">
                                        <i className="mdi mdi-dots-horizontal"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>
                                            <i className="mdi mdi-account-outline me-1"></i>
                                            View Profile
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <i className="mdi mdi-pencil-outline me-1"></i>
                                            Edit User
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item className="text-danger">
                                            <i className="mdi mdi-delete-outline me-1"></i>
                                            Delete User
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserManagementTable;
