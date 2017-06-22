import React from 'react';

import Unknown from './Unknown';
import Discussion from './Discussion';
import Group from './Group';
import PollReference from './PollReference';
import QuestionSet from './QuestionSet';
import RelatedWorkRef from './RelatedWorkRef';
import SurveyReference from './SurveyReference';
import Timeline from './Timeline';
import Topic from './Topic';
import Video from './Video';
import Videos from './Videos';

export Mixin from './Mixin';

const WIDGETS = [
	Discussion,
	Group,
	PollReference,
	QuestionSet,
	RelatedWorkRef,
	SurveyReference,
	Timeline,
	Topic,
	Video,
	Videos
];

export function select (item, index, list, props, node, assessmentCollection) {
	let Item = Unknown;
	let render = true;

	for (let Type of WIDGETS) {
		if (Type !== Unknown && Type.handles && Type.handles(item)) {
			Item = Type;
			render = (!Type.canRender || Type.canRender(item, node, assessmentCollection));
			break;
		}
	}

	return render &&
		React.createElement(Item, Object.assign({}, props || {}, {
			key: item.NTIID || ('overview-' + item.MimeType + '-' + index),
			item: item,
			index: index,
			ref: x => this['container-item-' + Item.displayName + '-' + index] = x,
			assessmentCollection
		}));
}
