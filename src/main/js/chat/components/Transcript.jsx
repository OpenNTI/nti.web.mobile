import React from 'react';

import DateTime from 'common/components/DateTime';

import MessageInfo from './MessageInfo';

export default React.createClass({
	displayName: 'Transcript',

	propTypes: {
		transcript: React.PropTypes.object.isRequired
	},

	render () {
		let {transcript} = this.props;
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
});
