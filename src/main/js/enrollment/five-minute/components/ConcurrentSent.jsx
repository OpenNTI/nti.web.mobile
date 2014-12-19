/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var PanelButton = require('common/components/PanelButton');
var t = require('common/locale').scoped('ENROLLMENT');

var ConcurrentSent = React.createClass({

	render: function() {
		return (
			
			<PanelButton href='../../../' linkText="Back">
				<h2>{t('concurrentThanksHead')}</h2>
				<p dangerouslySetInnerHTML={{__html: t('concurrentThanksBody')}} />
			</PanelButton>
		);
	}

});

module.exports = ConcurrentSent;
