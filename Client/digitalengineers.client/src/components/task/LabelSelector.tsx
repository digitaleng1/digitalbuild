import { useState, useMemo } from 'react';
import { Form, Badge, Button, Modal, Row, Col, Card, CardBody } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import type { TaskLabelViewModel, CreateTaskLabelViewModel } from '@/types/task';

interface LabelSelectorProps {
    availableLabels: TaskLabelViewModel[];
    selectedLabelIds: number[];
    onChange: (labelIds: number[]) => void;
    onCreateLabel: (dto: CreateTaskLabelViewModel) => Promise<TaskLabelViewModel>;
    disabled?: boolean;
}

const PREDEFINED_COLORS = [
    { name: 'Primary', value: '#0d6efd' },
    { name: 'Success', value: '#198754' },
    { name: 'Info', value: '#0dcaf0' },
    { name: 'Warning', value: '#ffc107' },
    { name: 'Danger', value: '#dc3545' },
    { name: 'Purple', value: '#6f42c1' },
    { name: 'Pink', value: '#d63384' },
    { name: 'Orange', value: '#fd7e14' },
];

const LabelSelector = ({ availableLabels, selectedLabelIds, onChange, onCreateLabel, disabled = false }: LabelSelectorProps) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newLabelName, setNewLabelName] = useState('');
    const [newLabelColor, setNewLabelColor] = useState(PREDEFINED_COLORS[0].value);
    const [isCreating, setIsCreating] = useState(false);

    const handleToggleLabel = (labelId: number) => {
        if (disabled) return;
        if (selectedLabelIds.includes(labelId)) {
            onChange(selectedLabelIds.filter(id => id !== labelId));
        } else {
            onChange([...selectedLabelIds, labelId]);
        }
    };

    const handleCreateLabel = async () => {
        if (!newLabelName.trim()) return;

        setIsCreating(true);
        try {
            const newLabel = await onCreateLabel({
                name: newLabelName.trim(),
                color: newLabelColor,
            });

            if (newLabel && newLabel.id) {
                onChange([...selectedLabelIds, newLabel.id]);
            }

            setShowCreateModal(false);
            setNewLabelName('');
            setNewLabelColor(PREDEFINED_COLORS[0].value);
        } catch (error) {
            console.error('Failed to create label:', error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <>
            <Card>
                <CardBody>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="flex-grow-1">
                            <h5 className="card-title mb-2">
                                <Icon icon="mdi:tag-multiple" width={14} className="me-1" /> Labels
                            </h5>
                            <Form.Text className="text-muted d-block">
                                Organize and categorize tasks with labels
                            </Form.Text>
                        </div>
                        {!disabled && (
                            <Button
                                variant="link"
                                size="sm"
                                className="p-0 text-primary"
                                onClick={() => setShowCreateModal(true)}
                                style={{ fontSize: '20px', lineHeight: 1 }}
                                title="Create new label"
                            >
                                <Icon icon="mdi:plus" width={20} />
                            </Button>
                        )}
                    </div>
                    <div className="d-flex gap-1 flex-wrap">
                        {(availableLabels || []).map(label => {
                            if (!label || !label.id) return null;
                            const isSelected = selectedLabelIds.includes(label.id);
                            return (
                                <Badge
                                    key={label.id}
                                    bg=""
                                    style={{
                                        backgroundColor: isSelected ? label.color : '#f0f0f0',
                                        color: isSelected ? '#fff' : '#000',
                                        cursor: disabled ? 'default' : 'pointer',
                                        padding: '1rem 1rem',
                                        opacity: isSelected ? 1 : 0.6,
                                    }}
                                    onClick={() => handleToggleLabel(label.id)}
                                >
                                    {label.name} {isSelected && '✓'}
                                </Badge>
                            );
                        })}
                    </div>

                </CardBody>
            </Card>

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Label</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Label Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter label name"
                            value={newLabelName}
                            onChange={(e) => setNewLabelName(e.target.value)}
                            autoFocus
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Color</Form.Label>
                        <Row className="g-2">
                            {PREDEFINED_COLORS.map(color => (
                                <Col key={color.value} xs={3}>
                                    <div
                                        style={{
                                            backgroundColor: color.value,
                                            height: '40px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            border: newLabelColor === color.value ? '3px solid #000' : '1px solid #ddd',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                        }}
                                        onClick={() => setNewLabelColor(color.value)}
                                    >
                                        {newLabelColor === color.value && '✓'}
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => setShowCreateModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleCreateLabel}
                        disabled={!newLabelName.trim() || isCreating}
                    >
                        {isCreating ? 'Creating...' : 'Create'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default LabelSelector;
