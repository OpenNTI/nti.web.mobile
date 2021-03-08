import React from 'react';

import { DarkMode, Theme } from '@nti/web-commons';

import LibraryView from './Home';

export default function View() {
	const background = Theme.useThemeProperty('library.background');

	return (
		<>
			{background === 'light' ? null : <DarkMode />}
			<LibraryView />
		</>
	);
}
