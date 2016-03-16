import React from 'react';

import NavigationBar from 'navigation/components/Bar';

import Communities from './containers/Communities';
import Courses from './containers/Courses';
import Books from './containers/Books';
import Features from './containers/Features';

export default function Root () {
	return (
		<div>
			<NavigationBar>
				<section position="left" className="branding">Logo</section>
			</NavigationBar>

			<Features/>

			<Communities/>

			<Courses/>

			<Courses admin/>

			<Books/>
		</div>
	);
}
