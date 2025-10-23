import classNames from 'classnames';
import type { Email } from '../types';
import {Link} from "react-router";

const EmailsList = ({ emails }: { emails: Email[] }) => {
	return (
		<ul className="email-list">
			{emails.map((email, index) => {
				return (
					<li className={classNames({ unread: !email.is_read })} key={index.toString()}>
						<div className="email-sender-info">
							<div className="checkbox-wrapper-mail">
								<div className="form-check">
									<input type="checkbox" className="form-check-input" id={'mail' + email.id} />
									<label className="form-check-label" htmlFor={'mail' + email.id}></label>
								</div>
							</div>

							<span
								className={classNames('star-toggle', 'mdi', 'mdi-star-outline', {
									'text-warning': email.is_important,
								})}
							></span>
							<Link to="/apps/email/read" className="email-title">
								{email.from_name}
								{email.number_of_reply > 1 && <span> ({email.number_of_reply})</span>}
							</Link>
						</div>
						<div className="email-content">
							<Link to="/apps/email/read" className="email-subject">
								{email.subject}
							</Link>
							<div className="email-date">{email.time}</div>
						</div>
						<div className="email-action-icons">
							<ul className="list-inline">
								<li className="list-inline-item">
									<Link to="">
										<i className="mdi mdi-archive email-action-icons-item"></i>
									</Link>
								</li>
								<li className="list-inline-item">
									<Link to="">
										<i className="mdi mdi-delete email-action-icons-item"></i>
									</Link>
								</li>
								<li className="list-inline-item">
									<Link to="">
										<i className="mdi mdi-email-open email-action-icons-item"></i>
									</Link>
								</li>
								<li className="list-inline-item">
									<Link to="">
										<i className="mdi mdi-clock email-action-icons-item"></i>
									</Link>
								</li>
							</ul>
						</div>
					</li>
				);
			})}
		</ul>
	);
};

export default EmailsList;
