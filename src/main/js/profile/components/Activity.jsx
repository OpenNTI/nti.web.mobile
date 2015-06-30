import React from 'react';
import Card from './Card';
import renderItemsMixin from './widgets/Mixin';
import Loading from 'common/components/TinyLoader';
import {scoped} from 'common/locale';
let t = scoped('PROFILE.ACTIVITY.TITLES');

export default React.createClass({
	displayName: 'Activity',
	mixins: [renderItemsMixin],

	propTypes: {
		user: React.PropTypes.object
	},

	getInitialState () {
		return {};
	},


	componentDidMount () {
		this.setUser();
	},


	componentWillReceiveProps (nextProps) {
		let {user} = nextProps;

		if(user !== this.props.user) {
			this.setUser(user);
		}
	},


	setUser (user = this.props.user) {
		if (user) {
			user.getActivity()
				.then(
					activity => this.setState({activity}),
					error => this.setState({error}));

		}
		else {
			this.setState({activity: []});
		}
	},


	render () {
		let {error, activity} = this.state;

		if (error) {
			return ( <div>Error</div> );
		}

		if (!activity) {
			return ( <Loading /> );
		}

		return (
			<ul className="profile-cards activity">
				{activity.map(a => {

					// localize the last segment of the mime type for the card title.
					let mime = a.MimeType.split('.').pop();
					let title = t(mime);

					return ( <Card key={a.NTIID} className={mime} title={title}>{this.renderItems(a)}</Card> );
				})}
			</ul>
		);
	}
});
