import React from 'react';
import CSS from 'react/lib/CSSCore';
import cx from 'classnames';

import C from 'common/components/Conditional';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import {Link} from 'react-router-component';

export default React.createClass({
	displayName: 'AnnotationBar',

	propTypes: {
		item: React.PropTypes.object,

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
		let range = void 0;
		try {
			let sel = window.getSelection();
			range = sel.getRangeAt(0);
			sel.removeAllRanges();
		}
		catch (e) {} //eslint-disable-line

		return range;
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

		if (!range) { return; }

		//we want the exit-animation to be different for this action
		// than the normal one, so we need an extra class.
		let dom = React.findDOMNode(this);
		CSS.addClass(dom.parentNode, 'swapping-modal');

		this.setState({busy: 'note'});
		this.props.onNewDiscussion(range);
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
			<div className="add annotation toolbar">
				{hightlighters}

				<C tag="button" condition={!!onRemoveHighlight}
					className={cx('ugd delete', {'busy': busy === 'delete'})}
					onClick={this.onUnHighlight}>Remove Hightlight</C>

				<C tag="span" condition={!!(onNewDiscussion || discussionLink)} className="spacer"/>

				<C tag="button" condition={!!onNewDiscussion}
					className="ugd note icon-discuss"
					onTouchStart={this.onNote}
					onClick={this.onNote}>Discuss</C>

				<C tag={Link} condition={!!discussionLink}
					className="ugd note icon-discuss"
					href={discussionLink}>View Discussion</C>
			</div>
		);
	}
});
