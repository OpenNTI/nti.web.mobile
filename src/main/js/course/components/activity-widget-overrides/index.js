import React from 'react';

import AddComment from './AddComment';
import Assignment from './Assignment';
import AssignmentFooter from './AssignmentFooter';
import Discussion from './Discussion';
import DoNotRender from './DoNotRender';
import ForumItem from './ForumItem';
import Lesson from './Lesson';
import Note from './Note';


const WIDGETS = [
	AddComment,
	Assignment,
	AssignmentFooter,
	Discussion,
	DoNotRender,
	ForumItem,
	Lesson,
	Note,
];


export default function select (item, index, props = {}) {
	let clazz;
	for (let Type of WIDGETS) {
		if (Type.handles && Type.handles(item)) {
			clazz = Type;
			break;
		}
	}

	if (clazz) {
		props = { ...props, ref: 'input',
			key: 'course-activity-' + (index || item.OID),
			index, item};
	}

	return clazz && React.createElement(clazz, props);
}
