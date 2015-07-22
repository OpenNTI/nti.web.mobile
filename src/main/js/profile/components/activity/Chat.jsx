import React from 'react';
import Mixin from './Mixin';

import Conditional from 'common/components/Conditional';
import DisplayName from 'common/components/DisplayName';
import DateTime from 'common/components/DateTime';
import Loading from 'common/components/TinyLoader';

import Transcript from 'chat/components/Transcript';

import {scoped} from 'common/locale';
let t = scoped('UNITS');

export default React.createClass({
	displayName: 'Chat Card',

	mixins: [Mixin],

	statics: {
		mimeType: /transcriptsummary$/i
	},

	getInitialState () {
		return {};
	},

	propTypes: {
		item: React.PropTypes.any.isRequired
	},


	showTranscript () {
		let {item} = this.props;
		this.setState({loading: true}, () => {
			item.getTranscript()
				.then(transcript => this.setState({transcript, loading: false}));
		});
	},


	render () {
		let {loading, transcript} = this.state;
		let {item} = this.props;
		let {contributorsWithoutOriginator, originator} = item;
		let others = contributorsWithoutOriginator;

		return (
			<div className="chat avatar-heading" onClick={this.showTranscript}>
				<Conditional condition={!loading && !transcript} className="wrap">
					<h1><DisplayName entity={originator} usePronoun/> had a chat with {others.map(this.renderOthers)}</h1>
					<ul className="meta">
						<li><DateTime date={item.getCreatedTime()}/></li>
						<li>Lasted <DateTime suffix={false} relativeTo={item.getLastModified()} date={item.getCreatedTime()} /></li>
						<li>{ t('messages', {count: item.RoomInfo.messageCount}) }</li>
					</ul>
				</Conditional>

				<Conditional condition={loading} className="wrap">
					<Loading />
				</Conditional>

				<Conditional condition={!loading && !!transcript} className="wrap">
					<Transcript transcript={transcript} />
				</Conditional>

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
			<span key={i}><DisplayName entity={name} usePronoun/>{suffix}</span>
		);
	}
});
