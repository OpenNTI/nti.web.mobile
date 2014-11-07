/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Button = require('common/components/forms/Button');
var Loading = require('common/components/Loading');
var Redirect = require('common/components/Redirect');
var Actions = require('../Actions');
var Constants = require('../Constants');
var Store = require('../Store');
var CatalogStore = require('library/catalog/Store');
var NTIID = require('dataserverinterface/utils/ntiids');
var NavigatableMixin = require('common/mixins/NavigatableMixin');

var DropCourseDialog = React.createClass({

	mixins: [NavigatableMixin],

	getInitialState: function() {
		return {
			loading: false
		};
	},

	_cancelClicked: function() {
		console.debug('dialog button clicked.');
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
		if (action.actionType === Constants.DROP_COURSE && action.courseId === this.props.courseId) {
			// navigate to catalog entry?
			console.debug('dropped.');
			this.navigate('../', {replace: true});
		}
	},

	componentDidMount: function() {
		Store.addChangeListener(this._enrollmentChanged);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._enrollmentChanged);
	},

	render: function() {

		if (this.state.redirect) {
			return <Redirect location={'/catalog/item/' + this.props.entryId} />
		}

		if (this.state.loading) {
			return <Loading />;
		}

		var title = this._getCourseTitle();

		return (
			<div className='confirmation dialog row'>
				<p className="small-12 columns">Drop {title}?</p>
				<div className="small-12 columns">
					<Button onClick={this._cancelClicked} className="small-5 columns">Cancel</Button>
					<Button onClick={this._confirmClicked} className="small-5 columns">Drop course</Button>
				</div>
			</div>
		);
	}

});

module.exports = DropCourseDialog;
