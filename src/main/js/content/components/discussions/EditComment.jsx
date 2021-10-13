import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { encodeForURI } from '@nti/lib-ntiids';
import { Mixins } from '@nti/web-commons';
import ContextSender from 'internal/common/mixins/ContextSender';

import ReplyEditor from './ReplyEditor';

export default createReactClass({
	displayName: 'NoteCommentEditView',
	mixins: [ContextSender, Mixins.NavigatableMixin],

	propTypes: {
		item: PropTypes.object,
		contentPackage: PropTypes.object,
	},

	getContext() {
		return {
			title: 'Edit',
		};
	},

	returnToView() {
		const {
			props: { item },
		} = this;
		const href = encodeForURI(item.getID());

		this.navigate(href, { replace: true });
	},

	onCancel() {
		this.returnToView();
	},

	onSubmitted() {
		this.returnToView();
	},

	render() {
		const {
			props: { item },
		} = this;
		return (
			<ReplyEditor
				item={item}
				value={item.body}
				onCancel={this.onCancel}
				onSubmitted={this.onSubmitted}
			/>
		);
	},
});
