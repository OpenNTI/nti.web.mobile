import React from 'react';

import cx from 'classnames';

import Avatar from 'common/components/Avatar';
import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';

import {Panel as Body} from 'modeled-content';

import {getAppUsername} from 'common/utils';

const MessageInfo = React.createClass({
	displayName: 'MessageInfo',

	propTypes: {
		item: React.PropTypes.object.isRequired
	},


	getInitialState () {
		return {loading: true};
	},

	componentDidMount () {
		this.loadReplies();
	},


	componentWillReceiveProps (nextProps) {
		if (nextProps.item !== this.props.item) {
			this.loadReplies(nextProps);
		}
	},


	loadReplies (props = this.props) {
		let {item} = props;

		this.replaceState(this.getInitialState());

		if (item) {
			item.getReplies()
				.catch(e => {
					console.error(e);
					return [];
				})
				.then(children => this.setState({loading: false, children}));
		}
	},


	render () {
		let {item} = this.props;

		let css = cx('chat-message-info', {me: item.creator === getAppUsername()});

		return (
			<div>
				<div className={css}>
					<Avatar entity={item.creator}/>
					<DisplayName entity={item.creator}/>
					<div className="message-body">
						<Body body={item.body}/>
						<div className="spacer"/>
					</div>
					<DateTime date={item.getCreatedTime()} format="h:mm:ss a"/>
				</div>
				{this.renderChildren()}
			</div>
		);
	},


	renderChildren () {
		let {children, loading} = this.state;

		return loading ? null : children.map(c => (
			<MessageInfo item={c} key={c.getID()} />
		));
	}
});

export default MessageInfo;
