import type { FeedPost } from '@/app/apps/social/types';


export type Project = {
	id: number;
	clientProfile: string;
	client: string;
	name: string;
	startDate: string;
	dueDate: string;
	status: string;
};

export type TimelinePost = FeedPost & {
	engagement: boolean;
};
