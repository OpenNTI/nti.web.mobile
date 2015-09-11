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
					<section position="left" className="branding">Logo</section>
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
