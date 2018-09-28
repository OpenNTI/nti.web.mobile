import React from 'react';
import {DarkMode} from '@nti/web-commons';

import LibraryView from './Home';


export default function View () {

	return (
		<>
			<DarkMode/>
			<LibraryView/>
		</>
	);
}
