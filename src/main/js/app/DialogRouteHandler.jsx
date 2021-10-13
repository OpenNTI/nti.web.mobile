import './DialogRouteHandler.scss';

import { Prompt } from '@nti/web-commons';

const { Dialog } = Prompt;

export default function DialogRoute({ component: Content, ...props }) {
	return (
		<Dialog className="mobile-app-dialog-route">
			<Content {...props} />
		</Dialog>
	);
}
