import React from 'react';

import NavigationBar from 'navigation/components/Bar';

import Communuty from './containers/Community';
import Courses from './containers/Courses';
import Books from './containers/Books';
import Features from './containers/Features';

export default React.createClass({
	displayName: 'Root',

	render () {
		return (
			<div>
				<NavigationBar>
					<div position="left" className="branding">[Branding]</div>
				</NavigationBar>

				<Features/>

				<Communuty/>

				<Courses/>

				<Courses admin/>

				<Books/>
			</div>
		);
	}
});
