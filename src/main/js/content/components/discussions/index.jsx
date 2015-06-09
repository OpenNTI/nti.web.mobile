import React from 'react';

import {Locations, Location} from 'react-router-component';

import List from './List';

/**
 * This Router layer exsists to provide abstraction to routers and link generations.
 *
 * Without this we have to bake in too much knowledge into the parent Viewer component's mock-router.
 */
export default React.createClass({
	displayName: 'content:discussions',

	render () {
		return (
			<Locations contextual>
				<Location path="/(:itemId)(/*)" handler={List} {...this.props}/>
			</Locations>
		);
	}
});
