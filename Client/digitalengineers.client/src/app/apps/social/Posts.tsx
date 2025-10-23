
import {Link} from "react-router";
import classnames from 'classnames';
import { Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import classNames from 'classnames';
import type { FeedPost, Person, Comment } from './types';
import useFeeds from './useFeeds';
import posts from './data';

const createMarkup = (text: string) => {
	return { __html: text };
};

type PostCommentProps = {
	comment: Comment;
	isActionAllowed: boolean;
	toggleLikeOnComment: (comment: Comment) => void;
};

type PostProps = {
	post: FeedPost;
	user: Person;
	toggleLike: (post: FeedPost) => void;
	toggleLikeOnComment: (comment: Comment) => void;
};

const LoadMore = () => {
	return (
		<div className="text-center mb-3">
			<Link to="" className="text-danger">
				<i className="mdi mdi-spin mdi-loading me-1 font-16"></i> Load more
			</Link>
		</div>
	);
};

const PostComment = ({ comment, isActionAllowed, toggleLikeOnComment }: PostCommentProps) => {
	return (
		<div className="mt-3">
			<div className="d-flex">
				{comment.author?.avatar && <img className="me-2 rounded" src={comment.author.avatar} alt="author-image" height="32" />}
				<div>
					<h5 className="m-0">{comment.author.name} </h5>
					<p className="text-muted mb-0">
						<small>{comment.postedOn}</small>
					</p>

					<p className="my-1" dangerouslySetInnerHTML={createMarkup(comment.content)}></p>

					{isActionAllowed && (
						<div>
							<Link to="" className="btn btn-sm btn-link text-muted p-0" onClick={() => toggleLikeOnComment(comment)}>
								<i
									className={classnames('uil', 'uil-heart', 'me-1', {
										'text-danger': comment.isLiked,
									})}
								></i>
								Like
							</Link>
							<Link to="" className="btn btn-sm btn-link text-muted p-0 ps-2">
								<i className="uil uil-comments-alt me-1"></i> Reply
							</Link>
						</div>
					)}

					{comment.replies && (
						<>
							{comment.replies.map((reply, index) => {
								return <PostComment key={index.toString()} comment={reply} isActionAllowed={false} toggleLikeOnComment={toggleLikeOnComment} />;
							})}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

const Post = ({ post, user, toggleLike, toggleLikeOnComment }: PostProps) => {
	return (
		<Card>
			<CardBody className="pb-1">
				<div className="d-flex">
					{post.author.avatar && <img className="me-2 rounded" src={post.author.avatar} alt="" height="32" />}
					<div className="w-100">
						<Dropdown className="float-end" align="end">
							<DropdownToggle variant="link" className="card-drop arrow-none cursor-pointer p-0 shadow-none">
								<i className="mdi mdi-dots-horizontal"></i>
							</DropdownToggle>

							<DropdownMenu>
								<DropdownItem>Edit</DropdownItem>
								<DropdownItem>Delete</DropdownItem>
							</DropdownMenu>
						</Dropdown>

						<h5 className="m-0">{post.author.name}</h5>
						<p className="text-muted">
							<small>
								{post.postedOn} <span className="mx-1">⚬</span>
								<span>{post.scope}</span>
							</small>
						</p>
					</div>
				</div>

				<hr className="m-0" />

				<div dangerouslySetInnerHTML={createMarkup(post.content)}></div>

				<hr className="m-0" />

				<div className="my-1">
					<Link to="" className="btn btn-sm btn-link text-muted ps-0" onClick={() => toggleLike(post)}>
						<i
							className={classNames('mdi', 'mdi-heart', {
								'text-danger': post.isLiked,
							})}
						></i>
						{post.totalLikes} Likes
					</Link>
					<Link to="" className="btn btn-sm btn-link text-muted">
						<i className="uil uil-comments-alt me-1"></i>
						{post.totalComments} Comments
					</Link>
					<Link to="" className="btn btn-sm btn-link text-muted">
						<i className="uil uil-share-alt me-1"></i>
						Share
					</Link>
				</div>

				<hr className="m-0" />

				<div className="mt-3">
					{(post.comments || []).map((comment, index) => {
						return (
							<PostComment key={index.toString()} comment={comment} isActionAllowed={true} toggleLikeOnComment={toggleLikeOnComment}></PostComment>
						);
					})}
				</div>

				<hr />

				{user && (
					<div className="d-flex mb-2">
						{user.avatar && <img src={user.avatar} height="32" className="align-self-start rounded me-2" alt="" />}
						<div className="w-100">
							<input type="text" className="form-control border-0 form-control-sm" placeholder="Write a comment" />
						</div>
					</div>
				)}
			</CardBody>
		</Card>
	);
};

const Posts = () => {
	const { user, toggleLike, toggleLikeOnComment } = useFeeds();

	return (
		<>
			{posts &&
				posts.map((post, index) => {
					return <Post post={post} key={index.toString()} user={user} toggleLike={toggleLike} toggleLikeOnComment={toggleLikeOnComment} />;
				})}

			<LoadMore></LoadMore>
		</>
	);
};

export default Posts;
