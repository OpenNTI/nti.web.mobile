import Store from '../../Store';

import {partInteracted} from '../../Actions';
import {SYNC} from '../../Constants';

const inputTypeCleaned = Symbol();

const onStoreChange = 'input-types:mixin:OnStoreChange';

export default {

	statics: {
		handles (item) {
			if (!this[inputTypeCleaned]) {
				//ensure event type:
				if (!Array.isArray(this.inputType)) {
					this.inputType = [this.inputType];
				}
				//ensure shape:
				this.inputType.forEach((s, i, a)=>a[i] = s.toLowerCase());

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
			interacted: false
		};
	},



	componentDidMount () {
		Store.addChangeListener(this[onStoreChange]);
	},



	componentWillUnmount () {
		Store.removeChangeListener(this[onStoreChange]);
	},


	[onStoreChange] (event) {
		if (event && event.type === SYNC && this.isMounted()) {
			let {item} = this.props;
			this.setValue(Store.getPartValue(item));
			this.setState({
				busy: Store.getBusyState(item)
			});
		}
	},


	isSubmitted () {
		return Store.isSubmitted(this.props.item);
	},


	getSolution () {
		return Store.getSolution(this.props.item);
	},


	getAssessedPart () {
		let item = this.props.item;
		let question = Store.getAssessedQuestion(item, item.getQuestionId());

		//If we have an AssessedQuestion, it has a property "parts" that is an array
		let parts = (question && question.parts) || [];

		//Get the question part or return undefined.
		return parts[item.getPartIndex()];
	},


	setValue (value) {
		if (this.processValue) {
			value = this.processValue(value);
		}
		this.setState({value: value});
	},


	hasInteracted () {
		return this.state.interacted;
	},


	handleInteraction () {
		this.saveProgress(this.saveBuffer || 750);
	},


	saveProgress (delay = 0) {
		let locked = this.isSubmitted();
		let p = this.props;
		let v = locked ? this.state.value : this.getValue();

		this.setState({ interacted: true, value: v });
		if (!locked) {
			partInteracted(p.item, v, delay);
		}
	}
};
