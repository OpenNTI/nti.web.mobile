import React from 'react';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import Avatar from 'common/components/Avatar';
import ContextSender from 'common/mixins/ContextSender';
import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

// import {scoped} from 'common/locale';

import Panel from 'modeled-content/components/Panel';

// const t = scoped('CONTENT.DISCUSSIONS');

const LuckyCharms = 'div'; //TODO: create and import new widgets
const SharedWithList = 'div';
const ItemActions = 'div';

export default React.createClass({
	displayName: 'content:discussions:Detail',
	mixins: [
		ContextSender,
		NavigatableMixin
	],

	propTypes: {
		pageSource: React.PropTypes.object,

		item: React.PropTypes.object
	},


	componentWillMount () {

	},


	getContext () {
		let {item} = this.props;

		return Promise.resolve({
			label: item.title || 'Note',
			href: this.makeHref(encodeForURI(item.getID()))
		});
	},


	componentDidMount () {
		this.updateData();
	},


	componentWillReceiveProps (nextProps) {
		this.updateData(nextProps);
	},


	updateData (props = this.props) {
		let {pageSource, item} = props;
		this.setPageSource(pageSource, item.getID());

		this.setState({loading: true});
		item.getReplies().then(x=> this.setState({loading: false, children: x}));
	},


	render () {
		let {item} = this.props;
		// let {children} = this.state;
		let {body, creator, title} = item;
		let date = item.getLastModified();


		return (
			<div className="discussion-detail">
				<LuckyCharms item={item}/>
				<div className="author-info">
					<Avatar username={creator}/>
					<div className="meta">
						<h1>{title}</h1>
						<DisplayName username={creator} localeKey="CONTENT.DISCUSSIONS.postedBy"/>
						<DateTime date={date} relative/>
						<SharedWithList item={item}/>
					</div>
				</div>

				<div className="context">TODO: some context here</div>

				<Panel body={body}/>

				<ItemActions item={item} isTopLevel/>
			</div>
		);
	}
});
