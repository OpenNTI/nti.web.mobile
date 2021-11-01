import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import cx from 'classnames';

import { Loading } from '@nti/web-commons';
import t from '@nti/lib-locale';
import ShareWith from 'internal/common/components/ShareWith';
import { Editor } from 'internal/modeled-content';

const PUBLISH = { publish: true };

const preventSubmit = e => e.preventDefault() && false;

export default function PostEditor({
	busy,
	error,
	value,
	title,
	onCancel,
	onSubmit,
	showSharing,
	warning,
}) {
	const [disabled, setDisabled] = useState(true);
	const _editor = useRef();
	const _sharing = useRef();
	const _title = useRef();

	useEffect(() => {
		setDisabled(busy || Editor.isEmpty(value) || Editor.isEmpty(title));
	}, [busy, value, title]);

	const _doChange = () => {
		const value = _editor.current?.getValue();
		const title = _title.current?.value;
		setDisabled(busy || Editor.isEmpty(value) || Editor.isEmpty(title));
	};

	const _doCancel = e => {
		e?.preventDefault();
		e?.stopPropagation();
		onCancel(e);
	};

	const _doSubmit = e => {
		e?.preventDefault();
		e?.stopPropagation();

		const titleValue = _title.current?.value;
		const body = _editor.current?.getValue();
		const shareWith = _sharing.current?.getValue(o => o.NTIID);

		onSubmit?.(titleValue, body, shareWith);
	};

	return (
		<div className="note-editor-frame editor">
			<form onSubmit={preventSubmit}>
				<div className="error-message">
					{error
						? t(`common.errorMessages.codes.${error.code}`, error)
						: null}
				</div>

				{warning || null}

				{showSharing && (
					<ShareWith
						ref={_sharing}
						getSharingSuggestions={getSharingSuggestions}
					/>
				)}

				<div className="title">
					<input
						type="text"
						ref={_title}
						placeholder="Title"
						className={cx({
							error: error?.field === 'title',
						})}
						onChange={_doChange}
						defaultValue={title}
					/>
				</div>

				<Editor
					ref={_editor}
					allowInsertVideo
					className={cx({
						error: error?.field === 'body',
					})}
					onChange={_doChange}
					onBlur={_doChange}
					initialValue={value}
				>
					<button onClick={_doCancel} className="cancel">
						{t('common.buttons.cancel')}
					</button>
					<button
						onClick={_doSubmit}
						className={cx('save', { disabled })}
					>
						{busy ? <Loading.Ellipse /> : t('common.buttons.save')}
					</button>
				</Editor>
			</form>
		</div>
	);
}

PostEditor.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	title: PropTypes.string,
	value: PropTypes.any,

	error: PropTypes.object,
	busy: PropTypes.bool,

	showSharing: PropTypes.bool,

	warning: PropTypes.node,
};

async function getSharingSuggestions() {
	return [
		{
			MimeType: 'application/vnd.nextthought.community',
			publish: true,
			displayName: 'Public',
			displayType: 'Community',
			NTIID: PUBLISH,
			getID: () => PUBLISH,
		},
	];
}
