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
		let {contributorsWithoutOriginator, originator} = item;
		let others = contributorsWithoutOriginator;

		return (
			<div className="chat avatar-heading">
				<div className="wrap">
					<h1><DisplayName username={originator} usePronoun/> had a chat with {others.map(this.renderOthers)}</h1>
					<ul className="meta">
						<li><DateTime date={item.getCreatedTime()}/></li>
						<li>Lasted <DateTime suffix={false} relativeTo={item.getLastModified()} date={item.getCreatedTime()} /></li>
						<li>{item.RoomInfo.messageCount} messages</li>
					</ul>
				</div>
			</div>
		);
	},


	renderOthers (name, i, a) {
		let suffix = (a.length === 1)
			? ''
			: (i === (a.length - 1))
				? ' and '
				: ', ';

		return (
			<span key={i}><DisplayName username={name} usePronoun/>{suffix}</span>
		);
	}
});
