import { useState } from 'react';
import { Card, CardBody, Form } from 'react-bootstrap';
import type { SpecialistProfile } from '@/types/specialist';
import { useUpdateSpecialist } from '@/app/shared/hooks/useUpdateSpecialist';
import Rating from '@/components/Rating';
import avatarImg from '@/assets/images/users/avatar-1.jpg';

interface ProfileHeaderProps {
    profile: SpecialistProfile;
    onRefresh: () => void;
}

const ProfileHeader = ({ profile, onRefresh }: ProfileHeaderProps) => {
    const { updateSpecialist, loading: updating } = useUpdateSpecialist();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedProfile, setEditedProfile] = useState(profile);

    const fullName = `${profile.firstName} ${profile.lastName}`;

    const handleChange = (field: string, value: any) => {
        setEditedProfile({ ...editedProfile, [field]: value });
    };

    const handleSave = async () => {
        await updateSpecialist(profile.id, {
            firstName: editedProfile.firstName,
            lastName: editedProfile.lastName,
            biography: editedProfile.biography,
            location: editedProfile.location,
            website: editedProfile.website,
            specialization: editedProfile.specialization,
            yearsOfExperience: editedProfile.yearsOfExperience,
            hourlyRate: editedProfile.hourlyRate,
            isAvailable: editedProfile.isAvailable,
            licenseTypeIds: editedProfile.licenseTypeIds,
        });
        setIsEditMode(false);
        onRefresh();
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditMode(false);
    };

    const currentProfile = isEditMode ? editedProfile : profile;

    return (
        <Card className="bg-primary">
            <CardBody className="py-1 px-2">
                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                        <img
                            src={currentProfile.profilePictureUrl || avatarImg}
                            alt={fullName}
                            className="rounded-circle avatar-lg"
                        />
                        <div>
                            {isEditMode ? (
                                <div className="d-flex gap-2 mb-2">
                                    <Form.Control
                                        type="text"
                                        value={currentProfile.firstName}
                                        onChange={(e) => handleChange('firstName', e.target.value)}
                                        placeholder="First Name"
                                        className="form-control-sm"
                                        style={{ maxWidth: '150px' }}
                                    />
                                    <Form.Control
                                        type="text"
                                        value={currentProfile.lastName}
                                        onChange={(e) => handleChange('lastName', e.target.value)}
                                        placeholder="Last Name"
                                        className="form-control-sm"
                                        style={{ maxWidth: '150px' }}
                                    />
                                </div>
                            ) : (
                                <h4 className="mb-0 text-white">{fullName}</h4>
                            )}

                            <p className="text-white-50 mb-0 mt-1">{currentProfile.specialization}</p>
                        </div>
                        <div className="ms-3">
                            <Rating value={currentProfile.rating} />
                            <small className="text-white-50 d-block mt-1">
                                {currentProfile.rating.toFixed(1)} ({currentProfile.stats?.totalReviews || 0} reviews)
                            </small>
                        </div>
                    </div>
                    <div className="my-1 align-self-start d-flex gap-2">
                        {isEditMode ? (
                            <>
                                <i
                                    className="mdi mdi-close text-white cursor-pointer"
                                    style={{ fontSize: '1.3rem' }}
                                    onClick={handleCancel}
                                    title="Cancel"
                                ></i>
                                {updating ? (
                                    <span className="spinner-border spinner-border-sm text-white"></span>
                                ) : (
                                    <i
                                        className="mdi mdi-content-save text-white cursor-pointer"
                                        style={{ fontSize: '1.3rem' }}
                                        onClick={handleSave}
                                        title="Save"
                                    ></i>
                                )}
                            </>
                        ) : (
                            <i
                                className="mdi mdi-pencil text-white cursor-pointer"
                                style={{ fontSize: '1.3rem' }}
                                onClick={() => setIsEditMode(true)}
                                title="Edit Profile"
                            ></i>
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default ProfileHeader;
