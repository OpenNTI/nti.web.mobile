import './NoteEditor.scss';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { HideNavigation } from '@nti/web-commons';
import { Create } from '@nti/web-discussions';


NoteEditor.propTypes = {
	item: PropTypes.object,
	scope: PropTypes.object,
	page: PropTypes.object,

	onCancel: PropTypes.func,
	onSubmit: PropTypes.func,
	afterSave: PropTypes.func
};
export default function NoteEditor ({item, scope, page, onCancel, afterSave}) {
	const {pageInfo} = page;

	return (
		<div className={cx('note-editor-frame editor')}>
			<HideNavigation />
			<Create
				container={[scope, page.pageInfo]}
				initialContent={item.body ?? null}
				extraData={{
					ContainerId: item.ContainerId ?? pageInfo.getID(),
					style: item.style ?? 'suppressed',
					selectedText: item.selectedText ?? '',
					applicableRange: item.applicableRange
				}}

				onCancel={onCancel}
				onClose={onCancel}
				afterSave={afterSave}
			/>
		</div>
	)
}
