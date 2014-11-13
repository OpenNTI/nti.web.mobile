/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Button = require('common/components/forms/Button');
var Loading = require('common/components/Loading');
var Actions = require('../Actions');
var Constants = require('../Constants');
var Store = require('../Store');
var CatalogStore = require('library/catalog/Store');
var NTIID = require('dataserverinterface/utils/ntiids');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var Notice = require('common/components/Notice');
var DropOpen = require('./drop-widgets/DropOpen');
var DropStore = require('./drop-widgets/DropStore');
var DropFive = require('./drop-widgets/DropFive');

var DropCourseDialog = React.createClass({

	mixins: [NavigatableMixin],

	getInitialState: function() {
		return {
			loading: false,
			dropped: false
		};
	},

	_cancelClicked: function() {
		history.back();
	},

	_confirmClicked: function() {
		this.setState({
			loading: true
		});
		Actions.dropCourse(this.props.courseId);
	},

	_getCourseTitle: function() {
		var entryId = NTIID.decodeFromURI(this.props.entryId);
		var entry = CatalogStore.getEntry(entryId);
		return entry.Title;
	},

	_enrollmentChanged: function(event) {
		var action = event.action||{};
		if (action.type === Constants.DROP_COURSE && action.courseId === this.props.courseId) {
			this.setState({
				loading: false,
				dropped: true
			});
			// this.navigate('../', {replace: true});
		}
	},

	/**
	* return the appropriate widget for each enrollment option.
	* this will (almost?) always return a single widget, as
	* it's unlikely that the user is enrolled in more than
	* one option for a given course.
	*/
	_getDropWidgets: function() {
		var entryId = NTIID.decodeFromURI(this.props.entryId);
		var entry = CatalogStore.getEntry(entryId);
		var items = entry.EnrollmentOptions.Items;
		var enrollmentTypes = Object.keys(items);
		return enrollmentTypes.map(function(type) {
			var widget = null;
			var option = items[type];
			if (option.IsEnrolled) {
				switch (type) {
					case 'OpenEnrollment':
						widget = DropOpen;
					break;
					
					case 'StoreEnrollment':
						widget = DropStore;
					break;

					case 'FiveminuteEnrollment':
						widget = DropFive;
					break;

					default:
						console.warn('Enrolled in an unrecognized/supported enrollment option? %O', option);

				}
			}
			return widget ? this.transferPropsTo(<widget courseTitle={this._getCourseTitle()} />) : widget;
		}.bind(this));
	},

	componentDidMount: function() {
		Store.addChangeListener(this._enrollmentChanged);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._enrollmentChanged);
	},

	render: function() {

		if (this.state.loading) {
			return <Loading />;
		}

		var title = this._getCourseTitle();

		if (this.state.dropped) {
			return (
				<div>
					<Notice>{title} dropped</Notice>
					<div className="column">
						<Button href='../../../../' className="tiny button radius small-12 columns">View Catalog</Button>
					</div>
				</div>
			);
		}

		return (
			<div>
				{this._getDropWidgets()}
			</div>
		);
	}

});

module.exports = DropCourseDialog;
