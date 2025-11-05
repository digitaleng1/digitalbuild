import { useState, useEffect, useRef, useMemo } from 'react';
import { Modal, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
import classNames from 'classnames';
import type { BidMessageDto } from '@/types/bid';
import bidService from '@/services/bidService';
import { useAuthContext } from '@/common/context/useAuthContext';

interface BidChatProps {
	bidRequestId: number;
	recipientName: string;
	recipientAvatar?: string;
	mode?: 'modal' | 'card';
	show?: boolean;
	onHide?: () => void;
}

interface MessageItemProps {
	message: BidMessageDto;
	isCurrentUser: boolean;
}

const MessageItem = ({ message, isCurrentUser }: MessageItemProps) => {
	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString('en-US', { 
			hour: '2-digit', 
			minute: '2-digit',
			hour12: false 
		});
	};

	return (
		<li className={classNames('clearfix', { odd: !isCurrentUser })}>
			<div className="chat-avatar">
				<img 
					src={message.senderProfilePictureUrl || '/assets/images/users/avatar-default.jpg'} 
					height={42} 
					width={42} 
					className="rounded" 
					alt={message.senderName} 
				/>
				<i>{formatTime(message.createdAt)}</i>
			</div>

			<div className="conversation-text">
				<div className="ctext-wrap">
					<i>{message.senderName}</i>
					<p>{message.messageText}</p>
				</div>
			</div>
		</li>
	);
};

const AlwaysScrollToBottom = () => {
	const elementRef = useRef<HTMLDivElement>(null);
	
	useEffect(() => {
		if (elementRef?.current?.scrollIntoView) {
			elementRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	});
	
	return <div ref={elementRef} />;
};

const BidChat = ({ 
	bidRequestId, 
	recipientName,
	recipientAvatar: recipientAvatarProp,
	mode = 'modal',
	show = true,
	onHide
}: BidChatProps) => {
	const { user } = useAuthContext();
	const [messages, setMessages] = useState<BidMessageDto[]>([]);
	const [newMessage, setNewMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState('');

	const loadMessages = async () => {
		try {
			setLoading(true);
			setError('');
			const data = await bidService.getMessages(bidRequestId);
			setMessages(data);
		} catch (err: any) {
			console.error('Error loading messages:', err);
			setError('Failed to load messages. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if ((mode === 'modal' && show && bidRequestId) || (mode === 'card' && bidRequestId)) {
			loadMessages();
		}
	}, [mode, show, bidRequestId]);

	const handleSend = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!newMessage.trim()) {
			setError('Please enter a message');
			return;
		}

		try {
			setSending(true);
			setError('');
			const sentMessage = await bidService.sendMessage(bidRequestId, newMessage.trim());
			setMessages(prev => [...prev, sentMessage]);
			setNewMessage('');
		} catch (err: any) {
			console.error('Error sending message:', err);
			setError('Failed to send message. Please try again.');
		} finally {
			setSending(false);
		}
	};

	const handleClose = () => {
		setNewMessage('');
		setError('');
		onHide?.();
	};

	const currentUserId = user?.id;

	// Get recipient avatar from messages (first message from recipient)
	const recipientAvatar = useMemo(() => {
		if (recipientAvatarProp) return recipientAvatarProp;
		
		const recipientMessage = messages.find(m => m.senderId !== currentUserId);
		return recipientMessage?.senderProfilePictureUrl;
	}, [messages, currentUserId, recipientAvatarProp]);

	const headerContent = (
		<div className="d-flex align-items-center gap-2">
			{recipientAvatar && (
				<img 
					src={recipientAvatar} 
					className="rounded" 
					height={36} 
					alt={recipientName} 
				/>
			)}
			<div className="flex-grow-1">
				<h5 className="mb-0">{mode === 'modal' ? `Send Message to ${recipientName}` : `Conversation with ${recipientName}`}</h5>
				<small className="text-muted">Bid Request #{bidRequestId}</small>
			</div>
		</div>
	);

	const bodyContent = (
		<>
			{error && (
				<div className="px-3 pt-3">
					<Alert variant="danger" dismissible onClose={() => setError('')}>
						{error}
					</Alert>
				</div>
			)}

			{loading ? (
				<div className="text-center py-5">
					<Spinner animation="border" variant="primary" />
					<p className="mt-2 text-muted">Loading messages...</p>
				</div>
			) : (
				<SimplebarReactClient 
					className="conversation-list px-3 py-3" 
					style={{ maxHeight: '400px', minHeight: '300px' }}
				>
					{messages.length === 0 ? (
						<div className="text-center py-5 text-muted">
							<Icon icon="mdi:message-outline" width={48} className="mb-2 opacity-50" />
							<p>No messages yet. Start the conversation!</p>
						</div>
					) : (
						<ul className="list-unstyled mb-0">
							{messages.map((message) => (
								<MessageItem 
									key={message.id} 
									message={message} 
									isCurrentUser={message.senderId === currentUserId}
								/>
							))}
							<AlwaysScrollToBottom />
						</ul>
					)}
				</SimplebarReactClient>
			)}
		</>
	);

	const footerContent = (
		<Form onSubmit={handleSend} className="w-100">
			<div className="d-flex align-items-center gap-2">
				<Form.Control
					type="text"
					placeholder="Type your message..."
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					disabled={sending || loading}
					className="border-0"
				/>
				<Button 
					variant="primary" 
					type="submit" 
					disabled={sending || loading || !newMessage.trim()}
					className="px-3"
				>
					{sending ? (
						<Spinner animation="border" size="sm" />
					) : (
						<Icon icon="mdi:send" width={18} />
					)}
				</Button>
			</div>
		</Form>
	);

	if (mode === 'card') {
		return (
			<Card className="mb-3">
				<Card.Header className="border-bottom">
					{headerContent}
				</Card.Header>
				<Card.Body className="p-0">
					{bodyContent}
				</Card.Body>
				<Card.Footer className="bg-light border-top">
					{footerContent}
				</Card.Footer>
			</Card>
		);
	}

	return (
		<Modal show={show} onHide={handleClose} size="lg" centered>
			<Modal.Header closeButton className="border-bottom">
				<Modal.Title>
					{headerContent}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="p-0">
				{bodyContent}
			</Modal.Body>
			<Modal.Footer className="bg-light border-top">
				{footerContent}
			</Modal.Footer>
		</Modal>
	);
};

export default BidChat;
