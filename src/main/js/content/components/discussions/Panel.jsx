import React from 'react';

import Avatar from 'common/components/Avatar';
import DateTime from 'common/components/DateTime';
import DisplayName from 'common/components/DisplayName';
import Err from 'common/components/Error';
import Loading from 'common/components/LoadingInline';
import LuckyCharms from 'common/components/LuckyCharms';

import Body from 'modeled-content/components/Panel';

import ItemActions from './ItemActions';

const Panel = React.createClass({
	displayName: 'content:discussions:Panel',

	propTypes: {
		item: React.PropTypes.object.isRequired
	},


	componentDidMount () {
		this.updateData();
	},


	componentWillReceiveProps (nextProps) {
		this.updateData(nextProps);
	},


	updateData (props = this.props) {
		let {item} = props;

		this.setState({loading: true});
		item.getReplies()
			.then(
				x => ({children: x}),
				x => ({error: x})
			)
			.then(x => this.setState(Object.assign({loading: false}, x)));
	},


	render () {
		let {item} = this.props;
		let {body, creator, placeholder} = item;
		let date = item.getLastModified();

		return (
			<div className="discussion-reply">
				{ placeholder ? (
					<div className="placeholder">This message has been deleted.</div>
				) : (
					<div className="body">
						<LuckyCharms item={item}/>
						<div className="author-info">
							<Avatar username={creator}/>
							<div className="meta">
								<DisplayName username={creator}/>
								<div className="name-wrapper"/>
							</div>
						</div>

						<Body body={body}/>

						<div className="footer">
							<DateTime date={date} relative/>
							<ItemActions item={item} isTopLevel/>
						</div>
					</div>
				)}
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

				<Panel item={x} key={x.getID()}/>

			))
		);
	}

});

export default Panel;
