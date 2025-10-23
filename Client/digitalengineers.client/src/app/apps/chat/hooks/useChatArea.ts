import { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { messages } from '../data';
import type { ChatMessage, ChatUser } from '../types';
import avatar from '@/assets/images/users/avatar-1.jpg';
import {type UseFormReturn } from 'react-hook-form';

/*
 * form validation schema
 */
export const chatSchema = yup.object().shape({
	newMessage: yup.string().required('Please enter your messsage'),
});

export type ChatFormFields = yup.InferType<typeof chatSchema>;

export default function useChatArea(selectedUser: ChatUser) {
	const [userMessages, setUserMessages] = useState<ChatMessage[]>([]);
	const [inputMethods, setInputMethods] = useState<UseFormReturn<ChatFormFields>>();

	const [toUser] = useState<ChatUser>({
		id: 9,
		name: 'Shreyu N',
		avatar: avatar,
		email: 'support@coderthemes.com',
		phone: '+1 456 9595 9594',
		location: 'California, USA',
		languages: 'English, German, Spanish',
		groups: 'Work, Friends',
	});

	/*
	 *  Fetches the messages for selected user
	 */
	const getMessagesForUser = useCallback(() => {
		if (selectedUser) {
			setUserMessages([
				...messages.filter(
					(m) => (m.to.id === toUser.id && m.from.id === selectedUser.id) || (toUser.id === m.from.id && m.to.id === selectedUser.id)
				),
			]);
		}
	}, [selectedUser, toUser]);

	useEffect(() => {
		getMessagesForUser();
	}, [getMessagesForUser]);

	/**
	 * sends the chat message
	 */
	const sendChatMessage = (value: ChatFormFields) => {
		const newUserMessages = [...userMessages];
		newUserMessages.push({
			id: userMessages.length + 1,
			from: toUser,
			to: selectedUser,
			message: { type: 'text', value: { text: value.newMessage } },
			sendOn: new Date().getHours() + ':' + new Date().getMinutes(),
		});
		if (inputMethods) {
			inputMethods.reset();
		}
		setTimeout(() => {
			const otherNewMessages = [...newUserMessages];
			otherNewMessages.push({
				id: userMessages.length + 1,
				from: selectedUser,
				to: toUser,
				message: { type: 'text', value: { text: value.newMessage } },
				sendOn: new Date().getHours() + ':' + new Date().getMinutes(),
			});
			setUserMessages(otherNewMessages);
		}, 1000);
		setUserMessages(newUserMessages);
	};
	return {
		toUser,
		userMessages,
		sendChatMessage,
		setInputMethods,
	};
}
