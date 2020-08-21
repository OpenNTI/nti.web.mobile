import './Transcript.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from '@nti/web-commons';

import MessageInfo from './MessageInfo';

export default function Transcript ({transcript}) {
	let {messages, startTime} = transcript;

	return (
		<div className="chat-transcript">
			<div className="divider"><DateTime date={startTime} showToday/></div>
			<div className="messages">
				{messages.map(m => (
					<MessageInfo key={m.getID()} item={m}/>
				))}
			</div>
		</div>
	);
}

Transcript.propTypes = {
	transcript: PropTypes.object.isRequired
};
