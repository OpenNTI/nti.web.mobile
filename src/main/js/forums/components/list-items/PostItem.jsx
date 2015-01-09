/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Constants = require('../../Constants');
var Avatar = require('common/components/Avatar');
var DateTime = require('common/components/DateTime');
var DisplayName = require('common/components/DisplayName');

module.exports = React.createClass({

	displayName: 'PostListItem',
	mixins: [require('./Mixin')],

	statics: {
		inputType: [
			Constants.types.POST
		]
	},

	render: function() {
		var {item} = this.props;

		return (
			<div>
				
				<Avatar username={item.Creator} width="32" height="32"/>
				<div className="wrap">
					<DisplayName username={item.Creator}/>
					<div dangerouslySetInnerHTML={{__html: item.body}}/>
					<DateTime date={item.created} />
				</div>
			</div>
		);

	}

});
