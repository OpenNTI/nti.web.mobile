/* eslint-env jest */
import React from 'react';
import ReactDOM from 'react-dom';
import {Date as DateUtils} from '@nti/lib-commons';
import {DateTime} from '@nti/web-commons';

import AssignmentStatusLabel from '../AssignmentStatusLabel';

import MockAssignment from './MockAssignment';
import MockAssignmentHistory from './MockAssignmentHistory';

const MockNoSubmitAssignment = (o) => MockAssignment(o, true);

const START = 'available_for_submission_beginning';
const END = 'available_for_submission_ending';

//We should refactor this to make the linter happy. React plans to remove findDOMNode...
// the linter is warning about deprecations, but thier isn't a suitable replacement yet.
const getNode = cmp => ReactDOM.findDOMNode(cmp); //eslint-disable-line

const getText = cmp => (getNode(cmp) || {}).textContent;

const EXPECTED_DAY_FORMAT = 'dddd, MMMM D';
const EXPECTED_DAYTIME_FORMAT = 'dddd, MMMM D h:mm A z';

describe('AssignmentStatusLabel', () => {

	let container = document.createElement('div');
	let newNode;

	document.body.appendChild(container);

	function bookkeeping () {
		beforeEach(()=> {
			newNode = document.createElement('div');
			document.body.appendChild(newNode);
		});

		afterEach(()=> {
			DateUtils.MockDate.uninstall();
			ReactDOM.unmountComponentAtNode(newNode);
			document.body.removeChild(newNode);
		});
	}


	function testRender (props) {
		//TODO: convert to async style. ReactDOM.render() return value is deprecated.
		return [
			ReactDOM.render(
				React.createElement(AssignmentStatusLabel, props),
				newNode
			),
			ReactDOM.render(
				React.createElement(AssignmentStatusLabel, props),
				container
			)
		];
	}

	afterAll(()=> {
		ReactDOM.unmountComponentAtNode(container);
		document.body.removeChild(container);
	});


	describe('Unpublished States', () => {

		bookkeeping();

		test('Unpublished', () => {
			const assignment = MockAssignment({
				[START]: '2014-08-16T05:00:00Z',
				[END]: '2015-08-29T04:59:59Z'
			});

			const value = 'Draft';
			const overtime = Object.assign(Object.create(assignment), {isOverTime: ()=> true});

			assignment.isPublished = () => false;

			testRender({assignment})
				.map(getText)
				.forEach(text => expect(text).toEqual(value));

			testRender({assignment: overtime})
				.map(getText)
				.forEach(text => expect(text).toEqual(value));
		});

	});

	describe('Unsubmitted States', () => {

		bookkeeping();

		test('Base Cases: overdue / overtime should not change until submitted.', () => {
			const assignment = MockAssignment({
				[START]: '2014-08-16T05:00:00Z',
				[END]: '2015-08-29T04:59:59Z'
			});
			const historyItem = MockAssignmentHistory(new Date('2015-08-29T05:00:00Z'));

			const due = DateTime.format(assignment.getDueDate(), EXPECTED_DAY_FORMAT);
			const completed = DateTime.format(historyItem.getCreatedTime(), EXPECTED_DAY_FORMAT);
			const value = `Due()${due}`;
			const overtime = Object.assign(Object.create(assignment), {isOverTime: ()=> true});

			testRender({assignment})
				.map(getText)
				.forEach(text => expect(text).toEqual(value));

			testRender({assignment: overtime})
				.map(getText)
				.forEach(text => expect(text).toEqual(value));

			testRender({assignment, historyItem})
				.map(getText)
				.forEach(text => expect(text).toEqual(`Completed(Overdue)${completed}`));

			testRender({assignment: overtime, historyItem})
				.map(getText)
				.forEach(text => expect(text).toEqual(`Completed(OvertimeOverdue)${completed}`));
		});


		test('Base Cases: Available verbage', () => {
			DateUtils.MockDate.install(new Date('2015-06-01T05:00:00Z'));
			const today = new Date('2015-06-01T18:00:00Z');
			const tomorrow = new Date('2015-06-02T05:00:00Z');
			const yesterday = new Date('2015-05-30T05:00:00Z');

			//Future assignment
			let assignment = MockAssignment({ [START]: tomorrow, [END]: void 0 });
			let time = DateTime.format(assignment.getAvailableForSubmissionBeginning(), EXPECTED_DAY_FORMAT);

			testRender({assignment})
				.map(getText)
				.forEach(text => expect(text).toEqual(`Available()${time}`));


			//Today assignment
			assignment = MockAssignment({ [START]: today, [END]: void 0 });
			let hours = DateTime.format(today, 'h:mm A z');

			testRender({assignment})
				.map(getText)
				.forEach(text => expect(text).toEqual(`Available()Today at ${hours}`));


			//past assignment, no due
			assignment = MockAssignment({ [START]: yesterday, [END]: void 0 });
			time = DateTime.format(assignment.getAvailableForSubmissionBeginning(), EXPECTED_DAY_FORMAT);

			testRender({assignment})
				.map(getText)
				.forEach(text => expect(text).toEqual('Available Now()'));

			//past assignment with due
			assignment = MockAssignment({ [START]: yesterday, [END]: tomorrow });
			let past = DateTime.format(assignment.getDueDate(), EXPECTED_DAY_FORMAT);

			testRender({assignment})
				.map(getText)
				.forEach(text => expect(text).toEqual(`Due()${past}`));



			//no submit
			assignment = MockNoSubmitAssignment({ [START]: tomorrow, [END]: void 0 });
			time = DateTime.format(assignment.getAvailableForSubmissionBeginning(), EXPECTED_DAY_FORMAT);
			testRender({assignment})
				.map(getText)
				.forEach(text => expect(text).toEqual(`Available()${time}`));
		});

	});


	describe('Overdue', () => {
		const assignment = MockAssignment({
			[START]: '2014-08-16T05:00:00Z',
			[END]: '2015-08-29T04:59:59Z'
		});
		const historyItem = MockAssignmentHistory(new Date('2015-08-29T05:00:00Z'));

		bookkeeping();


		test('Base Cases: overdue', () => {
			// const due = DateTime.format(assignment.getDueDate(), EXPECTED_DAY_FORMAT);
			const completed = DateTime.format(historyItem.getCreatedTime(), EXPECTED_DAY_FORMAT);
			const value = `Completed(Overdue)${completed}`;

			const [A, B] = testRender({assignment, historyItem});

			expect(getText(A)).toEqual(value);
			expect(getText(B)).toEqual(value);

		});


		test('Base Cases: should show time with date', () => {
			// const due = DateTime.format(assignment.getDueDate(), EXPECTED_DAYTIME_FORMAT);
			const completed = DateTime.format(historyItem.getCreatedTime(), EXPECTED_DAYTIME_FORMAT);
			const value = `Completed(Overdue)${completed}`;

			const [A, B] = testRender({assignment, historyItem, showTimeWithDate: true});

			expect(getText(A).trim()).toEqual(value);
			expect(getText(B).trim()).toEqual(value);

		});


		test('should contain an .info-part child element with an \'overdue\' class', () => {
			const [A, B] = testRender({assignment, historyItem});

			let infoPart = getNode(A).querySelector('.info-part');
			expect(infoPart.classList.contains('overdue')).toBe(true);

			infoPart = getNode(B).querySelector('.info-part');
			expect(infoPart.classList.contains('overdue')).toBe(true);

		});
	});
});
