import React from 'react';
import Mixin from './Mixin';
import DisplayName from 'common/components/DisplayName';
import DateTime from 'common/components/DateTime';

export default React.createClass({
	displayName: 'Chat Card',

	mixins: [Mixin],

	statics: {
		mimeType: /transcriptsummary$/i
	},

	propTypes: {
		item: React.PropTypes.any.isRequired
	},


	render () {

		let {item} = this.props;
		let {contributors} = item;

		return (
			<div className="chat avatar-heading">
				<div className="wrap">
					<h1><DisplayName username={contributors[0]}/> had a chat with <DisplayName username={contributors[1]}/></h1>
					<ul className="meta">
						<li><DateTime date={item.getCreatedTime()}/></li>
						<li>Lasted <DateTime suffix={false} relativeTo={item.getLastModified()} date={item.getCreatedTime()} /></li>
						<li>{item.RoomInfo.messageCount} messages</li>
					</ul>
				</div>
			</div>
		);
	}
});
