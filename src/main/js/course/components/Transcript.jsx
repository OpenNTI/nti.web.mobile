import React from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';

export default React.createClass({
	displayName: 'Transcript',


	propTypes: {
		children: React.PropTypes.any,

		cues: React.PropTypes.arrayOf(
			React.PropTypes.shape({
				endTime: React.PropTypes.number,
				startTime: React.PropTypes.number,
				text: React.PropTypes.string
			})),

		currentTime: React.PropTypes.number,

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
			divider, (
			<a href="#"
				data-start-time={cue.startTime.toFixed(3)}
				data-end-time={cue.endTime.toFixed(3)}
				className={active}
				onClick={this.onJumpToCue}
				dangerouslySetInnerHTML={{__html: cue.text}}/>
		)];
	},


	render () {
		let {cues = [], children} = this.props;
		return (
			<div className="cues">
				{cues.map(this.renderCues)}
				{children}
			</div>
		);
	}
});
