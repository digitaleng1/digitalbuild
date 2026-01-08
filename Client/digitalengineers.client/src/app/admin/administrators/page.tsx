import { useState, useCallback } from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Card, CardBody, Button, Alert } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import UserManagementTable from '@/app/shared/components/users/UserManagementTable';
import CreateAdminModal from './components/CreateAdminModal';
import { useUserRole } from '@/common/hooks/useUserRole';
import { Navigate } from 'react-router';

const AdministratorsPage = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const userRole = useUserRole();

    const handleAdminCreated = useCallback(() => {
        setShowCreateModal(false);
        setRefreshKey(prev => prev + 1);
    }, []);

    if (userRole !== 'SuperAdmin') {
        return <Navigate to="/admin/dashboard/analytics" replace />;
    }

    return (
        <>
            <PageBreadcrumb title="Administrators Management" subName="Users" />
            
            <Card>
                <CardBody>
                    <CardTitle
                        containerClass="d-flex align-items-center justify-content-between mb-3"
                        title={<h4 className="mb-0">Administrators List</h4>}
                        menuItems={[]}
                    />
                    
                    <div className="d-flex justify-content-end mb-3">
                        <Button 
                            variant="primary" 
                            onClick={() => setShowCreateModal(true)}
                        >
                            <i className="mdi mdi-plus me-1"></i>
                            Create Administrator
                        </Button>
                    </div>
                    
                    <UserManagementTable key={refreshKey} role="Admin" />
                </CardBody>
            </Card>

            <CreateAdminModal 
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onSuccess={handleAdminCreated}
            />
        </>
    );
};

export default AdministratorsPage;
