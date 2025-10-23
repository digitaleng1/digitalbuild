import classNames from 'classnames';
import { type ElementType, type ReactNode } from 'react';

type TimelineProps = {
	tag?: ElementType;
	className?: string;
	children: ReactNode;
};

const Timeline = ({ className, children, tag = 'div' }: TimelineProps) => {
	const Tag: ElementType = tag;

	return <Tag className={classNames('timeline-alt', 'py-0', className)}>{children}</Tag>;
};

export default Timeline;
