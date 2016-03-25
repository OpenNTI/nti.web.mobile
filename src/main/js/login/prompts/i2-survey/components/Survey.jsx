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

	componentWillMount () {
		this.elements = [];
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
		if(!this.validate() || true) {
			e.preventDefault();
			return false;
		}
	},

	render () {

		const {loading, survey} = this.state;

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
					<button>Submit</button>
				</form>
			</div>
		);
	}
});
