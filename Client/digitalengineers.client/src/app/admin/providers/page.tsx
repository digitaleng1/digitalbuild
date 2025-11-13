import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Card, CardBody } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import UserManagementTable from '@/app/shared/components/users/UserManagementTable';

const ProvidersPage = () => {
    return (
        <>
            <PageBreadcrumb title="Providers Management" subName="Users" />
            
            <Card>
                <CardBody>
                    <CardTitle
                        containerClass="d-flex align-items-center justify-content-between mb-3"
                        title={<h4 className="mb-0">Providers List</h4>}
                    />
                    
                    <UserManagementTable role="Provider" />
                </CardBody>
            </Card>
        </>
    );
};

export default ProvidersPage;
