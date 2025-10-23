import classNames from 'classnames';
import { type ElementType, type ReactNode } from 'react';

type TimelineProps = {
	tag?: ElementType;
	className?: string;
	children: ReactNode;
};

const TimelineItem = ({ className, children, tag = 'div' }: TimelineProps) => {
	const Tag: ElementType = tag;

	return <Tag className={classNames('timeline-item', className)}>{children}</Tag>;
};

export default TimelineItem;
