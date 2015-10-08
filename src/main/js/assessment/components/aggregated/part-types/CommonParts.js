import React from 'react';
const typeCleaned = Symbol();

export default {

	statics: {
		handles (item) {
			if (!this[typeCleaned]) {
				//ensure event type:
				if (!Array.isArray(this.partType)) {
					this.partType = [this.partType];
				}
				//ensure shape:
				this.partType.forEach((s, i, a)=>a[i] = s.toLowerCase());

				//prevent re-entry:
				this[typeCleaned] = true;
			}

			//Perform actual test...
			return this.testType(item);

		},


		testType (item) {
			let type = item && item.MimeType
				.replace('application/vnd.nextthought.assessment.aggregated', '')
				.replace(/part$/i, '')
				.toLowerCase();
			return (this.partType.indexOf(type) !== -1);
		}
	},


	propTypes: {
		item: React.PropTypes.object,

		questionPart: React.PropTypes.object
	},


	componentWillMount () {
		const {props: {item, questionPart: part}} = this;
		const results = item.getResults(part);
		console.debug(results);
		this.setState({ results });
	}
};
