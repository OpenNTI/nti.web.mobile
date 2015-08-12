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


	getRange () {
		return window.getSelection().getRangeAt(0);
	},


	onHighlight (e) {
		e.preventDefault();
		e.stopPropagation();

		let c = e.target.getAttribute('data-color');
		c = c && c.toLowerCase();

		this.props.onSetHighlight(this.getRange(), c);
	},


	onUnHighlight (e) {
		e.preventDefault();
		e.stopPropagation();

		this.props.onRemoveHighlight(this.getRange());
	},


	onNote (e) {
		e.preventDefault();
		e.stopPropagation();
		this.props.onNewDiscussion(this.getRange());
	},


	render () {
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
				className={cx('ugd highlight', x.toLowerCase(), {'selected': item === x.toLowerCase()})}
				onClick={this.onHighlight}>Highlight</button> ));

		return (
			<div className="add annotation toolbar">
				{hightlighters}
				<C tag="button" condition={onRemoveHighlight} className="ugd delete" onClick={this.onUnHighlight}>Remove Hightlight</C>
				<C tag="span" condition={onNewDiscussion || discussionLink} className="spacer"/>
				<C tag="button" condition={onNewDiscussion} className="ugd note icon-discuss" onClick={this.onNote}>Discuss</C>
				<C tag={Link} condition={discussionLink} className="ugd note icon-discuss" href={discussionLink}>View Discussion</C>
			</div>
		);
	}
});
