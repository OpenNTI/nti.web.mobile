// import Actions from '../../Actions';
// import Constants from '../../Constants';
import Store from '../../Store';

const inputTypeCleaned = Symbol();

const onStoreChange = 'solution-types:mixin:OnStoreChange';

export default {

	statics: {
		handles (item) {
			if (!this[inputTypeCleaned]) {
				//ensure data type:
				if (!Array.isArray(this.inputType)) {
					this.inputType = [this.inputType];
				}
				//ensure shape:
				this.inputType.forEach((s, i, a)=> a[i] = s.toLowerCase());

				//prevent re-entry:
				this[inputTypeCleaned] = true;
			}

			//Perform actual test...
			return this.testType(item);

		},


		testType (item) {
			let type = item && item.MimeType
				.replace('application/vnd.nextthought.assessment.', '')
				.replace(/part$/i, '')
				.toLowerCase();
			return (this.inputType.indexOf(type) !== -1);
		}
	},


	getInitialState () {
		return {
			solution: null,
			explanation: null
		};
	},


	// eslint-disable-next-line camelcase
	UNSAFE_componentWillMount () {
		Store.addChangeListener(this[onStoreChange]);
		this[onStoreChange]();
	},



	componentWillUnmount () {
		Store.removeChangeListener(this[onStoreChange]);
	},


	componentDidUpdate () {
		this[onStoreChange]();
	},


	[onStoreChange] (props = this.props) {
		const part = props?.item;
		const solution = Store.getSolution(part);
		const explanation = Store.getExplanation(part);
		if (this.state.solution !== solution || this.state.explanation !== explanation) {
			this.setState({
				solution: solution,
				explanation: explanation
			});
		}
	}
};
