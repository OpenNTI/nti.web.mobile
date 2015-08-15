import React from 'react';
import Loading from 'common/components/Loading';
import TopicView from 'forums/components/TopicView';
import {getObject} from 'forums/Api';

export default React.createClass({
	displayName: 'BlogEntryDetail',

	propTypes: {
		id: React.PropTypes.string.isRequired
	},

	getInitialState () {
		return {
			loading: true,
			item: null
		};
	},

	componentWillMount () {
		this.getItem(this.props.id);
	},

	getItem (id) {
		let get = getObject(id);
		get.then(result => {
			this.setState({
				item: result,
				loading: false
			});
		});
	},

	render () {

		let {loading, item} = this.state;

		if(loading) {
			return <Loading />;
		}
		return (
			<div className="profile-forums forums-wrapper">
				<TopicView topicId={item.getID()} />
			</div>
		);
	}
});
