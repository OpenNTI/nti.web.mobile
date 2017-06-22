import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import cx from 'classnames';
import {User} from 'nti-web-client';
import {PromiseButton, Mixins} from 'nti-web-commons';


export default createReactClass({
	displayName: 'FollowButton',
	mixins: [Mixins.ItemChanges],

	propTypes: {
		entity: PropTypes.any.isRequired
	},

	componentDidMount () { this.setup(); },
	componentWillReceiveProps (nextProps) {
		if (this.props.entity !== nextProps.entity) {
			this.setup(nextProps);
		}
	},


	getItem (_, state) {
		return (state || {}).entity;
	},


	setup (props = this.props) {
		let {entity} = props;
		//so far, entity is always the full object, but allow it to be a string...
		User.resolve({entity})
			.then(e => this.setState({entity: e}));
	},


	onClick () {
		return this.state.entity.follow();
	},


	render () {
		//Get the entity on the state, not the props. See @setup() above.
		let {entity} = this.state || {};
		if (!entity) {
			return null;
		}

		let {following} = entity;

		let css = cx({
			'follow-button': !following,
			'unfollow-button': following
		});

		let text = following ? 'Unfollow' : 'Follow';

		return (
			<PromiseButton className={css} onClick={this.onClick}>
				{text}
			</PromiseButton>
		);
	}
});
