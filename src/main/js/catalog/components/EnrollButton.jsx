import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {encodeForURI} from 'nti-lib-ntiids';
import {scoped} from 'nti-lib-locale';
import {Loading, Mixins} from 'nti-web-commons';

import Button from 'forms/components/Button';
import EnrollmentOptions from 'enrollment/mixins/EnrollmentMixin';
import GiftOptions from 'enrollment/components/enrollment-option-widgets/GiftOptions';

const t = scoped('enrollment.buttons', {
	enroll: 'Enroll'
});


/**
 * Displays a link/button to enroll if enrollment options are
 * available for the given catalog entry.
 */
export default createReactClass({
	displayName: 'EnrollButton',
	mixins: [EnrollmentOptions, Mixins.BasePath],

	propTypes: {
		catalogEntry: PropTypes.object.isRequired,

		// this component is used on the course description view
		// within the course; we never want to show the enroll button there.
		dropOnly: PropTypes.bool
	},


	getEntryID () { return this.getEntry().getID(); },
	getEntry () {
		return this.props.catalogEntry;
	},


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
				<Button href={`${base}catalog/item/${entry}/enrollment/`} className="columns">{t('enroll')}</Button>
			);
		}

		return null;
	},

	giftButtons () {
		return <GiftOptions catalogEntry={this.getEntry()} />;
	},

	getButtons () {
		return [
			this.dropOrEnrollButton(),
			this.giftButtons()
		].filter(item => item !== null);
	},


	render () {

		if(!this.state.enrollmentStatusLoaded) {
			return (
				<div className="column text-center">
					<p>Checking enrollment status</p>
					<Loading.Whacky />
				</div>);
		}

		let buttons = this.getButtons();
		if (buttons.length > 0) {
			return React.createElement.apply(null, ['div', {}].concat(
				buttons.map((button, i)=> (
					<div key={i} className="row">
						<div className="cell small-12 columns">{button}</div>
					</div>
				))));
		}

		return null;
	}

});
