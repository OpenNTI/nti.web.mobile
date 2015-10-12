import React from 'react';

import Loading from 'common/components/TinyLoader';

import Content from '../Content';

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
			<div className="question" data-ntiid={question.getID()} type={question.MimeType}>
				<Content className="question-content" content={question.content}/>
				{data.parts.map((x, i) => {
					let part = question.getPart(i);
					return (
						<div className="question-part" key={i}>
							<Content className="part-content" content={part.content}/>
							{renderWidget(x, i, part)}
						</div>
					);
				})}
			</div>
		);
	}
});
