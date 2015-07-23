import React from 'react';

import Unknown from './Unknown';
import Topic from './Topic';
import Group from './Group';
import Video from './Video';
import Videos from './Videos';
import Card from './RelatedWorkRef';
import Discussion from './Discussion';
import QuestionSet from './QuestionSet';
import SurveyReference from './SurveyReference';
import Timeline from './Timeline';

const WIDGETS = [
	Unknown, //Unknown for future items.
	Topic,
	Card,
	Group,
	Video,
	Videos,
	Discussion,
	QuestionSet,
	SurveyReference,
	Timeline
];

export function select (item, index, list, props, node) {
	let Item = Unknown;
	let render = true;

	for (let Type of WIDGETS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			render = (!Type.canRender || Type.canRender(item, node));
			break;
		}
	}

	return render &&
		React.createElement(Item, Object.assign({}, props || {}, {
			key: item.NTIID || ('overview-' + item.MimeType + '-' + index),
			item: item,
			index: index,
			ref: Item.displayName + '-' + index
		}));
}

import Mixin from './Mixin';
export {Mixin};
