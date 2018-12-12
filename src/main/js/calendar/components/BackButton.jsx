import React from 'react';

import {closeDialog} from '../../util';

export default function BackButton () {
	return (
		<div className="calendar-back-button" onClick={closeDialog}>Back</div>
	);
}
