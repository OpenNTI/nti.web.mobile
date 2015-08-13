import React from 'react';
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
		if (e.type === 'click') {
			e.preventDefault();
			e.stopPropagation();
		}

		if (this.isBusy()) { return; }

		let c = e.target.getAttribute('data-color');
		c = c && c.toLowerCase();

		this.setState({busy: c});
		this.props.onSetHighlight(this.getRange(), c);
	},


	onUnHighlight (e) {
		e.preventDefault();
		e.stopPropagation();

		if (this.isBusy()) { return; }

		this.setState({busy: 'delete'});
		this.props.onRemoveHighlight(this.getRange());
	},


	onNote (e) {
		e.preventDefault();
		e.stopPropagation();

		if (this.isBusy()) { return; }

		this.props.onNewDiscussion(this.getRange());
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

		return (
			<div className="add annotation toolbar">
				{hightlighters}
				<C tag="button" condition={onRemoveHighlight} className={cx('ugd delete', {'busy': busy === 'delete'})} onClick={this.onUnHighlight}>Remove Hightlight</C>
				<C tag="span" condition={onNewDiscussion || discussionLink} className="spacer"/>
				<C tag="button" condition={onNewDiscussion} className="ugd note icon-discuss" onClick={this.onNote}>Discuss</C>
				<C tag={Link} condition={discussionLink} className="ugd note icon-discuss" href={discussionLink}>View Discussion</C>
			</div>
		);
	}
});
