
import { DateTime } from '@nti/web-commons';
import { useBasePath } from '@nti/web-routing';

import { enrollmentHref } from './utils';

export default function EnrolledForCredit({ catalogEntry }) {
	const basePath = useBasePath();
	const href = enrollmentHref(basePath, catalogEntry);
	return (
		<div className="enrollment-status-credit">
			<div>
				<div className="heading">You’re Enrolled for credit</div>
				<div className="content">
					Class begins <DateTime date={catalogEntry.getStartDate()} />{' '}
					and will be conducted fully online.
				</div>
			</div>
			<div className="status">
				<span className="registered">You are registered</span>
				<a href={href} className="edit">
					Edit
				</a>
			</div>
		</div>
	);
}
