import React from 'react';
import ReactDOM from 'react-dom';

import moment from 'moment-timezone';
import jstz from 'jstimezonedetect';

import AssignmentStatusLabel from '../AssignmentStatusLabel';
import MockAssignment from './MockAssignment';

// const history = getMockObject('application/vnd.nextthought.assessment.userscourseassignmenthistoryitem');

const getText = cmp => ReactDOM.findDOMNode(cmp).textContent;
const assignment = MockAssignment({
	'available_for_submission_beginning': '2014-08-16T05:00:00Z',
	'available_for_submission_ending': '2015-08-29T04:59:59Z'
});


const EXPECTED_DAY_FORMAT = 'dddd, MMMM D';
const EXPECTED_DAYTIME_FORMAT = 'dddd, MMMM D h:mm A z';

describe('AssignmentStatusLabel', () => {
	const tz = jstz.determine().name();

	let container = document.createElement('div');
	let newNode;

	document.body.appendChild(container);

	beforeEach(()=> {
		newNode = document.createElement('div');
		document.body.appendChild(newNode);
	});

	afterEach(()=> {
		ReactDOM.unmountComponentAtNode(newNode);
		document.body.removeChild(newNode);
	});


	it('Base Cases: overdue', () => {
		const due = moment(assignment.getDueDate()).tz(tz).format(EXPECTED_DAY_FORMAT);
		const value = `Due(Overdue)${due}`;

		const A = ReactDOM.render(
			React.createElement(AssignmentStatusLabel, {assignment}),
			newNode
		);

		const B = ReactDOM.render(
			React.createElement(AssignmentStatusLabel, {assignment}),
			container
		);

		expect(getText(A)).toEqual(value);
		expect(getText(B)).toEqual(value);

	});


	it('Base Cases: should show time with date', () => {
		const due = moment(assignment.getDueDate()).tz(tz).format(EXPECTED_DAYTIME_FORMAT);
		const value = `Due(Overdue)${due}`;

		const A = ReactDOM.render(
			React.createElement(AssignmentStatusLabel, {assignment, showTimeWithDate: true}),
			newNode
		);

		const B = ReactDOM.render(
			React.createElement(AssignmentStatusLabel, {assignment, showTimeWithDate: true}),
			container
		);

		expect(getText(A).trim()).toEqual(value);
		expect(getText(B).trim()).toEqual(value);

	});



	it('should contain an .info-part child element with an \'overdue\' class', () => {
		const A = ReactDOM.render(
			React.createElement(AssignmentStatusLabel, {assignment}),
			newNode
		);

		const B = ReactDOM.render(
			React.createElement(AssignmentStatusLabel, {assignment}),
			container
		);

		let infoPart = ReactDOM.findDOMNode(A).querySelector('.info-part');
		expect(infoPart.classList.contains('overdue')).toBe(true);

		infoPart = ReactDOM.findDOMNode(B).querySelector('.info-part');
		expect(infoPart.classList.contains('overdue')).toBe(true);

	});
});
