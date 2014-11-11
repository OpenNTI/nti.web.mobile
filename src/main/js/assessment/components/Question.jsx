/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var isFlag = require('common/Utils').isFlag;

var Part = require('./Part');

module.exports = React.createClass({
	displayName: 'Question',

	propTypes: {
		question: React.PropTypes.object
	},


	render: function() {
		var q = this.props.question || {};
		var parts = q.parts || [];
		var title = '';
		var status = '';

		console.log(this.props);

		if (isFlag('mathcounts-question-number-hack')) {
			//HACK: there should be a more correct way to get the problem name/number...
			title = q.getID().split('.').pop() + '. ';
		}

		return (
			<div className={'question ' + status.toLowerCase()}>
				<h3 className="question-title">{title}{status}</h3>
				<div className="question-content" dangerouslySetInnerHTML={{__html: q.content}}/>
				{parts.map(function(part, i) {
					return Part({key: 'part-'+i, part: part, index: i, partCount: parts.length});
				})}
			</div>
		);
	}
});
