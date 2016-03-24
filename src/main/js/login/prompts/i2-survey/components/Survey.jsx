import React from 'react';

import Loading from 'common/components/Loading';

import widget from './widgets';

import data from '../survey.json';


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


	componentDidMount () {
		this.load();
	},


	load () {
		this.loadData().then(
			survey => this.setState({
				survey,
				loading: false
			})
		);
	},


	loadData () {
		return Promise.resolve(data);
	},

	formChange () {
		this.forceUpdate();
	},

	render () {

		const {loading, survey} = this.state;

		if (loading) {
			return <Loading />;
		}

		return (
			<div className="onboarding-survey">
				<form ref={this.attachFormRef} onChange={this.formChange}>
					{survey.elements.map((e, i) => {
						const Widget = widget(e.type);
						return (<div key={i}><Widget element={e} requirement={e.requirement} /></div>);
					})}
				</form>
			</div>
		);
	}
});
