import React from 'react';

import Loading from 'common/components/TinyLoader';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import BasePathAware from 'common/mixins/BasePath';
import {scoped} from 'common/locale';


import Card from './Card';

import HasItems from './activity/HasItems';

let t = scoped('PROFILE.ACTIVITY.TITLES');

export default React.createClass({
	displayName: 'Activity',

	mixins: [HasItems, BasePathAware],

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
					let href = this.getBasePath() + 'object/' + encodeForURI(a.NTIID) + '/';

					return ( <a href={href}><Card key={a.NTIID}
								className={mime}
								title={title}
								>{this.renderItems(a)}</Card></a> );
				})}
			</ul>
		);
	}
});
