import './AnnotationBar.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import isTouch from '@nti/util-detection-touch';
import {addClass} from '@nti/lib-dom';
import Logger from '@nti/util-logger';
import {encodeForURI} from '@nti/lib-ntiids';
import {Link} from 'react-router-component';

const logger = Logger.get('content:components:AnnotationBar');

const stop = e => (e.preventDefault(),e.stopPropagation());


export default class AnnotationBar extends React.Component {

	static propTypes = {
		item: PropTypes.object,
		range: PropTypes.object,
		onNewDiscussion: PropTypes.func,
		onSetHighlight: PropTypes.func,
		onRemoveHighlight: PropTypes.func
	}

	state = {}


	componentDidUpdate () {
		const {item} = this.props;
		const {busy} = this.state;

		if (item && item.highlightColorName === busy) {
			this.setState({
				busy: null
			});
		}
	}

	getRange = () => {
		try {
			const selection = window.getSelection();
			const {item, range} = this.props;

			return item ? item.getRange() :
				selection.rangeCount > 0
					? selection.getRangeAt(0)
					: range;
		}
		catch (e) {
			logger.error('Error getting range: %o', e.stack || e.message || e);
		}
	}


	isBusy = () => {
		return !!this.state.busy;
	}


	onHighlight = (e) => {
		if (this.isBusy()) { return; }

		let range = this.getRange();

		if (!range) { return; }

		let c = e.target.getAttribute('data-color');
		c = c && c.toLowerCase();

		this.setState({busy: c});
		this.props.onSetHighlight(range, c);
	}


	onUnHighlight = () => {
		if (this.isBusy()) { return; }

		this.setState({busy: 'delete'});
		this.props.onRemoveHighlight(this.getRange());
	}


	onNote = () => {
		if (this.isBusy()) { return; }

		let range = this.getRange();

		if (!range && !this.props.item) { return; }

		//we want the exit-animation to be different for this action
		// than the normal one, so we need an extra class.
		const {current: dom} = this.ref;
		addClass(dom.parentNode, 'swapping-modal');

		this.setState({busy: 'note'});
		this.props.onNewDiscussion(range);
	}

	ref = React.createRef()

	render () {
		const {
			state: {busy},
			props: {onNewDiscussion, onSetHighlight, onRemoveHighlight}
		} = this;

		let {item} = this.props;
		let discussionLink;

		if (item) {
			if (item.isNote) {
				discussionLink = `/discussions/${encodeForURI(item.id)}/`;
			}
			item = item.highlightColorName;
		}

		const hightlighters = onSetHighlight && ['Yellow', 'Green', 'Blue'].map(x => (
			<Button key={x} data-color={x}
				className={cx('ugd highlight', x.toLowerCase(), {
					'selected': (item === x.toLowerCase() && !busy) || busy === x.toLowerCase(),
					'busy': busy === x.toLowerCase()
				})}
				onClick={this.onHighlight}>Highlight</Button>
		));

		return (
			<div className="add annotation toolbar" ref={this.ref}>
				{hightlighters}

				{!!onRemoveHighlight && (
					<Button className={cx('ugd delete', {'busy': busy === 'delete'})}
						onClick={this.onUnHighlight}>
						Remove Hightlight
					</Button>
				)}

				{!!(onNewDiscussion || discussionLink) && (
					<span className="spacer"/>
				)}

				{!!onNewDiscussion && (
					<Button className="ugd note"
						onClick={this.onNote}><i className="icon-discuss small"/>Discuss</Button>
				)}

				{!!discussionLink && (
					<Link className="ugd note"
						href={discussionLink}><i className="icon-discuss small"/>View Discussion</Link>
				)}
			</div>
		);
	}
}


// Why both onTouchStart and onClick? Because the selection is gone before onClick fires on
// iOS, and I believe all touch devices. So, where we get onTouchStart, treat that as the click,
// and fallback to onClick so we can read the selection before it goes away.
Button.propTypes = { onClick: PropTypes.func };
function Button ({onClick, ...props}) {

	const event = isTouch ? 'onTouchStart' : 'onClick';

	const click = {
		[event]: onClick
	};

	if (click.onTouchStart) {
		click.onClick = stop;
	}

	return (
		<button {...props} {...click}/>
	);
}
