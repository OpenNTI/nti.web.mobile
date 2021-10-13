import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {
	Locations,
	Location,
	NotFound as Default,
} from 'react-router-component';

import { decodeFromURI } from '@nti/lib-ntiids';
import { Mixins } from '@nti/web-commons';
import ContextSender from 'internal/common/mixins/ContextSender';
import NotFound from 'internal/notfound/components/View';

import Edit from './EditNote';
import ViewComment from './ViewComment';
import Detail from './Detail';

export default createReactClass({
	displayName: 'content:discussions:View',
	mixins: [ContextSender, Mixins.NavigatableMixin],

	propTypes: {
		pageSource: PropTypes.object,
		store: PropTypes.object.isRequired,
		itemId: PropTypes.string.isRequired,

		edit: PropTypes.bool,

		contextOverride: PropTypes.object,
		extraRouterProps: PropTypes.object,
	},

	getInitialState() {
		return {};
	},

	componentDidMount() {
		this.updateFromStore();
	},

	componentDidUpdate(prevProps) {
		const { itemId } = this.props;
		if (prevProps.itemId !== itemId) {
			this.updateFromStore();
		}
	},

	updateFromStore(props = this.props) {
		const { store, pageSource, itemId: encodedId } = props;
		const itemId = decodeFromURI(encodedId);
		const item = store.get(itemId);

		this.setState({ item, itemId }, () =>
			this.setPageSource(pageSource, itemId)
		);
	},

	getContext() {
		const {
			state: { item, itemId: ntiid },
			props: { itemId: encodedId, contextOverride },
		} = this;

		if (contextOverride) {
			return contextOverride;
		}

		return {
			label: (item && item.title) || 'Note',
			href: this.makeHref(encodedId),
			ntiid,
		};
	},

	render() {
		const {
			props: { edit, extraRouterProps },
			state: { item },
		} = this;

		return !item ? (
			<NotFound />
		) : edit ? (
			<Edit item={item} {...this.props} {...(extraRouterProps || {})} />
		) : (
			<Locations contextual>
				<Location
					path="/:commentId/edit(/*)"
					handler={ViewComment}
					root={item}
					{...this.props}
					edit
				/>
				<Location
					path="/:commentId(/*)"
					handler={ViewComment}
					root={item}
					{...this.props}
				/>
				<Default handler={Detail} item={item} {...this.props} />
			</Locations>
		);
	},
});
