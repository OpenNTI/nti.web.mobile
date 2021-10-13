import './ViewComment.scss';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { decodeFromURI, encodeForURI } from '@nti/lib-ntiids';
import { Error as Err, Loading, Mixins } from '@nti/web-commons';
import ContextSender from 'internal/common/mixins/ContextSender';

import Edit from './EditComment';
import Panel from './Panel';

export default createReactClass({
	displayName: 'ViewComment',
	mixins: [ContextSender, Mixins.NavigatableMixin],

	propTypes: {
		root: PropTypes.object.isRequired,
		commentId: PropTypes.string.isRequired,

		edit: PropTypes.bool,
	},

	getInitialState() {
		return {};
	},

	getContext() {
		const {
			props: { root },
			state: { item },
		} = this;
		const result = [];

		// if this is a reply to a comment push an item for the parent comment.
		const { inReplyTo } = item || {};
		if (inReplyTo && inReplyTo !== root.getID()) {
			result.push({
				label: 'Comment',
				href: this.makeHref(encodeForURI(inReplyTo)),
			});
		}

		// entry for this post
		result.push({
			label: 'Reply',
			href: this.makeHref(encodeForURI(item.getID())),
		});

		return result;
	},

	componentDidMount() {
		this.getComment();
	},

	componentDidUpdate(prevProps) {
		const { commentId: commentId0, root: root0 } = prevProps;
		const { commentId: commentId1, root: root1 } = this.props;

		if (commentId0 !== commentId1 || root0 !== root1) {
			this.replaceState(this.getInitialState());
			this.getComment(this.props);
		}
	},

	getComment({ root, commentId } = this.props) {
		root.getReply(decodeFromURI(commentId))
			.then(item => this.setState({ item }))
			.catch(error => this.setState({ error }));
	},

	render() {
		const {
			props: { edit },
			state: { error, item },
		} = this;

		if (error) {
			return <Err error={error} />;
		}

		return !item ? (
			<Loading.Mask />
		) : (
			<div className="comment-view">
				{edit ? (
					<Edit item={item} {...this.props} />
				) : (
					<Panel item={item} rooted />
				)}
			</div>
		);
	},
});
