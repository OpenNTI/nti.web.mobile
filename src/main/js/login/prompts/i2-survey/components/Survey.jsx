import React from 'react';
import serialize from 'form-serialize';

import Loading from 'common/components/Loading';
import PromiseButton from 'common/components/PromiseButton';

import {loadForm, submitSurvey} from '../Api';

import widget from './widgets';


export default React.createClass({
	displayName: 'Survey',


	attachFormRef (form) {
		this.form = form;
	},


	childContextTypes: {
		getForm: React.PropTypes.func
	},


	getChildContext () {
		return {
			getForm: () => this.form
		};
	},


	getInitialState () {
		return {
			loading: true
		};
	},

	componentWillMount () {
		this.elements = [];
	},


	componentDidMount () {
		this.load();
	},


	load () {
		loadForm().then(
			survey => this.setState({
				survey,
				loading: false
			})
		);
	},


	clearError () {
		this.setState({
			error: null
		});
	},


	formChange () {
		this.clearError();
		this.forceUpdate();
	},


	validate () {
		let result = true;
		for(let i = 0; i < this.elements.length; i++) {
			let e = this.elements[i];
			if(e.validate && !e.validate()) {
				result = false;
			}
		}
		return result;
	},


	onSubmit (e) {
		if(e && e.preventDefault) {
			e.preventDefault();
		}
		if(!this.validate()) {
			this.setState({
				error: 'Please correct the errors above.'
			});
			return Promise.reject();
		}
		const formData = serialize(this.form, {hash: true});
		return submitSurvey(formData)
			.catch(error => this.setState({error}));
	},

	render () {

		const {loading, survey, error} = this.state;

		if (loading) {
			return <Loading />;
		}

		return (
			<div className="onboarding-survey">
				<form method="post"
					ref={this.attachFormRef}
					onChange={this.formChange}
					onSubmit={this.onSubmit}
				>
					{survey.elements.map((e, i) => {
						const Widget = widget(e.type);
						return (<div key={i}><Widget ref={x => this.elements[i] = x} element={e} requirement={e.requirement} /></div>);
					})}
					{error && <div className="errors"><small className="error">{error}</small></div>}
					<div className="controls">
						<PromiseButton onClick={this.onSubmit}>Submit</PromiseButton>
					</div>
				</form>
			</div>
		);
	}
});
