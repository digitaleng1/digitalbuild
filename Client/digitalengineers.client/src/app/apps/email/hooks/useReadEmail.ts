import { useState } from 'react';
import { useToggle } from '@/hooks';
import type { EmailDetails } from '../types';
import { emails } from '../data';
import avatarImg from '@/assets/images/users/avatar-2.jpg';

export default function useReadEmail() {
	const [totalUnreadEmails] = useState<number>(emails.filter((e) => e.is_read === false).length);
	const [email] = useState<EmailDetails>({
		avatar: avatarImg,
		subject: 'Your elite author Graphic Optimization reward is ready!',
		from_name: 'Steven Smith',
		from_email: 'jonathan@domain.com',
		recieved_on: 'Jul 24, 2019, 5:17 AM',
		attachments: [
			{ id: 1, name: 'Hyper-admin-design.zip', size: '2.3MB', ext: '.zip' },
			{ id: 2, name: 'Dashboard-design.jpg', size: '0.3MB', ext: '.jpg' },
			{ id: 3, name: 'Admin-bug-report.mp4', size: '4.1MB', ext: '.mp4' },
		],
	});

	// handle compose modal
	const [isModalOpen, toggleComposeModal] = useToggle();

	return { totalUnreadEmails, email, isModalOpen, toggleComposeModal };
}
