'use strict';

var React = require('react/addons');

var Store = require('../Store');

var AssignmentStatusLabel = require('./AssignmentStatusLabel');
var Grade = require('./Grade');

var TimedPlaceholder = require('./TimedPlaceholder');

var isEmpty = require('dataserverinterface/utils/isempty');

module.exports = React.createClass({
	displayName: 'HeaderAssignment',

	componentDidMount: function() {
		Store.addChangeListener(this.synchronizeFromStore);
	},


	componentWillUnmount: function() {
		Store.removeChangeListener(this.synchronizeFromStore);
	},


	componentWillReceiveProps: function(props) {
		this.synchronizeFromStore(props);
	},


	synchronizeFromStore: function() {
		this.forceUpdate();
	},


	isLate: function (date) {
		var a = this.props.assessment;
		var ot = a.isOverTime && a.isOverTime();
		return ot || a.isLate(date);
	},


	render: function() {
		var assignment = this.props.assessment;
		var item = Store.getAssignmentHistoryItem(assignment);

		if (assignment.IsTimedAssignment /*&& !assignment.isStarted()*/) {
			return (
				<TimedPlaceholder assignment={assignment}/>
			);
		}

		var nonSubmit = assignment.isNonSubmit();

		if (!item && !nonSubmit) {
			return null;
		}

		var grade = item && item.getGradeValue();
		var date = (item && item.getCreatedTime()) || new Date();

		var late = this.isLate(date);
		var state = late ? 'late' : nonSubmit ? '' : 'ontime';

		return (
			<div className={'header assessment assignment ' + state}>
				<div className="meta">
					<h4>{assignment.title}</h4>
					<AssignmentStatusLabel assignment={assignment} historyItem={item}/>
				</div>

				{isEmpty(grade) ? null : (
					<div className="grade-container">
						<h6>Assignment Grade</h6>
						<Grade value={grade}/>
					</div>
				)}
			</div>
		);
	}
});
