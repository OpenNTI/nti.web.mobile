import PropTypes from 'prop-types';
import React from 'react';
import {loadSelectOptionsFromUserLinkRel} from '../Actions';
import Store from '../Store';
import * as Constants from '../Constants';
import {Loading} from 'nti-web-commons';

export default class extends React.Component {
    static displayName = 'forms:Select';

    static propTypes = {

		/**
		* the list of options for the select: an array of
		* objects with name and value properties
		* or an array of strings.
		*/
		options: PropTypes.array,

		/**
		* optionsLink property if provided should be an object
		* in the shape of:
		*   {
		* 	  type: 'rel',
		* 	  rel: 'fmaep.state.names'
		*   }
		* where rel is a reference to a Link available on User
		* This allows room for other types in the future (e.g. raw urls)
		*/
		optionsLink: PropTypes.object,


		field: PropTypes.object.isRequired
	};

    state = {
        loading: false
    };

    componentWillMount() {
		if (this.props.optionsLink) {
			this.setState({
				loading: true
			});
		}
	}

    componentDidMount() {
		Store.addChangeListener(this.onStoreChange);
		if (this.props.optionsLink) {
			this.loadOptions();
		}
	}

    componentWillUnmount() {
		Store.removeChangeListener(this.onStoreChange);
	}

    loadOptions = () => {
		let link = this.props.optionsLink || {};
		if (link.type === 'rel' && link.rel) {
			loadSelectOptionsFromUserLinkRel(link.rel);
		}
		else {
			throw new Error(
				'loadOptions requires that this.props.optionsLink be an object with type:\'rel\' and ' +
				'a rel property for looking getting a link from user.'
			);
		}
	};

    onStoreChange = (event) => {
		let action = event.action || {};
		let rel = (action.payload || {}).link;
		if(event.type === Constants.URL_RETRIEVED && rel && this.props.optionsLink && rel === this.props.optionsLink.rel) {
			this.setState({
				loading: false,
				options: event.response
			});
		}
	};

    // if our options are simple strings turn them into objects
    // with name and value properties.
    makeOption = (option) => {
		return typeof option === 'string' ? { name: option, value: option } : option;
	};

    renderOptions = () => {
		let raw = this.state.options || this.props.options || [];
		let options = raw.map(item => {
			let o = this.makeOption(item);
			return React.createElement('option', Object.assign(o, {
				children: o.name,
				name: void 0,
				key: o.value
			}));
		});

		// include empty option
		options.unshift(<option value="" key="blank"/>);

		return options;

	};

    render() {

		if (this.state.loading) {
			return <Loading.Whacky />;
		}

		return (
			<label>
				<span>{this.props.field.label}</span>
				<select {...this.props}>
					{this.renderOptions()}
				</select>
			</label>
		);
	}
}
