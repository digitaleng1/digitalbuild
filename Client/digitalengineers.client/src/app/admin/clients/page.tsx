import { useState, useCallback } from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Card, CardBody, Button } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import UserManagementTable from '@/app/shared/components/users/UserManagementTable';
import CreateClientModal from './components/CreateClientModal';

const ClientsPage = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleClientCreated = useCallback(() => {
        setShowCreateModal(false);
        setRefreshKey(prev => prev + 1);
    }, []);

    return (
        <>
            <PageBreadcrumb title="Clients Management" subName="Users" />
            
            <Card>
                <CardBody>
                    <CardTitle
                        containerClass="d-flex align-items-center justify-content-between mb-3"
                        title={<h4 className="mb-0">Clients List</h4>}
                        menuItems={[]}
                    />
                    
                    <div className="d-flex justify-content-end mb-3">
                        <Button 
                            variant="primary" 
                            onClick={() => setShowCreateModal(true)}
                        >
                            <i className="mdi mdi-plus me-1"></i>
                            Create Client
                        </Button>
                    </div>
                    
                    <UserManagementTable key={refreshKey} role="Client" />
                </CardBody>
            </Card>

            <CreateClientModal 
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onSuccess={handleClientCreated}
            />
        </>
    );
};

export default ClientsPage;
