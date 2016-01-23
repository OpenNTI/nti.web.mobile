import React from 'react';
import cx from 'classnames';

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

		slides: React.PropTypes.arrayOf(
			React.PropTypes.shape({
				endTime: React.PropTypes.number,
				startTime: React.PropTypes.number,
				image: React.PropTypes.string
			})),

		currentTime: React.PropTypes.number,

		onJumpTo: React.PropTypes.func,
		onSlideLoaded: React.PropTypes.func
	},


	getDefaultProps () {
		return {
			onJumpTo: () => {},
			onSlideLoaded: () => {}
		};
	},


	onJumpToCue (e) {
		e.preventDefault();
		this.props.onJumpTo(e.target.getAttribute('data-start-time'));
	},


	renderCues (cue) {
		const divider = null;
		const time = this.props.currentTime;

		const cs = cx({active: cue.startTime < time && time <= cue.endTime});

		//There is HTML escaped text in the cue, so we have to
		// use: "dangerouslySetInnerHTML={{__html: ''}}"
		return [
			divider, (
			<a href="#"
				data-start-time={cue.startTime.toFixed(3)}
				data-end-time={cue.endTime.toFixed(3)}
				className={cs}
				onClick={this.onJumpToCue}
				dangerouslySetInnerHTML={{__html: cue.text}}/>
		)];
	},


	renderSlide (slide) {
		let divider = null;
		let time = this.props.currentTime;

		const cs = cx('slide', {active: slide.startTime < time && time <= slide.endTime});

		return [
			divider, (
			<a href="#"
				data-start-time={slide.startTime.toFixed(3)}
				data-end-time={slide.endTime.toFixed(3)}
				className={cs}
				onClick={this.onJumpToCue}>
				<img src={slide.image} className="slide" onLoad={this.props.onSlideLoaded}/>
			</a>
		)];
	},


	renderItem (item) {
		return ('text' in item) ? this.renderCues(item) : this.renderSlide(item);
	},


	render () {
		const {cues = [], slides = [], children} = this.props;

		const items = cues.concat(slides).sort((a, b) => a.startTime - b.startTime);

		return (
			<div className="cues">
				{items.map(this.renderItem)}
				{children}
			</div>
		);
	}
});
