import React from 'react';
import ReactDOM from 'react-dom';

import AssignmentStatusLabel from '../AssignmentStatusLabel';
import MockAssignment from './MockAssignment';

// const history = getMockObject('application/vnd.nextthought.assessment.userscourseassignmenthistoryitem');

const getText = cmp => ReactDOM.findDOMNode(cmp).textContent;
const assignment = MockAssignment({
	'available_for_submission_beginning': '2014-08-16T05:00:00Z',
	'available_for_submission_ending': '2015-08-29T04:59:59Z'
});

fdescribe('AssignmentStatusLabel', () => {
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
		const A = ReactDOM.render(
			React.createElement(AssignmentStatusLabel, {assignment}),
			newNode
		);

		const B = ReactDOM.render(
			React.createElement(AssignmentStatusLabel, {assignment}),
			container
		);

		expect(getText(A)).toEqual('Due(OvertimeOverdue)Friday, August 28');
		expect(getText(B)).toEqual('Due(OvertimeOverdue)Friday, August 28');

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
