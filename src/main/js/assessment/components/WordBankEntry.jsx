import React from 'react';
import emptyFunction from 'react/lib/emptyFunction';
import {Draggable} from 'common/dnd';

import Content from './Content';

let {PropTypes} = React;

export default React.createClass({
	displayName: 'WordBankEntry',

	contextTypes: {
		QuestionUniqueDNDToken: PropTypes.object.isRequired
	},

	propTypes: {
		entry: PropTypes.object.isRequired,
		className: PropTypes.string,

		locked: PropTypes.bool,
		onReset: PropTypes.func
	},

	getDefaultProps () {
		return {
			onReset: emptyFunction,
			className: ''
		};
	},

	onResetClicked (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		if (!this.props.locked) {
			this.props.onReset(this.props.entry, this);
		}
	},

	render () {
		let {content, wid} = this.props.entry;
		let props = Object.assign({}, this.props, {entry: undefined});
		let {locked} = props;
		let classes = ['drag', 'source'];
		if (locked) {
			classes.push('locked');
		}

		return (
			<Draggable {...props} type={this.context.QuestionUniqueDNDToken} cancel=".reset" data-source={wid}>
				<div className={classes.join(' ')}>
					{!locked && (
						<a href="#" className="reset" title="Reset" onClick={this.onResetClicked}/>
					)}
					<Content content={content}/>
				</div>
			</Draggable>
		);
	}

});
