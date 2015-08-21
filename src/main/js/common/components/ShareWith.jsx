import React from 'react';

import ShareTarget from './TokenEntity';

const KEY = 'defaultValue';


export default React.createClass({
	displayName: 'ShareWith',

	propTypes: {
		defaultValue: React.PropTypes.array,

		scope: React.PropTypes.object
	},


	getInitialState () {
		return {};
	},


	componentWillMount () {
		this.setup();
	},


	componentWillReceiveProps (nextProps) {
		if (nextProps[KEY] !== this.props[KEY]) {
			this.setup(nextProps);
		}
	},


	setup (props = this.props) {
		const stillValid = () => props[KEY] === this.props[KEY];

		this.setState({value: props.defaultValue});

		props.scope.getSharingSuggestions()
			.then(suggestions => {
				if (stillValid()) {
					this.setState({suggestions});
				}
			});
	},

	onFocus () {
		this.setState({focused: true});
	},

	onInputBlur () {
		this.setState({focused: true, inputFocused: false});
	},
	onInputFocus () {
		this.setState({focused: true, inputFocused: true});
	},
	onInputChange () {
		let {search} = this.refs;

		search = search && (React.findDOMNode(search).value || '').trim();

		this.setState({search});
	},


	render () {
		let {value = [], focused, search} = this.state;
		return (
			<div>

				<div className="share-with-entry" onClick={this.onFocus}>
					{value.map(e => (<ShareTarget key={e} entity={e}/>))}
					<span className="input-field">
						<input type="text" value={search} onBlur={this.onInputBlur} onFocus={this.onInputFocus} onChange={this.onInputChange} ref="search"/>
					</span>
				</div>

				{!focused ? null : (

					<div className="suggestions">



					</div>

				)}
			</div>
		);
	}
});
