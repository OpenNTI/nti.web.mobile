'use strict';

var React = require('react');
var t = require('common/locale').translate;

module.exports = React.createClass({
	displayName: 'Unknown',

	render: function() {
		console.debug('Input Type Missing: %s', this.props.item.MimeType);
		return (
			<div className="unknown part">

				<h4>{t('COMING_SOON.singular', {subject: 'This question type'})}</h4>

			</div>
		);
	}
});
