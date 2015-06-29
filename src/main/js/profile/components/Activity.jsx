import React from 'react';
import Card from './Card';
import renderItemsMixin from './widgets/Mixin';
import Loading from 'common/components/TinyLoader';
import {scoped} from 'common/locale';
let t = scoped('PROFILE.ACTIVITY.TITLES');

export default React.createClass({
	displayName: 'Activity',
	mixins: [renderItemsMixin],

	getInitialState () {
		return {
		};
	},

	componentWillReceiveProps (nextProps) {
		if(nextProps.user) {
			nextProps.user.getActivity().then(
				activity => this.setState({
					activity
				}),
				reason => this.setState({
					error: reason
				})
			);
		}
	},

	render () {

		if (this.state.error) {
			return <div>Error</div>;
		}

		let activity = this.state.activity;

		if (!activity) {
			return <Loading />;
		}

		return (
			<ul className="profile-cards activity">
				{activity.map(a => {
					// localize the last segment of the mime type for the card title.
					let mime = a.MimeType.substr(a.MimeType.lastIndexOf('.') + 1);
					let title = t(mime);
					return <Card className={mime} title={title}>{this.renderItems(a)}</Card>;
				})}
			</ul>
		);
	}
});
