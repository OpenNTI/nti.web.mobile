import React from 'react';

import isEmpty from 'fbjs/lib/isEmpty';

import Loading from 'common/components/TinyLoader';
import Error from 'common/components/Error';
import ExternalLibraryManager from 'common/mixins/ExternalLibraryManager';
import {clearLoadingFlag, setError} from 'common/utils/react-state';

import Mixin from './Mixin';


/**
* This input type represents Symbolic Math
*/
export default React.createClass({
	displayName: 'SymbolicMath',
	mixins: [Mixin, ExternalLibraryManager],

	statics: {
		inputType: [
			'SymbolicMath'
		]
	},

	componentWillMount () {
		this.setState({ loading:true });
	},

	componentDidMount () {
		this.ensureExternalLibrary('mathquill')
			.then(()=> clearLoadingFlag(this))
			.catch(e => setError(this, e));
	},

	render () {
		const {state: {value, loading, error}} = this;
		const submitted = this.isSubmitted();

		if (loading) {
			return ( <Loading/> );
		}

		if (error) {
			return ( <Error error="There was an error loading this question."/> );
		}


		return (
			<form className="free-response">
				<input ref="input" value={value} onChange={this.handleInteraction} readOnly={submitted}/>
			</form>
		);
	},


	getValue () {
		const {input} = this.refs;
		const {value} = input || {};

		return isEmpty(value) ? null : value;
	}
});
