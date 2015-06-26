import React from 'react';

import Unknown from './Unknown';
import ArrayWidget from './ArrayWidget';
import StringWidget from './StringWidget';
import CommunityHeadlineTopic from './CommunityHeadlineTopic';
import ForumComment from './ForumComment';
import Highlight from './Highlight';
import ProfessionalPosition from './ProfessionalPosition';
import EducationalExperience from './EducationalExperience';

const WIDGETS = [
	Unknown,
	StringWidget,
	ArrayWidget,
	CommunityHeadlineTopic,
	ForumComment,
	Highlight,
	EducationalExperience,
	ProfessionalPosition
];

export default function select (item, index, props) {
	if (!item) {
		return null;
	}
	let Item = Unknown;

	for (let Type of WIDGETS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			break;
		}
	}

	return React.createElement(Item, Object.assign({}, props || {}, {
			key: item.NTIID || ('profile-' + item.MimeType + '-' + index),
			item: item,
			index: index,
			ref: Item.displayName + '-' + index
		}));
}

import Mixin from './Mixin';
export {Mixin};
