import React from 'react';
import PropTypes from 'prop-types';
import {User, getAppUser} from '@nti/web-client';
import {getModel} from '@nti/lib-interfaces';
import Logger from '@nti/util-logger';
import {Loading} from '@nti/web-commons';

import NotFound from 'notfound/components/View';

import CommunityView from './community/View';
import GroupView from './group/View';
import UserView from './user/View';


const Community = getModel('community');
const UserModel = getModel('user');

const logger = Logger.get('profile:components:View');

export default class extends React.Component {
	static displayName = 'profile:View';

	static propTypes = {
		entityId: PropTypes.string.isRequired
	};

	state = {};

	updateEntity = (props = this.props) => {
		const {entityId} = props;

		if (entityId === 'me') {
			return this.updateForMe();
		}


		this.setState({entity: null}, () =>
			User.resolve(props, true)
				.catch(()=> false)
				.then(entity => {
					logger.debug('Resolved entity: %o', entity);
					this.setState({entity});
				}));
	}


	updateForMe () {
		this.setState({entity: null}, () => {
			getAppUser()
				.catch(() => false)
				.then(entity => {
					logger.debug('Resolved entity: %o', entity);
					this.setState({entity});
				});
		});
	}


	componentDidUpdate (prevProps) {
		if (prevProps.entityId !== this.props.entityId) {
			this.updateEntity(this.props);
		}
	}

	componentDidMount () {
		this.updateEntity();
	}

	render () {
		const {entityId} = this.props;
		let {entity} = this.state;


		if (entity == null) {
			return ( <Loading.Mask /> );
		}

		if (entity === false) {
			return ( <NotFound/> );
		}

		return entity instanceof Community ? (
			<CommunityView entity={entity}/>
		) : entity instanceof UserModel ? (
			<UserView entity={entity} isMe={entityId === 'me'}/>
		) : (
			<GroupView entity={entity}/>
		);
	}
}
