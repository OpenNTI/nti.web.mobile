import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {encodeForURI} from '@nti/lib-ntiids';
import {Loading, Mixins, Notice, Error} from '@nti/web-commons';
import { StoreEventsMixin } from '@nti/lib-store';

import ContenxtSender from 'common/mixins/ContextSender';
import Breadcrumb from 'navigation/components/Breadcrumb';

import * as Actions from '../Actions';
import { FORUM_CREATED, FORUM_CREATION_ERROR } from '../Constants';
import Store from '../Store';

import ForumEditor from './ForumEditor';

export default createReactClass({
	displayName: 'CreateForum',
	mixins: [StoreEventsMixin, ContenxtSender, Mixins.NavigatableMixin],

	propTypes: {
		contentPackage: PropTypes.object.isRequired
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		[FORUM_CREATION_ERROR] (event) {
			this.setState({
				busy: false,
				error: event.data.reason
			});
		},

		[FORUM_CREATED] (event) {
			this.setState({ busy: false });

			const forumId = event.forum.getID();
			const path = encodeForURI(forumId);
			this.navigate('/' + path + '/', { replace: true });
			return;
		},
	},

	getInitialState () {
		return {
			busy: false
		};
	},

	getContext () {
		const href = this.makeHref(this.getPath());
		const label = 'New Forum';
		return Promise.resolve({ label, href });
	},

	canCreateForum () {
		const { contentPackage } = this.props;
		return contentPackage && contentPackage.Discussions && contentPackage.Discussions.hasLink('add');
	},

	createForum (value) {
		this.setState({
			busy: true
		});
		const { contentPackage: { Discussions }} = this.props;
		Actions.createForum(Discussions, value);
	},

	onCancel () {
		this.navigate('/', {replace: true});
	},

	render () {
		const { busy, error } = this.state;
		if (busy) {
			return <Loading.Mask />;
		}

		if (!this.canCreateForum()) {
			return <Notice>Can’t create a new forum.</Notice>;
		}

		return (
			<React.Fragment>
				<Breadcrumb />
				{error && <Error error={error} />}
				<ForumEditor
					onSubmit={this.createForum}
					onCancel={this.onCancel}
				/>
			</React.Fragment>
		);
	}
});
