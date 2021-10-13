
import { useBasePath } from '@nti/web-routing';

import { enrollmentHref } from './utils';

export default function EnrolledOpen({ catalogEntry }) {
	const basePath = useBasePath();
	const href = enrollmentHref(basePath, catalogEntry);
	return (
		<div className="enrollment-status-open">
			<div className="status">
				<span className="registered">You are registered</span>
				<a href={href} className="edit">
					Edit
				</a>
			</div>
		</div>
	);
}
