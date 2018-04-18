import React from 'react';
import PropTypes from 'prop-types';
import {Error, Loading} from '@nti/web-commons';

import Content from '../Content';

import {renderWidget} from './part-types';

export default class extends React.Component {
	static displayName = 'AggregatedQuestion';

	static propTypes = {
		question: PropTypes.object.isRequired
	};

	state = {};
	componentDidMount () { this.loadData(this.props); }

	componentWillReceiveProps (nextProps) {
		if (nextProps.question !== this.props.question) {
			this.loadData(nextProps);
		}
	}

	loadData = (props) => {
		const {question: item} = props;
		this.setState({loading: true});

		item.getAggregated()
			.then(data => this.setState({loading: false, data}))
			.catch(error => this.setState({loading: false, error}));
	};

	render () {
		const {props: {question}, state: {loading, data, error}} = this;

		return loading ? (
			<Loading.Ellipse/>
		) : error ? (
			<div className="question error"><Error error={error}/></div>
		) : (!data || !data.parts) ? (
			<div className="question missing-data">No Data</div>
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
}
