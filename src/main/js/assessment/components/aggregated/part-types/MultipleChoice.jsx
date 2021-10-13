import createReactClass from 'create-react-class';

import BarChart from './charts/BarChart';
import CommonParts from './CommonParts';

export default createReactClass({
	displayName: 'AggregatedMultipleChoice',
	mixins: [CommonParts],

	statics: {
		partType: ['MultipleChoice', 'MultipleChoiceMultipleAnswer'],
	},

	render() {
		const {
			state: { results },
		} = this;

		return (
			<div>
				<BarChart data={results} />
			</div>
		);
	},
});
