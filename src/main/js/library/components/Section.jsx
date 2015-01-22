'use strict';

var React = require('react/addons');

var IconBar = require('./IconBar');
var List = require('./List');
var Catalog = require('../catalog').View;

module.exports = React.createClass({
	displayName: 'Section',

	propTypes: {
		basePath: React.PropTypes.string.isRequired
	},

	_contentView: function(section) {
		switch (section) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case 'courses':
			case 'books':
				return (<List {...this.props} section={section}/>);

			case 'catalog':
				return (<Catalog {...this.props}/>);

			default:
				return (<div {...this.props}>Unknown section</div>);
		}
	},

	render: function() {
		return (
			<div>
				<IconBar {...this.props}/>
				{this._contentView(this.props.section)}
			</div>
		);
	}

});
