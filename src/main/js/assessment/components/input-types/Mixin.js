import Store from '../../Store';

import {partInteracted} from '../../Actions';
import {SYNC} from '../../Constants';

export default {

	statics: {
		handles (item) {
			if (!this.__inputTypeCleaned) {
				//ensure event type:
				if (!Array.isArray(this.inputType)) {
					this.inputType = [this.inputType];
				}
				//ensure shape:
				this.inputType.forEach((s,i,a)=>a[i]=s.toLowerCase());

				//prevent re-entry:
				this.__inputTypeCleaned = true;
			}

			//Perform actual test...
			return this.__test(item);

		},


		__test (item) {
			var type = item && item.MimeType
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
		Store.addChangeListener(this.__onStoreChange);
	},



	componentWillUnmount () {
		Store.removeChangeListener(this.__onStoreChange);
	},


	__onStoreChange (event) {
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
		var item = this.props.item;
		var question = Store.getAssessedQuestion(item, item.getQuestionId());

		//If we have an AssessedQuestion, it has a property "parts" that is an array
		var parts = (question && question.parts) || [];

		//Get the question part or return undefined.
		return parts[item.getPartIndex()];
	},


	setValue (value) {
		if (this._processValue) {
			value = this._processValue(value);
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
		var locked = this.isSubmitted();
		var p = this.props;
		var v = locked ? this.state.value : this.getValue();

		this.setState({ interacted: true, value: v });
		if (!locked) {
			partInteracted(p.item, v, delay);
		}
	}
};
