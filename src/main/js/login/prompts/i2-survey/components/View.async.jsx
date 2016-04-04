import React from 'react';
import serialize from 'form-serialize';
import Logger from 'nti-util-logger';

import {getReturnURL} from 'common/utils';

import Loading from 'common/components/Loading';
import TinyLoader from 'common/components/TinyLoader';

import {loadForm, submitSurvey} from '../Api';

import widget from './widgets';

const logger = Logger.get('i2-survey:components:Survey');

export default React.createClass({
	displayName: 'Survey',


	attachFormRef (form) {
		this.form = form;
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
		)
		.catch(error => {
			logger.error(error);
			this.setState({
				loading: false,
				error: 'Unable to load form'
			});
		});
	},


	clearError () {
		this.setState({
			error: null
		});
	},


	formChange () {
		this.clearError();
		// this.forceUpdate();
	},


	validate () {
		this.setState({
			error: null
		});
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
		this.setState({
			processing: true
		});
		if(!this.validate()) {
			this.setState({
				processing: false,
				error: 'Please correct the errors above.'
			});
			return;
		}
		const formData = serialize(this.form, {hash: true});
		submitSurvey(formData)
			.then(() => {
				if (window.top !== window) {
					window.top.postMessage('survey-complete', '*');
				}
				else {
					location.replace(getReturnURL());
				}
			})
			.catch(error => this.setState({error}));
	},


	render () {

		const {loading, survey, error, processing} = this.state;

		if (loading) {
			return <Loading />;
		}

		if(error && !survey) {
			return (
				<div className="errors">
					<small className="error">{error.statusText || error}</small>
				</div>);
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
					{error && <div className="errors"><small className="error">{error.statusText || error}</small></div>}
					<div className="controls">
						{processing ? <div className="processing"><TinyLoader /></div> : <button onClick={this.onSubmit}>Submit</button>}
					</div>
				</form>
			</div>
		);
	}
});
