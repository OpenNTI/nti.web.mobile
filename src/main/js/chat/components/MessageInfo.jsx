import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import cx from 'classnames';
import Logger from 'nti-util-logger';
import {DateTime} from 'nti-web-commons';
import {getAppUsername} from 'nti-web-client';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import {Panel as Body} from 'modeled-content';


const logger = Logger.get('chat:components:MessageInfo');

const MessageInfo = createReactClass({
	displayName: 'MessageInfo',

	propTypes: {
		item: PropTypes.object.isRequired
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
					logger.error('There was a problem getting replies. reason: %o', e);
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
