import React from 'react';
import cx from 'classnames';

import {addClass} from 'nti-lib-dom';
import Logger from 'nti-util-logger';
import {encodeForURI} from 'nti-lib-ntiids';

import {Link} from 'react-router-component';

const logger = Logger.get('content:components:AnnotationBar');

export default React.createClass({
	displayName: 'AnnotationBar',

	propTypes: {
		item: React.PropTypes.object,
		range: React.PropTypes.object,
		onNewDiscussion: React.PropTypes.func,
		onSetHighlight: React.PropTypes.func,
		onRemoveHighlight: React.PropTypes.func
	},


	getInitialState () {
		return {};
	},


	componentWillReceiveProps () {
		this.replaceState(this.getInitialState());
	},


	getRange () {
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
	},


	isBusy () {
		return !!this.state.busy;
	},


	onHighlight (e) {
		if (this.isBusy()) { return; }

		let range = this.getRange();

		if (!range) { return; }

		let c = e.target.getAttribute('data-color');
		c = c && c.toLowerCase();

		this.setState({busy: c});
		this.props.onSetHighlight(range, c);
	},


	onUnHighlight () {
		if (this.isBusy()) { return; }

		this.setState({busy: 'delete'});
		this.props.onRemoveHighlight(this.getRange());
	},


	onNote () {
		if (this.isBusy()) { return; }

		let range = this.getRange();

		if (!range && !this.props.item) { return; }

		//we want the exit-animation to be different for this action
		// than the normal one, so we need an extra class.
		const {el: dom} = this;
		addClass(dom.parentNode, 'swapping-modal');

		this.setState({busy: 'note'});
		this.props.onNewDiscussion(range);
	},


	attachRef (el) {
		this.el = el;
	},


	render () {
		let {busy} = this.state;
		let {item, onNewDiscussion, onSetHighlight, onRemoveHighlight} = this.props;
		let discussionLink;

		if (item) {
			if (item.isNote) {
				discussionLink = `/discussions/${encodeForURI(item.id)}/`;
			}
			item = item.highlightColorName;
		}

		let hightlighters = onSetHighlight && ['Yellow', 'Green', 'Blue'].map(x => (
			<button key={x} data-color={x}
				className={cx('ugd highlight', x.toLowerCase(), {
					'selected': (item === x.toLowerCase() && !busy) || busy === x.toLowerCase(),
					'busy': busy === x.toLowerCase()
				})}
				onTouchStart={this.onHighlight}
				onClick={this.onHighlight}>Highlight</button> ));

			// Why both onTouchStart and onClick? Because the selection is gone before onClick fires on
			// iOS, and I believe all touch devices. So, where we get onTouchStart, treat that as the click,
			// and fallback to onClick so we can read the selection before it goes away.

		return (
			<div className="add annotation toolbar" ref={this.attachRef}>
				{hightlighters}

				{!!onRemoveHighlight && (
					<button className={cx('ugd delete', {'busy': busy === 'delete'})}
						onClick={this.onUnHighlight}>
						Remove Hightlight
					</button>
				)}

				{!!(onNewDiscussion || discussionLink) && (
					<span className="spacer"/>
				)}

				{!!onNewDiscussion && (
					<button className="ugd note"
						onTouchStart={this.onNote}
						onClick={this.onNote}><i className="icon-discuss small"/>Discuss</button>
				)}

				{!!discussionLink && (
					<Link className="ugd note"
						href={discussionLink}><i className="icon-discuss small"/>View Discussion</Link>
				)}
			</div>
		);
	}
});
