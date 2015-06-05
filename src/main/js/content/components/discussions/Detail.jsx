import React from 'react';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import Avatar from 'common/components/Avatar';
import ContextSender from 'common/mixins/ContextSender';
import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';
import Err from 'common/components/Error';
import Loading from 'common/components/LoadingInline';
import LuckyCharms from 'common/components/LuckyCharms';
import SharedWithList from 'common/components/SharedWithList';

import NavigatableMixin from 'common/mixins/NavigatableMixin';


import Body from 'modeled-content/components/Panel';

// import {scoped} from 'common/locale';
// const t = scoped('CONTENT.DISCUSSIONS');

import Context from './Context';
import ItemActions from './ItemActions';
import Reply from './Panel';

export default React.createClass({
	displayName: 'content:discussions:Detail',
	mixins: [
		ContextSender,
		NavigatableMixin
	],

	propTypes: {
		pageSource: React.PropTypes.object,

		scope: React.PropTypes.shape({
			getPublicScope: React.PropTypes.func
		}),

		item: React.PropTypes.object
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
		item.getReplies()
			.then(
				x => ({children: x}),
				x => ({error: x})
			)
			.then(x => this.setState(Object.assign({loading: false}, x)));
	},


	render () {
		let {item, scope} = this.props;
		let {body, creator, title} = item;
		let date = item.getLastModified();


		return (
			<div className="discussion-detail">
				<div className="root">
					<div className="author-info">
						<Avatar username={creator}/>
						<div className="meta">
							<LuckyCharms item={item}/>
							<h1 className="title">{title}</h1>
							<div className="name-wrapper">
								<DisplayName username={creator} localeKey="CONTENT.DISCUSSIONS.postedBy"/>
								<DateTime date={date} relative/>
								<SharedWithList item={item} scope={scope}/>
							</div>
						</div>
					</div>

					<Context item={item}/>

					<Body body={body}/>

					<ItemActions item={item} isTopLevel/>
				</div>
				{this.renderReplies()}
			</div>
		);
	},


	renderReplies () {
		let {loading=true, error, children=[]} = this.state || {};
		return loading ? (
			<Loading />
		) : error ? (
			<Err error={error}/>
		) : (
			children.map(x=> (

				<Reply item={x} key={x.getID()}/>

			))
		);
	}
});
