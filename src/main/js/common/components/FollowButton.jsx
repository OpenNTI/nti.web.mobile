import React from 'react';
import cx from 'classnames';
import Loading from 'common/components/TinyLoader';

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

		this.setState({
			loading: true
		});
		entity.follow()
			.then(() => {
				this.setState({
					following: true,
					loading: false
				});
			});

	},

	render () {
		let {following, loading} = this.state;
		if (loading) {
			return <Loading />;
		}
		let classes = cx({
			'follow-widget': true,
			'follow': !following,
			'unfollow': following
		});
		return (
			<div className={classes} onClick={this.toggleFollow} />
		);
	}
});
