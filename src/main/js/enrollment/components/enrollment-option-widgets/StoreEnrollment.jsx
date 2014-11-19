/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var requiredProps = require('./RequiredProps');
var PanelButton = require('common/components/PanelButton');
var FormattedPriceMixin = require('../../mixins/FormattedPriceMixin');
var t = require('common/locale').scoped('ENROLLMENT');

var StoreEnrollment = React.createClass({

	mixins: [FormattedPriceMixin],

	propTypes: requiredProps,

	render: function() {

		var option = this.props.enrollmentOption.option;
		var formattedPrice = this.getFormattedPrice(option.Currency, option.Price);

		return (
			<PanelButton href="store/" linkText='Enroll as a Lifelong Learner'>
				<h2>Lifelong Learner</h2>
				<p>Gain complete access to interact with all course content,
				including lectures, course materials, quizzes,
				and discussions once the class is in session.</p>
				<p className="price">{formattedPrice}</p>
				<small>{t('enrollmentNotRefundable')}</small>
			</PanelButton>
		);
	}

});

module.exports = StoreEnrollment;

