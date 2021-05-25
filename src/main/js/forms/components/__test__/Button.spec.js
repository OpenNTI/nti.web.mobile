/* eslint-env jest */
/**
 * This is an example unit test for a React component. Tests should be placed in __test__ folders
 * along side the components/units they will be testing.
 */
import React from 'react';
import ReactDOM from 'react-dom';

import Button from '../Button';

describe('FooBar', () => {
	let container;
	let component;

	beforeEach(() => {
		container = document.createElement('div');
		container.id = 'content';
		document.body.appendChild(container);

		//TODO: update example to use ref callback since render()'s return value is deprecated.
		//eslint-disable-next-line react/no-render-return-value
		component = ReactDOM.render(
			React.createElement(Button, { href: '#' }, 'Test'),
			container
		);
	});

	afterEach(() => {
		ReactDOM.unmountComponentAtNode(container);
		document.body.removeChild(container);
	});

	test('should create a new instance of Button', () => {
		expect(component).toBeDefined();
		expect(container.textContent).toBe('Test');
	});

	test('should call preventDefault onClick', () => {
		let event = {
			preventDefault: () => {},
		};

		jest.spyOn(event, 'preventDefault');

		component.onClick(event);

		expect(event.preventDefault).toHaveBeenCalled();
	});
});
