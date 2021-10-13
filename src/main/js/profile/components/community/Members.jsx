import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { Loading, Mixins, PromiseButton } from '@nti/web-commons';
import ContextSender from 'internal/common/mixins/ContextSender';

import AvatarGrid from '../AvatarGrid';
import { profileHref } from '../../mixins/ProfileLink';
import ProfileBodyContainer from '../ProfileBodyContainer';

export default createReactClass({
	displayName: 'Community:Members',
	mixins: [Mixins.BasePath, ContextSender],

	propTypes: {
		entity: PropTypes.object,

		nested: PropTypes.bool,
	},

	getInitialState() {
		return {};
	},

	getContext() {
		let { entity, nested } = this.props;
		let base = this.getBasePath() + profileHref(entity);

		return Promise.resolve([
			{
				label: 'Members',
				href: base + (nested ? 'info/' : '') + 'members/',
			},
		]);
	},

	setupStore(props = this.props) {
		let { entity } = props;
		let store = null;
		if (entity) {
			store = entity.getMembers();
		}
		this.setState({ store });
	},

	componentDidMount() {
		this.setupStore();
	},

	componentWillUnmount() {
		const { store } = this.state;
		if (store) {
			store.removeListener('change', this.onStoreChange);
		}
	},

	componentDidUpdate(prevProps, prevState) {
		const { entity } = this.props;
		const { store } = this.state;
		const prevStore = prevState.store;

		if (entity !== prevProps.entity) {
			this.setupStore();
		}

		if (prevStore && prevStore !== store) {
			store.removeListener('change', this.onStoreChange);
		}

		if (store && store !== prevStore) {
			store.addListener('change', this.onStoreChange);

			// if (!store.loading) {
			// 	console.log('Wut?');
			// }
		}
	},

	onStoreChange() {
		this.forceUpdate();
	},

	more() {
		const { store } = this.state;
		return store.nextBatch();
	},

	render() {
		let { store } = this.state;
		if (!store || (store.loading && !store.length)) {
			return <Loading.Mask />;
		}

		return (
			<ProfileBodyContainer className="members community-info">
				<div>
					<h2>Community Members</h2>
					<AvatarGrid entities={store} />
					{store.more && (
						<PromiseButton className="more" onClick={this.more}>
							More
						</PromiseButton>
					)}
				</div>
			</ProfileBodyContainer>
		);
	},
});
