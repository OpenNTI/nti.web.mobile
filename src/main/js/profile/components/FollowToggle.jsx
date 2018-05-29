import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Prompt} from '@nti/web-commons';


export default class FollowToggle extends React.Component {

	static propTypes = {
		entity: PropTypes.object.isRequired
	}

	static getDerivedStateFromProps ({entity}) {
		return {
			following: entity && entity.following
		};
	}

	state = {}

	toggleFollow = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		const {state: {following}, props: {entity}} = this;

		try {
			if (following) {
				await Prompt.areYouSure('Remove this contact?');
			}

			this.setState({ loading: true });
			await entity.follow();

		}
		catch (er) {
			//derp
		}

		finally {
			this.setState({
				following: entity.following,
				loading: false
			});
		}
	}

	render () {
		const {props: {entity}, state: {following, loading}} = this;
		const classes = cx('old-follow-widget', {
			'follow': !following,
			'unfollow': following,
			'loading': loading
		});

		return (!entity || !entity.follow) ? null : (
			<div className={classes} onClick={loading ? null : this.toggleFollow} />
		);
	}
}
