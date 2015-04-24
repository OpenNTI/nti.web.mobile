import React from 'react';
import emptyFunction from 'react/lib/emptyFunction';

export default React.createClass({
	displayName: 'Transcript',


	propTypes: {
		onJumpTo: React.PropTypes.func
	},


	getDefaultProps () {
		return {
			onJumpTo: emptyFunction
		};
	},


	onJumpToCue (e) {
		e.preventDefault();
		this.props.onJumpTo(e.target.getAttribute('data-start-time'));
	},


	renderCues (cue) {
		let divider = null;
		let time = this.props.currentTime;

		let active = (cue.startTime < time && time <= cue.endTime) ? 'active' : '';

		//There is HTML escaped text in the cue, so we have to
		// use: "dangerouslySetInnerHTML={{__html: ''}}"
		return [
			divider,
			(<a href="#" data-start-time={cue.startTime}
				className={active}
				onClick={this.onJumpToCue}
				dangerouslySetInnerHTML={{__html: cue.text}}/>)
		];
	},


	render () {
		return (
			<div className="cues">
				{(this.props.cues || []).map(this.renderCues)}
			</div>
		);
	}
});
