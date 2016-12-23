import React from 'react';
import ReactDOM from 'react-dom';

import moment from 'moment-timezone';
import jstz from 'jstimezonedetect';

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
	const tz = jstz.determine().name();

	let container = document.createElement('div');
	let newNode;

	document.body.appendChild(container);

	function bookkeeping () {
		beforeEach(()=> {
			newNode = document.createElement('div');
			document.body.appendChild(newNode);
		});

		afterEach(()=> {
			ReactDOM.unmountComponentAtNode(newNode);
			document.body.removeChild(newNode);
		});
	}


	function test (props) {
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

		it('Unpublished', () => {
			const assignment = MockAssignment({
				[START]: '2014-08-16T05:00:00Z',
				[END]: '2015-08-29T04:59:59Z'
			});

			const value = 'Draft';
			const overtime = Object.assign(Object.create(assignment), {isOverTime: ()=> true});

			assignment.isPublished = () => false;

			test({assignment})
				.map(getText)
				.forEach(text => expect(text).toEqual(value));

			test({assignment: overtime})
				.map(getText)
				.forEach(text => expect(text).toEqual(value));
		});

	});

	describe('Unsubmitted States', () => {

		bookkeeping();

		it('Base Cases: overdue / overtime should not change until submitted.', () => {
			const assignment = MockAssignment({
				[START]: '2014-08-16T05:00:00Z',
				[END]: '2015-08-29T04:59:59Z'
			});
			const historyItem = MockAssignmentHistory(new Date('2015-08-29T05:00:00Z'));

			const due = moment(assignment.getDueDate()).tz(tz).format(EXPECTED_DAY_FORMAT);
			const completed = moment(historyItem.getCreatedTime()).tz(tz).format(EXPECTED_DAY_FORMAT);
			const value = `Due()${due}`;
			const overtime = Object.assign(Object.create(assignment), {isOverTime: ()=> true});

			test({assignment})
				.map(getText)
				.forEach(text => expect(text).toEqual(value));

			test({assignment: overtime})
				.map(getText)
				.forEach(text => expect(text).toEqual(value));

			test({assignment, historyItem})
				.map(getText)
				.forEach(text => expect(text).toEqual(`Completed(Overdue)${completed}`));

			test({assignment: overtime, historyItem})
				.map(getText)
				.forEach(text => expect(text).toEqual(`Completed(OvertimeOverdue)${completed}`));
		});


		it('Base Cases: Available verbage', () => {
			jasmine.clock().mockDate(new Date('2015-06-01T05:00:00Z'));
			const today = new Date('2015-06-01T18:00:00Z');
			const tomorrow = new Date('2015-06-02T05:00:00Z');
			const yesterday = new Date('2015-05-30T05:00:00Z');

			//Future assignment
			let assignment = MockAssignment({ [START]: tomorrow, [END]: void 0 });
			let time = moment(assignment.getAvailableForSubmissionBeginning()).tz(tz).format(EXPECTED_DAY_FORMAT);

			test({assignment})
				.map(getText)
				.forEach(text => expect(text).toEqual(`Available()${time}`));


			//Today assignment
			assignment = MockAssignment({ [START]: today, [END]: void 0 });
			let hours = moment(today).tz(tz).format('h:mm A z');

			test({assignment})
				.map(getText)
				.forEach(text => expect(text).toEqual(`Available()Today at ${hours}`));


			//past assignment, no due
			assignment = MockAssignment({ [START]: yesterday, [END]: void 0 });
			time = moment(assignment.getAvailableForSubmissionBeginning()).tz(tz).format(EXPECTED_DAY_FORMAT);

			test({assignment})
				.map(getText)
				.forEach(text => expect(text).toEqual('Available Now()'));

			//past assignment with due
			assignment = MockAssignment({ [START]: yesterday, [END]: tomorrow });
			let past = moment(assignment.getDueDate()).tz(tz).format(EXPECTED_DAY_FORMAT);

			test({assignment})
				.map(getText)
				.forEach(text => expect(text).toEqual(`Due()${past}`));



			//no submit
			assignment = MockNoSubmitAssignment({ [START]: tomorrow, [END]: void 0 });
			time = moment(assignment.getAvailableForSubmissionBeginning()).tz(tz).format(EXPECTED_DAY_FORMAT);
			test({assignment})
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


		it('Base Cases: overdue', () => {
			// const due = moment(assignment.getDueDate()).tz(tz).format(EXPECTED_DAY_FORMAT);
			const completed = moment(historyItem.getCreatedTime()).tz(tz).format(EXPECTED_DAY_FORMAT);
			const value = `Completed(Overdue)${completed}`;

			const [A, B] = test({assignment, historyItem});

			expect(getText(A)).toEqual(value);
			expect(getText(B)).toEqual(value);

		});


		it('Base Cases: should show time with date', () => {
			// const due = moment(assignment.getDueDate()).tz(tz).format(EXPECTED_DAYTIME_FORMAT);
			const completed = moment(historyItem.getCreatedTime()).tz(tz).format(EXPECTED_DAYTIME_FORMAT);
			const value = `Completed(Overdue)${completed}`;

			const [A, B] = test({assignment, historyItem, showTimeWithDate: true});

			expect(getText(A).trim()).toEqual(value);
			expect(getText(B).trim()).toEqual(value);

		});


		it('should contain an .info-part child element with an \'overdue\' class', () => {
			const [A, B] = test({assignment, historyItem});

			let infoPart = getNode(A).querySelector('.info-part');
			expect(infoPart.classList.contains('overdue')).toBe(true);

			infoPart = getNode(B).querySelector('.info-part');
			expect(infoPart.classList.contains('overdue')).toBe(true);

		});
	});
});
