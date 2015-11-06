import React from 'react';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import Loading from 'common/components/LoadingInline';
import Button from 'common/forms/components/Button';
import BasePathAware from 'common/mixins/BasePath';

import EnrollmentOptions from 'enrollment/mixins/EnrollmentMixin';
import Giftable from 'enrollment/components/enrollment-option-widgets/Giftable';
import RedeemButton from 'enrollment/components/enrollment-option-widgets/RedeemButton';



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
		const {state: {enrolled}, props: {dropOnly}} = this;
		const base = this.getBasePath();
		const entry = encodeForURI(this.getEntryID());

		if (this.canDrop(this.getEntry())) {
			return (
				<Button href={`${base}catalog/enroll/drop/${entry}/`} className="columns">Drop This Course</Button>
			);
		}

		if (!enrolled && !dropOnly && this.enrollmentOptions(this.getEntry()).length > 0) {
			return (
				<Button href={`${base}catalog/item/${entry}/enrollment/`} className="columns">Enroll</Button>
			);
		}

		return null;
	},


	giftButton () {
		if (this.hasGiftableEnrollmentOption(this.getEntry())) {
			return <Giftable catalogId={this.getEntryID()} className="columns" />;
		}
		return null;
	},


	redeemButton () {
		let catalogId = this.getEntryID();
		if (this.hasGiftableEnrollmentOption(this.getEntry()) && !this.isEnrolled(this.getCourseId())) {
			return <RedeemButton catalogId={catalogId} className="columns"/>;
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
					<Loading />
				</div>);
		}

		let buttons = this.getButtons();
		if (buttons.length > 0) {
			return React.createElement.apply(null, ['div', {}].concat(
					buttons.map(button=>
						<div className="row">
							<div className="cell small-12 columns">{button}</div>
						</div>
					)));
		}

		return null;
	}

});
