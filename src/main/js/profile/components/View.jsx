import React from 'react';

import {resolve} from 'nti-web-client/lib/user';
import {getModel} from 'nti-lib-interfaces';
import Logger from 'nti-util-logger';

import Loading from 'common/components/Loading';

import NotFound from 'notfound/components/View';

import CommunityView from './community/View';
import GroupView from './group/View';
import UserView from './user/View';


const Community = getModel('community');
const User = getModel('user');

const logger = Logger.get('profile:components:View');

export default React.createClass({
	displayName: 'profile:View',

	propTypes: {
		entityId: React.PropTypes.string.isRequired
	},

	getInitialState () {
		return {};
	},


	updateEntity (props = this.props) {
		this.setState({entity: null}, () =>
			resolve(props, true)
				.catch(()=> false)
				.then(entity => {
					logger.debug('Resolved entity: %o', entity);
					this.setState({entity});
				}));
	},


	componentWillReceiveProps (nextProps) {
		if (nextProps.entityId !== this.props.entityId) {
			this.updateEntity(nextProps);
		}
	},


	componentDidMount () {
		this.updateEntity();
	},


	render () {
		let {entity} = this.state;


		if (entity == null) {
			return ( <Loading /> );
		}

		if (entity === false) {
			return ( <NotFound/> );
		}

		return entity instanceof Community ? (
			<CommunityView entity={entity}/>
		) : entity instanceof User ? (
			<UserView entity={entity}/>
		) : (
			<GroupView entity={entity}/>
		);
	}
});
