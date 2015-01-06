'use strict';

var React = require('react/addons');
var emptyFunction = require('react/lib/emptyFunction');
var {PropTypes} = React;
var {Draggable} = require('common/dnd');

var Content = require('./Content');

module.exports = React.createClass({

	contextTypes: {
		QuestionUniqueDNDToken: PropTypes.object.isRequired
	},

	propTypes: {
		entry: PropTypes.object.isRequired,
		className: PropTypes.string
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
		var {content,wid} = this.props.entry;
		var props = Object.assign({}, this.props, {entry: undefined});
		var {locked} = props;
		var classes = ['drag','source'];
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
