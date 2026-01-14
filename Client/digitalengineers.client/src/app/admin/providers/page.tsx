import { useState, useCallback } from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Card, CardBody, Button } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import UserManagementTable from '@/app/shared/components/users/UserManagementTable';
import CreateSpecialistModal from './components/CreateSpecialistModal';

const ProvidersPage = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSpecialistCreated = useCallback(() => {
        setShowCreateModal(false);
        setRefreshKey(prev => prev + 1);
    }, []);

    return (
        <>
            <PageBreadcrumb title="Providers Management" subName="Users" />
            
            <Card>
                <CardBody>
                    <CardTitle
                        containerClass="d-flex align-items-center justify-content-between mb-3"
                        title={<h4 className="mb-0">Providers List</h4>}
                        menuItems={[]}
                    />
                    
                    <div className="d-flex justify-content-end mb-3">
                        <Button 
                            variant="primary" 
                            onClick={() => setShowCreateModal(true)}
                        >
                            <i className="mdi mdi-plus me-1"></i>
                            Create Specialist
                        </Button>
                    </div>
                    
                    <UserManagementTable key={refreshKey} role="Provider" />
                </CardBody>
            </Card>

            <CreateSpecialistModal 
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onSuccess={handleSpecialistCreated}
            />
        </>
    );
};

export default ProvidersPage;
