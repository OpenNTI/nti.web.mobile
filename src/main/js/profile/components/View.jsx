import PropTypes from 'prop-types';
import React from 'react';

import {User} from 'nti-web-client';
import {getModel} from 'nti-lib-interfaces';
import Logger from 'nti-util-logger';

import {Loading} from 'nti-web-commons';

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
		this.setState({entity: null}, () =>
			User.resolve(props, true)
				.catch(()=> false)
				.then(entity => {
					logger.debug('Resolved entity: %o', entity);
					this.setState({entity});
				}));
	};

	componentWillReceiveProps (nextProps) {
		if (nextProps.entityId !== this.props.entityId) {
			this.updateEntity(nextProps);
		}
	}

	componentDidMount () {
		this.updateEntity();
	}

	render () {
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
			<UserView entity={entity}/>
		) : (
			<GroupView entity={entity}/>
		);
	}
}
