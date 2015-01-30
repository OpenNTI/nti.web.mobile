'use strict';

var React = require('react/addons');

var _t = require('common/locale').translate;

module.exports = React.createClass({
	displayName: 'LocalizedHTML',

	propTypes: {
		stringId: React.PropTypes.string.isRequired,
		scoped: React.PropTypes.string,
		tag: React.PropTypes.string
	},


	getDefaultProps: function() {
		return {
			tag: 'div',
			scoped: ''
		};
	},


	render: function() {
		var _t2 = _t.scoped(this.props.scoped);
		var Tag = this.props.tag;

		return (
			<Tag className={this.props.className} dangerouslySetInnerHTML={{__html: _t2(this.props.stringId, this.props)}} />
		);
	}
});
