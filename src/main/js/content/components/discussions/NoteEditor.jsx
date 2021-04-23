import './NoteEditor.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { isNTIID } from '@nti/lib-ntiids';
import { HideNavigation } from '@nti/web-commons';
import { Create } from '@nti/web-discussions';


function buildDiscussion (item) {
	const clone = {...item};

	clone.getTitle = () => clone.title;
	clone.getBody = () => clone.body ?? [];
	clone.getTags = () => clone.tags;

	clone.getSharedWith = () => clone.sharedWith;
	clone.canEditSharing = () => true;

	clone.getMentions = () => [];
	clone.getExtraMentions = () => {
		return (clone.sharedWith ?? [])
			.filter(x => isNTIID(x))
			.map(x => ({ CanAccessContent: true, User: x }));
	};

	return clone;
}

NoteEditor.propTypes = {
	item: PropTypes.object,
	scope: PropTypes.object,
	page: PropTypes.object,

	onCancel: PropTypes.func,
	onSubmit: PropTypes.func,
	onSave: PropTypes.func
};
export default function NoteEditor ({item, scope, page, onCancel, onSubmit, onSave}) {
	const discussion = React.useMemo(() => item.isDiscussion ? item : buildDiscussion(item), [item]);

	const doSave = React.useCallback((payload) => onSave?.(item, payload), [item, onSave]);

	return (
		<div className={cx('note-editor-frame editor')}>
			<HideNavigation />
			<Create
				discussion={discussion}
				container={[scope, page]}


				_doSave={doSave}
				onCancel={onCancel}
			/>
		</div>
	)
}
