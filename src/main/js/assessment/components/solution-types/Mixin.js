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


	componentWillMount () {
		Store.addChangeListener(this[onStoreChange]);
		this[onStoreChange]();
	},



	componentWillUnmount () {
		Store.removeChangeListener(this[onStoreChange]);
	},


	componentWillReceiveProps (props) {
		this[onStoreChange](props);
	},


	[onStoreChange] (props) {
		let part = (props || {}).item || this.props.item;
		let solution = Store.getSolution(part);
		let explanation = Store.getExplanation(part);
		this.setState({
			solution: solution,
			explanation: explanation
		});
	}
};
