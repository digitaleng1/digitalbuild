import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface RoleSelectorProps {
    selectedRole: 'Client' | 'Provider';
    onRoleChange: (role: 'Client' | 'Provider') => void;
}

const RoleSelector = ({ selectedRole, onRoleChange }: RoleSelectorProps) => {
    const { t } = useTranslation();

    return (
        <div className="mb-3">
            <Form.Label>{t('I am a')}</Form.Label>
            <div className="d-flex gap-3">
                <Form.Check
                    type="radio"
                    id="role-client"
                    name="role"
                    label={t('Client (looking for services)')}
                    checked={selectedRole === 'Client'}
                    onChange={() => onRoleChange('Client')}
                />
                <Form.Check
                    type="radio"
                    id="role-provider"
                    name="role"
                    label={t('Provider (offering services)')}
                    checked={selectedRole === 'Provider'}
                    onChange={() => onRoleChange('Provider')}
                />
            </div>
        </div>
    );
};

export default RoleSelector;
