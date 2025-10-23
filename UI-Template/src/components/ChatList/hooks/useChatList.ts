import { useState } from 'react';
import * as yup from 'yup';
import type { Message } from '@/components/ChatList';

/*
 * form validation schema
 */
export const chatMessageSchema = yup.object({
	message: yup.string().required('Please enter your messsage'),
});

export type NewMessagePosted = yup.InferType<typeof chatMessageSchema>;

export default function useChatList(chatMessages: Message[]) {
	const [messages, setMessages] = useState<Message[]>(chatMessages);

	/**
	 * Handle new message posted
	 */
	const handleNewMessagePosted = (message: NewMessagePosted) => {
		setMessages(
			messages.concat({
				id: messages.length + 1,
				userName: 'Geneva',
				text: message.message,
				postedOn: new Date().getHours() + ':' + new Date().getMinutes(),
			})
		);
	};

	return {
		messages,
		handleNewMessagePosted,
	};
}
