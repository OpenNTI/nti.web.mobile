'use strict';

var React = require('react/addons');
var Constants = require('../../Constants');
var NTIID = require('dataserverinterface/utils/ntiids');
var Link = require('react-router-component').Link;
/**
 * For lists of Topics, this is the row item.
 */
module.exports = React.createClass({
	displayName: 'TopicListItem',
	mixins: [require('./Mixin')],

	statics: {
		inputType: [
			Constants.types.TOPIC
		]
	},

	_href: function(item) {
		return (this.props.parentPath||'').concat(NTIID.encodeForURI(item.getID()),'/');
	},

	render: function() {
		var {item} = this.props;
		return (
			<Link href={this._href(item)}>
				<span className="title">{item.title} ({item.PostCount})</span>
				<span className="arrow-right" />
			</Link>
		);
	}
});
