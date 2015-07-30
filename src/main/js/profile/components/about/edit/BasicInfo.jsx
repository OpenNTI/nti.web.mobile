import React from 'react';

import Editor from 'modeled-content/components/Editor';

import {scoped} from 'common/locale';

const TYPE_OVERRIDE = {email: 'email'};

const TEXT_FIELDS = [
	'email',
	'location',
	'home_page',
	'twitter',
	'facebook',
	'googlePlus',
	'linkedIn'
];

const t = scoped('PROFILE.EDIT');

export default React.createClass({
	displayName: 'BasicInfo',

	propTypes: {
		item: React.PropTypes.object
	},


	getInitialState () {
		return {};
	},


	componentWillMount () { this.setup(); },

	componentWillReceiveProps (nextProps) {
		if (this.props.item !== nextProps.item) {
			this.setup(nextProps);
		}
	},

	setup (props = this.props) {
		let {item} = props;
		let state = {};

		for(let field of ['about'].concat(TEXT_FIELDS)) {
			state[field] = item && item[field];
		}

		this.setState(state);
	},


	onChange (e) {
		let {name, value} = e.target;

		value = Editor.isEmpty(value) ? null : value;

		this.setState({[name]: value});
	},


	onEditorChange(_, value) {
		let about = Editor.isEmpty(value) ? null : value;
		this.setState({about});
	},


	render () {
		let {state} = this;

		return (
			<fieldset ref="form">
				<div>
					<label>{t('about')}</label>
					<Editor ref="about" allowInsertImage={false} value={state.about} onChange={this.onEditorChange}/>
				</div>

				{TEXT_FIELDS.map(name => (
					<div key={name}>
						<label>{t(name)}</label>
						<input type={TYPE_OVERRIDE[name] || 'text'} name={name}
							value={state[name]}
							onChange={this.onChange}
							/>
					</div>
				))}

			</fieldset>
		);
	},


	getValue () {
		return this.state;
	}
});
