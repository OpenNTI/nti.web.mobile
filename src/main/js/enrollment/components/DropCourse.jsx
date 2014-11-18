/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Loading = require('common/components/Loading');
var Actions = require('../Actions');
var Constants = require('../Constants');
var Store = require('../Store');
var CatalogStore = require('library/catalog/Store');
var NTIID = require('dataserverinterface/utils/ntiids');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var PanelButton = require('common/components/PanelButton');
var DropOpen = require('./drop-widgets/DropOpen');
var DropStore = require('./drop-widgets/DropStore');
var DropFive = require('./drop-widgets/DropFive');
var t = require('common/locale').scoped('ENROLLMENT.BUTTONS');

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
		var result = [];
		var widgetMap = {
			OpenEnrollment: DropOpen,
			StoreEnrollment: DropStore,
			FiveminuteEnrollment: DropFive
		};
		enrollmentTypes.forEach(function(type) {
			var option = items[type];
			if (option.IsEnrolled) {
				var widget = widgetMap[type];
				if(!widget) {
					console.warn('Enrolled in an unrecognized/supported enrollment option? %O', option);
				}
				result.push(this.transferPropsTo(<widget courseTitle={this._getCourseTitle()} key={type} />));
			}
		}.bind(this));

		return result;
	},

	componentDidMount: function() {
		Store.addChangeListener(this._enrollmentChanged);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._enrollmentChanged);
	},

	_panel: function(body) {
		var catalogHref = "../../../../";
		return (
			<PanelButton href={catalogHref} linkText={t('viewCatalog')}>
				<p>{body}</p>
			</PanelButton>
		);
	},

	render: function() {

		console.debug('drop course render. %O', this.state);

		if (this.state.loading) {
			return <Loading />;
		}

		var title = this._getCourseTitle();
		
		if (this.state.dropped) {
			return this._panel(title + ' dropped.');
		}

		var dropWidgets = this._getDropWidgets();
		console.debug('dropWidgets %O', dropWidgets);
		if(dropWidgets.length === 0) {
			return this._panel('Unable to drop this course. (Perhaps you\'ve already dropped it?)');
		}
		return (
			<div>
				{dropWidgets}
			</div>
		);
	}

});

module.exports = DropCourseDialog;
