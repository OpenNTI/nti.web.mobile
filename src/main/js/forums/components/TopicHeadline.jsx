import React from 'react';

import Avatar from 'common/components/Avatar';
import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';
import Loading from 'common/components/LoadingInline';

import {Panel as ModeledContentPanel} from 'modeled-content';

export default React.createClass({
	displayName: 'TopicHeadline',

	propTypes: {
		item: React.PropTypes.shape({
			creator: React.PropTypes.string,
			body: React.PropTypes.array,
			title: React.PropTypes.string,
			getCreatedTime: React.PropTypes.func
		})
	},

	render () {
		let {item} = this.props;
		if (!item) {
			return <Loading />;
		}

		return (
			<div className="headline post">
				<Avatar entity={item.creator}/>
				<div className="wrap">
					<h1>{item.title}</h1>
					<div className="meta">
						<DisplayName entity={item.creator}/>{" · "}<DateTime date={item.getCreatedTime()} relative={true}/>
					</div>
				</div>
				<ModeledContentPanel body={item.body} />
			</div>
		);
	}

});
