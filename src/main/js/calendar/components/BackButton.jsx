import './BackButton.scss';

import { closeDialog } from '../../util';

export default function BackButton() {
	return (
		<div className="calendar-back-button" onClick={closeDialog}>
			<i className="icon-chevron-left" /> Back
		</div>
	);
}
