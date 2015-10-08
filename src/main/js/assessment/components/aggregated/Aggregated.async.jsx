import React from 'react';

import Loading from 'common/components/TinyLoader';

import {renderWidget} from './part-types';

export default React.createClass({
	displayName: 'AggregatedQuestion',

	propTypes: {
		question: React.PropTypes.object.isRequired
	},


	getInitialState () {
		return {};
	},


	componentDidMount () { this.loadData(this.props); },
	componentWillReceiveProps (nextProps) {
		if (nextProps.question !== this.props.question) {
			this.loadData(nextProps);
		}
	},


	loadData (props) {
		const {question: item} = props;
		this.setState({loading: true});

		item.getAggregated()
			.then(data => this.setState({loading: false, data}));
	},


	render () {
		const {props: {question}, state: {loading, data}} = this;

		return loading ? (
			<Loading/>
		) : !data ? (
			<div className="missing">No Data</div>
		) : (
			<div>{data.parts.map((x, i) => renderWidget(x, i, question.getPart(i)))}</div>
		);
	}
});
