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

var DropCourseDialog = React.createClass({

	mixins: [NavigatableMixin],

	getInitialState: function() {
		return {
			loading: false,
			dropped: false
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
			this.setState({
				loading: false,
				dropped: true
			});
			// this.navigate('../', {replace: true});
		}
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
				<Notice>Drop {title}?</Notice>
				<div className="small-12 columns">
					<Button onClick={this._cancelClicked} className="small-5 columns">Cancel</Button>
					<Button onClick={this._confirmClicked} className="small-5 columns">Drop course</Button>
				</div>
			</div>
			
		);
	}

});

module.exports = DropCourseDialog;
