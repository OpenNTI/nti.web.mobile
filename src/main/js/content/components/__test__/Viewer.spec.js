import React from 'react';
import ReactDOM from 'react-dom';
import {Locations, Location} from 'react-router-component';

import Viewer from '../Viewer';

xdescribe('Content Viewer', ()=> {
	let container;

	beforeEach(()=> {
		container = document.createElement('div');
		container.id = 'content';
		document.body.appendChild(container);
	});

	afterEach(()=> {
		ReactDOM.unmountComponentAtNode(container);
		document.body.removeChild(container);
	});

	function renderReaderAtPage (page) {
		ReactDOM.render(
			<Locations path={page}>
				<Location path="/:rootId" handler={Viewer}/>
			</Locations>,
			container
		);
	}

	describe('Router Behavior', () => {

		it('should understand special routes', () => {

			renderReaderAtPage('/foo');

		});

	});

	describe('Context / Pager', () => {

		it('should have the correct context', () => {

		});

	});

});
