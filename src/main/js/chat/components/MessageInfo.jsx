import React from 'react';

import cx from 'classnames';

import Avatar from 'common/components/Avatar';
import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';

import Body from 'modeled-content/components/Panel';

import {getAppUsername} from 'common/utils';

export default React.createClass({
	displayName: 'MessageInfo',

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	componentDidMount () {
		console.log(this.props.item);
	},

	render () {
		let {item} = this.props;

		let css = cx('chat-message-info', {me: item.creator === getAppUsername()});

		return (
			<div className={css}>
				<Avatar entity={item.creator}/>
				<DisplayName entity={item.creator}/>
				<div className="message-body">
					<Body body={item.body}/>
					<div className="spacer"/>
				</div>
				<DateTime date={item.getCreatedTime()} format="h:mm:ss a"/>
			</div>
		);
	}
});
