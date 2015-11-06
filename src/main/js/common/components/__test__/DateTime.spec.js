import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import DateTime from '../DateTime';

const date = new Date('2015-10-22T21:00:00.000Z');
const relativeTo = new Date('2015-10-30T22:00:00.000Z'); //+1 day, and +1 hour

const getText = cmp => ReactDOM.findDOMNode(cmp).textContent;

describe('DateTime', () => {
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

	it('Base Cases: date only', () => {
		const A = ReactDOM.render(
			React.createElement(DateTime, {date}),
			newNode
		);

		const B = ReactDOM.render(
			React.createElement(DateTime, {date}),
			container
		);

		expect(getText(A)).toMatch(/October \d\d, 2015/);
		expect(getText(B)).toMatch(/October \d\d, 2015/);
	});


	it('Base Cases: date, relative to now', () => {
		const yesterday = moment().subtract(1, 'days');

		const A = ReactDOM.render(
			React.createElement(DateTime, {date: yesterday, relative: true}),
			newNode
		);

		const B = ReactDOM.render(
			React.createElement(DateTime, {date: yesterday, relative: true}),
			container
		);

		expect(getText(A)).toEqual('a day ago');
		expect(getText(B)).toEqual('a day ago');
	});

	it('Base Cases: date, relative to {Date}', () => {

		const A = ReactDOM.render(
			React.createElement(DateTime, {date, relative: true, relativeTo}),
			newNode
		);

		const B = ReactDOM.render(
			React.createElement(DateTime, {date, relative: true, relativeTo}),
			container
		);

		expect(getText(A)).toMatch(/\d days ago/);
		expect(getText(B)).toMatch(/\d days ago/);

	});

	it('relativeTo turns on relative', () => {

		const A = ReactDOM.render(
			React.createElement(DateTime, {date, relativeTo}),
			newNode
		);

		const B = ReactDOM.render(
			React.createElement(DateTime, {date, relativeTo}),
			container
		);

		expect(getText(A)).toMatch(/\d days ago/);
		expect(getText(B)).toMatch(/\d days ago/);

	});


	it('Base Cases: date, alternate format', () => {

		const format = '[year:] YYYY';

		const A = ReactDOM.render(
			React.createElement(DateTime, {date, format}),
			newNode
		);

		const B = ReactDOM.render(
			React.createElement(DateTime, {date, format}),
			container
		);

		expect(getText(A)).toMatch(/year: \d{4}/);
		expect(getText(B)).toMatch(/year: \d{4}/);
	});

	it('Base Cases: relative date, no suffix', () => {
		const yesterday = moment().subtract(1, 'days');

		const A = ReactDOM.render(
			React.createElement(DateTime, {date: yesterday, relative: true, suffix: false}),
			newNode
		);

		const B = ReactDOM.render(
			React.createElement(DateTime, {date: yesterday, relative: true, suffix: false}),
			container
		);

		expect(getText(A)).toEqual('a day');
		expect(getText(B)).toEqual('a day');
	});

	it('Base Cases: relative date, custom suffix', () => {
		const yesterday = moment().subtract(1, 'days');

		const A = ReactDOM.render(
			React.createElement(DateTime, {date: yesterday, relative: true, suffix: ' bananas'}),
			newNode
		);

		const B = ReactDOM.render(
			React.createElement(DateTime, {date: yesterday, relative: true, suffix: ' bananas'}),
			container
		);

		expect(getText(A)).toEqual('a day bananas');
		expect(getText(B)).toEqual('a day bananas');
	});

	it('Base Cases: date, prefix', () => {
		const yesterday = moment(date).subtract(1, 'days');

		const A = ReactDOM.render(
			React.createElement(DateTime, {date: yesterday, prefix: 'toast '}),
			newNode
		);

		const B = ReactDOM.render(
			React.createElement(DateTime, {date: yesterday, prefix: 'toast '}),
			container
		);

		expect(getText(A)).toMatch(/toast October \d+, 2015/);
		expect(getText(B)).toMatch(/toast October \d+, 2015/);

	});

	it('Base Cases: date, showToday', () => {
		const now = new Date();

		const A = ReactDOM.render(
			React.createElement(DateTime, {date: now, showToday: true}),
			newNode
		);

		const B = ReactDOM.render(
			React.createElement(DateTime, {date: now, showToday: true}),
			container
		);

		expect(getText(A)).toEqual('Today');
		expect(getText(B)).toEqual('Today');
	});

	it('Base Cases: date, showToday, custom message', () => {
		const now = new Date();
		const todayText = 'coffee';

		const A = ReactDOM.render(
			React.createElement(DateTime, {date: now, showToday: true, todayText}),
			newNode
		);

		const B = ReactDOM.render(
			React.createElement(DateTime, {date: now, showToday: true, todayText}),
			container
		);

		expect(getText(A)).toEqual(todayText);
		expect(getText(B)).toEqual(todayText);
	});


	it('todayText turns on showToday', () => {
		const todayText = 'coffee';
		const now = new Date();

		const A = ReactDOM.render(
			React.createElement(DateTime, {date: now, todayText}),
			newNode
		);

		const B = ReactDOM.render(
			React.createElement(DateTime, {date: now, todayText}),
			container
		);

		expect(getText(A)).toEqual(todayText);
		expect(getText(B)).toEqual(todayText);
	});

});
