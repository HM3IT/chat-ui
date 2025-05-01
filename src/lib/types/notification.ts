export type Notification = {
	id: string;
	delivered: boolean;
	user_email: string;
	title: string;
	description: string;
	sns_data: NotificationPayload;
	read_at: string | null;
	created_at: string;
};

export type NotificationPayload = {
	type: NotificationType;
	title: string;
	value: { [key in string]: string };
	user_email: string;
	description: string;
	notification_id: string;
	key: string[][];
};

export enum NotificationType {
	INVALIDATE = 'INVALIDATE',
	REQUEST_CREATE = 'REQUEST_CREATE',
	REQUEST_APPROVED = 'REQUEST_APPROVED',
	REQUEST_RELEASED = 'REQUEST_RELEASED',
	REQUEST_CLOSED = 'REQUEST_CLOSED',
	REQUEST_INVITE = 'REQUEST_INVITE',
	COMMENT_POSTED = 'COMMENT_POSTED',
	DEDUP_STARTED = 'DEDUP_STARTED',
	DEDUP_FINISHED = 'DEDUP_FINISHED',
	DEDUP_FAILED = 'DEDUP_FAILED',
	CLOCK_STARTED = 'CLOCK_STARTED',
	CLOCK_PAUSED = 'CLOCK_PAUSED',
	MESSAGE_SENT = 'MESSAGE_SENT',
	TASK_ASSIGNED = 'TASK_ASSIGNED',
	BUNDLE_CREATED = 'BUNDLE_CREATED',
	BUNDLE_RELEASED = 'BUNDLE_RELEASED',
	TASK_COMMENT_POSTED = 'TASK_COMMENT_POSTED'
}
