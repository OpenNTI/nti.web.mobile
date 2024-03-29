import './BlogComment.scss';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { getService } from '@nti/web-client';
import { DateTime, LuckyCharms } from '@nti/web-commons';
import { Panel as ModeledContent } from 'internal/modeled-content';
import Avatar from 'internal/common/components/Avatar';
import Breadcrumb from 'internal/common/components/BreadcrumbPath';
import DisplayName from 'internal/common/components/DisplayName';

import Mixin from './Mixin';

export default createReactClass({
	displayName: 'ForumComment',
	mixins: [Mixin],

	statics: {
		mimeType: /forums\.personalblogcomment/i,
	},

	propTypes: {
		item: PropTypes.any.isRequired,
	},

	getInitialState() {
		return {};
	},

	componentDidMount() {
		this.getTitle();
	},

	componentDidUpdate(prevProps) {
		let { item } = this.props;

		if ((item || {}).containerId !== (prevProps.item || {}).containerId) {
			this.getTitle();
		}
	},

	getTitle(props = this.props) {
		this.setState({ title: '' });

		const { containerId } = props.item;

		getService()
			.then(service => service.getObjectRaw(containerId))
			.then(post => post.title)
			.then(title => this.setState({ title }));
	},

	render() {
		const {
			props: { item },
			state: { title },
		} = this;

		if (!item) {
			return null;
		}

		const { creator } = item;

		return (
			<div className="blog forum-comment">
				<Breadcrumb item={item} />
				<div className="body">
					<LuckyCharms item={item} />
					<div className="wrap">
						<Avatar entity={creator} />{' '}
						<DisplayName entity={creator} /> commented on the
						thought: <span className="title">{title}</span>
						<div className="meta">
							<DateTime date={item.getCreatedTime()} relative />
						</div>
					</div>
					<ModeledContent body={item.body} />
				</div>
			</div>
		);
	},
});
