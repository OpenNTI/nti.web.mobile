import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import DisplayName from 'common/components/DisplayName';
import {DateTime, Loading} from 'nti-web-commons';

import Transcript from 'chat/components/Transcript';

import {scoped} from 'nti-lib-locale';
let t = scoped('UNITS');

import Mixin from './Mixin';

export default createReactClass({
	displayName: 'Chat Card',

	mixins: [Mixin],

	statics: {
		mimeType: /transcriptsummary$/i
	},

	getInitialState () {
		return {};
	},

	propTypes: {
		item: PropTypes.any.isRequired
	},


	hideTranscript () {
		this.setState({hideTranscript: true});
	},


	showTranscript () {
		let {item} = this.props;
		let {transcript} = this.state;

		if (!transcript) {
			this.setState({loading: true}, () => {
				item.getTranscript()
					.then(x => this.setState({transcript: x, loading: false}));
			});
		} else {
			this.setState({hideTranscript: false});
		}
	},


	render () {
		let {loading, transcript, hideTranscript} = this.state;
		let {item} = this.props;
		let {contributorsWithoutOriginator, originator} = item;
		let others = contributorsWithoutOriginator;

		return (
			<div className="chat avatar-heading">
				{(!loading && (!transcript || hideTranscript)) && (
					<div className="wrap" onClick={this.showTranscript}>
						<h1><DisplayName entity={originator} usePronoun/> had a chat with {others.map(this.renderOthers)}</h1>
						<ul className="meta">
							<li><DateTime date={item.getCreatedTime()}/></li>
							<li>Lasted <DateTime suffix={false} relativeTo={item.getLastModified()} date={item.getCreatedTime()} /></li>
							<li>{ t('messages', {count: item.RoomInfo.messageCount}) }</li>
						</ul>
					</div>
				)}

				{loading && (
					<div className="wrap">
						<Loading.Ellipse />
					</div>
				)}

				{(!loading && !!transcript && !hideTranscript) && (
					<div className="wrap" onClick={this.hideTranscript}>
						<Transcript transcript={transcript} />
					</div>
				)}

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
