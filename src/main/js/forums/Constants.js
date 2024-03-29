// export const LOADING = Symbol('forums:Loading');

export const DISCUSSIONS = Symbol('forums:DISCUSSIONS');
export const FORUM = Symbol('forums:FORUM');
export const TOPIC = Symbol('forums:TOPIC');
export const POST = Symbol('forums:POST');
export const DELETED_ITEM_GROUP = Symbol('forums:DELETED_ITEM_GROUP');

export const mimeTypes = {
	[FORUM]: ['forums.communityforum', 'forums.contentforum'],
	[TOPIC]: ['forums.communityheadlinetopic', 'forums.contentheadlinetopic'],
	[POST]: [
		'forums.generalforumcomment',
		'forums.contentforumcomment',
		'forums.personalblogcomment',
	],
	[DELETED_ITEM_GROUP]: 'forums.deleteditemgroup',
};

export const ADD_COMMENT = Symbol('forums:ADD_COMMENT');
export const BOARD_CONTENTS_CHANGED = Symbol('forums:BOARD_CONTENTS_CHANGED');
export const COMMENT_ADDED = Symbol('forums:COMMENT_ADDED');
export const COMMENT_ERROR = Symbol('forums:COMMENT_ERROR');
export const COMMENT_SAVED = Symbol('forums:COMMENT_SAVED');
export const CREATE_TOPIC = Symbol('forums:CREATE_TOPIC');
export const DELETE_COMMENT = Symbol('forums:DELETE_COMMENT');
export const DELETE_TOPIC = Symbol('forums:DELETE_TOPIC');
export const DISCUSSIONS_CHANGED = Symbol('forums:DISCUSSIONS_CHANGED');
export const EDIT_STARTED = Symbol('forums:EDIT_STARTED');
export const EDIT_ENDED = Symbol('forums:EDIT_ENDED');
export const GET_COMMENT_REPLIES = Symbol('forums:GET_COMMENT_REPLIES');
export const GOT_COMMENT_REPLIES = Symbol('forums:GOT_COMMENT_REPLIES');
export const ITEM_REPORTED = Symbol('forums:ITEM_REPORTED');
export const ITEM_CONTENTS_CHANGED = Symbol('forums:ITEM_CONTENTS_CHANGED');
export const ITEM_DELETED = Symbol('forums:ITEM_DELETED');
export const ITEM_LOADED = Symbol('forums:ITEM_LOADED');
export const REPORT_ITEM = Symbol('forums:REPORT_ITEM');
export const SAVE_COMMENT = Symbol('forums:SAVE_COMMENT');
export const TOPIC_CREATED = Symbol('forums:TOPIC_CREATED');
export const TOPIC_CREATION_ERROR = Symbol('forums:TOPIC_CREATION_ERROR');
export const COMMENT_FORM_ID = 'commentForm';
export const CREATE_FORUM = Symbol('forums:CREATE_FORUM');
export const FORUM_CREATED = Symbol('fourms:FORUM_CREATED');
export const FORUM_CREATION_ERROR = Symbol('forums:FORUM_CREATION_ERROR');
export const DELETE_FORUM = Symbol('forums:DELETE_FORUM');
export const FORUM_DELETED = Symbol('forums:FORUM_DELETED');
export const FORUM_DELETION_ERROR = Symbol('forums:FORUM_DELETION_ERROR');
