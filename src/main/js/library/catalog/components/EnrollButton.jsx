/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var EnrollmentOptions = require('../mixins/EnrollmentMixin');
var LoadingInline = require('common/components/LoadingInline');
var NTIID = require('dataserverinterface/utils/ntiids');
var Utils = require('common/Utils');
var buttonCss = "tiny button radius column";

/**
* Displays a link/button to enroll if enrollment options are
* available for the given catalog entry.
*/
var EnrollButton = React.createClass({

	mixins: [EnrollmentOptions],

	propTypes: {
		catalogEntry: React.PropTypes.object.isRequired,
		dropOnly: React.PropTypes.bool
	},

	_button: function() {

		if (this.canDrop(this.props.catalogEntry)) {
			// drop button
			var href = Utils.getBasePath() + 'library/catalog/item/' + NTIID.encodeForURI(this.props.catalogEntry.getID()) + '/enrollment/drop/';
			return <a href={href} className={buttonCss}>Drop This Course</a>;
		}

		if (!this.props.dropOnly && this.enrollmentOptions(this.props.catalogEntry).length > 0) {
			var href = this.makeHref('/enrollment/', true);
			return <a href={href} className={buttonCss}>Enroll</a>;
		}

		return null;
	},

	render: function() {

		if(!this.state.enrollmentStatusLoaded) {
			return (
				<div className="column text-center">
					<p>Checking enrollment status</p>
					<LoadingInline />
				</div>);
		}

		var button = this._button();
		if (button) {
			return <div className="row"><div className="cell small-12 columns">{button}</div></div>;
		}

		return null;
	}

});

module.exports = EnrollButton;
