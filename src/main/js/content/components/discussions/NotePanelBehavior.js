import React from 'react';

import Err from 'common/components/Error';
import {LoadingInline as Loading} from 'nti-web-commons';

import {Mixins} from 'nti-web-commons';

function ReplyComparator (a, b) {
	a = a.getCreatedTime();
	b = b.getCreatedTime();
	return a === b ? 0 : a < b ? -1 : 1;
}

export default {
	mixins: [Mixins.ItemChanges],

	getInitialState () {
		return {loading: false};
	},


	componentDidMount () {
		this.updateData();
	},


	componentWillReceiveProps (nextProps) {
		if (this.props.item !== nextProps.item) {
			this.updateData(nextProps);
		}
	},


	onItemChanged () {
		this.updateData(this.props, false);
	},


	updateData (props = this.props, setLoading = true) {
		let {item, lite} = props;
		if (lite) {
			return;
		}

		let t = setTimeout(()=> this.setState({loading: setLoading}), 100);
		item.getReplies()
			.then(
				x => ({children: x}),
				x => ({error: x})
			)
			.then(x => {
				clearTimeout(t);
				this.setState(Object.assign({loading: false}, x));
			});
	},


	hideReplyEditor () {
		this.setState({replying: false});
	},


	showReplyEditor () {
		this.setState({replying: true});
	},


	renderReplies () {
		let {loading = true, error, children = []} = this.state || {};

		return (loading || error) ? (
			<div className="coordinate-root">
				{error ? (
					<Err error={error}/>
				) : (
					<Loading />
				)}
			</div>
		) : (
			children.sort(ReplyComparator).map(x=>this.renderReply(x))
		);
	}
};
