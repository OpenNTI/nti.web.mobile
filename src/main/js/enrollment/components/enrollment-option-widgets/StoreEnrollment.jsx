'use strict';

var React = require('react/addons');
var requiredProps = require('./RequiredProps');
var PanelButton = require('common/components/PanelButton');
var FormattedPriceMixin = require('../../mixins/FormattedPriceMixin');
var t = require('common/locale').scoped('ENROLLMENT');
var Giftable = require('./Giftable');

var StoreEnrollment = React.createClass({

	mixins: [FormattedPriceMixin],

	propTypes: requiredProps,

	statics: {
		re: /StoreEnrollment/i,
		handles: function (options) {
			return this.re.test(options && options.key);
		}
	},

	render: function() {

		var option = this.props.enrollmentOption.option;
		var formattedPrice = this.getFormattedPrice(option.Currency, option.Price);

		return (
			<PanelButton href="store/" linkText={t('enrollAsLifelongLearner')}>
				<h2>{t('storeEnrollmentTitle')}</h2>
				<p>Gain complete access to interact with all course content,
				including lectures, course materials, quizzes,
				and discussions once the class is in session.</p>
				<p className="price">{formattedPrice}</p>
				{this.props.isGiftable ? <Giftable href='store/gift/' /> : null }
				<small>{t('enrollmentNotRefundable')}</small>
			</PanelButton>
		);
	}

});

module.exports = StoreEnrollment;
