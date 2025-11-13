import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Card, CardBody } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import UserManagementTable from '@/app/shared/components/users/UserManagementTable';

const ClientsPage = () => {
    return (
        <>
            <PageBreadcrumb title="Clients Management" subName="Users" />
            
            <Card>
                <CardBody>
                    <CardTitle
                        containerClass="d-flex align-items-center justify-content-between mb-3"
                        title={<h4 className="mb-0">Clients List</h4>}
                    />
                    
                    <UserManagementTable role="Client" />
                </CardBody>
            </Card>
        </>
    );
};

export default ClientsPage;
