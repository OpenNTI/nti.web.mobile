import React from 'react';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import Avatar from 'common/components/Avatar';
import ContextSender from 'common/mixins/ContextSender';
import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';
import LuckyCharms from 'common/components/LuckyCharms';
import SharedWithList from 'common/components/SharedWithList';

import NavigatableMixin from 'common/mixins/NavigatableMixin';


import Panel from 'modeled-content/components/Panel';

// import {scoped} from 'common/locale';
// const t = scoped('CONTENT.DISCUSSIONS');

import Context from './Context';
import ItemActions from './ItemActions';

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
		let {body, creator, title} = item;
		let date = item.getLastModified();


		return (
			<div className="discussion-detail">
				<div className="root">
					<LuckyCharms item={item}/>
					<div className="author-info">
						<Avatar username={creator}/>
						<div className="meta">
							<h1 className="title">{title}</h1>
							<div className="name-wrapper">
								<DisplayName username={creator} localeKey="CONTENT.DISCUSSIONS.postedBy"/>
								<DateTime date={date} relative/>
								<SharedWithList item={item}/>
							</div>
						</div>
					</div>

					<Context item={item}/>

					<Panel body={body}/>

					<ItemActions item={item} isTopLevel/>
				</div>
				{this.renderReplies()}
			</div>
		);
	},


	renderReplies () {
		// let {loading} = this.state;
		return (
			<div/>
		);
	}
});
