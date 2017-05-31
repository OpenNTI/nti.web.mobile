import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import {rawContent} from 'nti-commons';

import Mixin from './Mixin';

import Content from '../Content';

/**
 * This solution type represents Matching
 */
export default createReactClass({
	displayName: 'MatchingAnswer',
	mixins: [Mixin],

	statics: {
		inputType: [
			'Matching'
		]
	},


	propTypes: {
		item: PropTypes.object
	},


	render () {
		let values = this.props.item.values || [];
		let solution = (this.state.solution || {}).value;
		let ex = this.state.explanation || '';

		solution = solution && Array.from(Object.assign({length: values.length}, solution));

		return (
			<div className="matching solutions">
				<div className="matching">
					<form className="box">
					{values.map((x, i)=>
						this.renderDropTarget(x, i, solution) )}
					</form>
				</div>
				<div className="explanation" {...rawContent(ex)}/>
			</div>
		);
	},


	renderDragSource (term, index) {
		return (
			<div className="drag source" key={term + index}>
				<div className="match" data-source={term}>
					<Content content={term}/>
				</div>
			</div>
		);
	},


	renderDropTarget (value, idx, solution) {
		let i = solution && solution.indexOf(idx);
		let labels = this.props.item.labels || [];
		let label = labels[i];

		if (!solution) {
			return null;
		}

		return (
			<div className="drop target" key={idx}>
				<div className="match blank dropzone" data-dnd>
					{this.renderDragSource(label, i)}
				</div>
				<Content className="content" content={value}/>
			</div>
		);
	}
});
