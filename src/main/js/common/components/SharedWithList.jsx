import React from 'react';


import DisplayName from './DisplayName';
import Loading from './TinyLoader';

import {resolve} from '../utils/user';

const isEmpty = x => !Array.isArray(x) || x.length === 0;

const EVERYONE = 'everyone';

export default React.createClass({
	displayName: 'SharedWithList',

	propTypes: {

		/**
		 * Sometimes you just want the first entity and a remainder count. Ex:
		 *
		 *  Shared With:
		 *  	"Johny, and 42 others"
		 *
		 * This prop turns that format on.
		 *
		 * @type {boolean}
		 */
		short: React.PropTypes.bool,

		item: React.PropTypes.object.isRequired
	},


	getInitialState () {
		return {loading: true};
	},


	isPublic (sharedWith) {
		if (isEmpty(sharedWith)) {
			return false;
		}

		return sharedWith.includes(EVERYONE);
	},


	componentDidMount () {
		this.fill(this.props.item);
	},

	componentWillReceiveProps (props) {
		if (this.props.item !== props.item) {
			this.fill(props.item);
		}
	},


	fill (item) {
		this.setState({loading: true});

		let {sharedWith=[]} = item;
		let pending = sharedWith
			.filter(x => x && x !== EVERYONE)
			.map(entity=> resolve(this, {entity}).catch(()=>null));


		Promise.all(pending)
			.then(list=> {

				let users = list.filter(x=>x);
				let others = list.length - users.length;

				this.setState({users, others, loading: false});
			});
	},


	render () {
		let {short, item} = this.props;
		let {loading, users = [], others = 0} = this.state;
		let {sharedWith = []} = item;

		if (loading) {
			return (<Loading/>);
		}

		if (short && users.length > 1) {
			others += users.length - 1;
			users = users.slice(0, 1);
		}


		let state = this.isPublic(sharedWith) ?
			'Public' :
			sharedWith.length ?
				(users.length === 0 ? 'Shared' : '') :
				'Only Me';

		let names = (state ? [state] : [])
			.concat(users.map(x => <DisplayName entity={x}/> ))
			//Only show " N Others" when there are more than 0 others, AND we have at least one resolved name.
			.concat(others === 0 || users.length === 0 ? [] : (`${others} Others`));

		return React.createElement('span', {className: 'shared-with-list'}, ...names);
	}
});
