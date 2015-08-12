import React from 'react';
import cx from 'classnames';
import {areYouSure} from 'prompts';
import {scoped} from 'common/locale';

let t = scoped('CONTACTS');


export default React.createClass({
	displayName: 'FollowButton',

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	componentWillMount () {
		this.setFollowing();
	},

	componentWillReceiveProps (nextProps) {
		this.setFollowing(nextProps);
	},

	setFollowing (props = this.props) {
		let {entity} = props;
		this.setState({
			following: entity && entity.following
		});
	},

	toggleFollow (e) {
		e.preventDefault();
		e.stopPropagation();
		let {entity} = this.props;

		let p = this.state.following ? areYouSure(t('unfollowPrompt')) : Promise.resolve();
		p.then(() => {
			this.setState({
				loading: true
			});
			entity.follow()
				.then(() => {
					this.setState({
						following: entity.following,
						loading: false
					});
				});
		});
	},

	render () {
		let {following, loading} = this.state;
		let classes = cx({
			'follow-widget': true,
			'follow': !following,
			'unfollow': following,
			'loading': loading
		});
		return (
			<div className={classes} onClick={loading ? null : this.toggleFollow} />
		);
	}
});
