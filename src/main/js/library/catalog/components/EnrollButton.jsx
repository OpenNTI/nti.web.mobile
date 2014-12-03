/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var EnrollmentOptions = require('../mixins/EnrollmentMixin');
var LoadingInline = require('common/components/LoadingInline');
var NTIID = require('dataserverinterface/utils/ntiids');
var Utils = require('common/Utils');
var ButtonFullWidth = require('common/forms/components/ButtonFullWidth');
var Giftable = require('enrollment/components/enrollment-option-widgets/Giftable');

/**
* Displays a link/button to enroll if enrollment options are
* available for the given catalog entry.
*/
var EnrollButton = React.createClass({

	mixins: [EnrollmentOptions],

	propTypes: {
		catalogEntry: React.PropTypes.object.isRequired,

		// this component is used on the course description view
		// within the course; we never want to show the enroll button there.
		dropOnly: React.PropTypes.bool 
	},

	_dropOrEnrollButton: function() {

		if (this.canDrop(this.props.catalogEntry)) {
			// drop button
			var href = Utils.getBasePath() + 'library/catalog/item/' + NTIID.encodeForURI(this.props.catalogEntry.getID()) + '/enrollment/drop/';
			return <ButtonFullWidth href={href}>Drop This Course</ButtonFullWidth>;
		}

		if (!this.props.dropOnly && this.enrollmentOptions(this.props.catalogEntry).length > 0) {
			var href = this.makeHref('/enrollment/', true);
			return <ButtonFullWidth href={href}>Enroll</ButtonFullWidth>;
		}

		return null;
	},

	_giftButton: function() {
		if (this.hasGiftableEnrollmentOption(this.props.catalogEntry)) {
			return <Giftable catalogId={this.props.catalogEntry.getID()} />;
		}
		return null;
	},

	_buttons: function() {
		return [this._dropOrEnrollButton(), this._giftButton()].filter(function(item) {
			return item !== null;
		});
	},

	render: function() {

		if(!this.state.enrollmentStatusLoaded) {
			return (
				<div className="column text-center">
					<p>Checking enrollment status</p>
					<LoadingInline />
				</div>);
		}

		var buttons = this._buttons();
		if (buttons.length > 0) {
			return (<div>
				{
					buttons.map(function(button) {
						return <div className="row"><div className="cell small-12 columns">{button}</div></div>;
					}.bind(this))
				}
			</div>);
		}
		return null;
	}

});

module.exports = EnrollButton;
