import React from 'react/addons';
import EnrollmentOptions from 'enrollment/mixins/EnrollmentMixin';
import LoadingInline from 'common/components/LoadingInline';
import {encodeForURI} from 'dataserverinterface/utils/ntiids';
import ButtonFullWidth from 'common/forms/components/ButtonFullWidth';
import Giftable from 'enrollment/components/enrollment-option-widgets/Giftable';
import RedeemButton from 'enrollment/components/enrollment-option-widgets/RedeemButton';

import BasePathAware from 'common/mixins/BasePath';

/**
 * Displays a link/button to enroll if enrollment options are
 * available for the given catalog entry.
 */
export default React.createClass({
	displayName: 'EnrollButton',
	mixins: [EnrollmentOptions, BasePathAware],

	propTypes: {
		catalogEntry: React.PropTypes.object.isRequired,

		// this component is used on the course description view
		// within the course; we never want to show the enroll button there.
		dropOnly: React.PropTypes.bool
	},


	getEntryID () { return this.getEntry().getID(); },


	dropOrEnrollButton () {

		if (this.canDrop(this.getEntry())) {
			// drop button

			//ick... full path?!
			var href = this.getBasePath() + 'library/catalog/item/' + encodeForURI(this.getEntryID()) + '/enrollment/drop/';

			return <ButtonFullWidth href={href}>Drop This Course</ButtonFullWidth>;
		}

		if (!this.props.dropOnly && this.enrollmentOptions(this.getEntry()).length > 0) {
			var href = this.makeHref('/enrollment/', true);
			return <ButtonFullWidth href={href}>Enroll</ButtonFullWidth>;
		}

		return null;
	},


	giftButton () {
		if (this.hasGiftableEnrollmentOption(this.getEntry())) {
			return <Giftable catalogId={this.getEntryID()} fullWidth={true} />;
		}
		return null;
	},


	redeemButton () {
		var catalogId = this.getEntryID();
		if (this.hasGiftableEnrollmentOption(this.getEntry()) && !this.isEnrolled(this.getCourseId())) {
			return <RedeemButton catalogId={catalogId} fullWidth={true} />;
		}
		return null;
	},


	getButtons () {
		return [
			this.dropOrEnrollButton(),
			this.giftButton(),
			this.redeemButton()
		].filter(item => item !== null);
	},


	render () {

		if(!this.state.enrollmentStatusLoaded) {
			return (
				<div className="column text-center">
					<p>Checking enrollment status</p>
					<LoadingInline />
				</div>);
		}

		var buttons = this.getButtons();
		if (buttons.length > 0) {
			return React.createElement.apply(null, ['div', {}].concat(
					buttons.map(button=>
						<div className="row"><div className="cell small-12 columns">{button}</div></div>)));
		}

		return null;
	}

});
