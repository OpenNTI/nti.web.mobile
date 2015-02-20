import {
	TYPE_COURSE,
	TYPE_CONTENT
} from '../../Constants';

import Default from './Default';
import None from './None';
import Content from './Content';
import Course from './Course';

const WIDGET_MAP = {
	[TYPE_COURSE]: Course,
	[TYPE_CONTENT]: Content
};

export function navigationComponentFor(o) {
	let type = o && o.type;

	return !o ? None : (WIDGET_MAP[type] || Default);
}
