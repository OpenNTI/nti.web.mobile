import React from 'react';

import Loading from 'common/components/Loading';
import {NavigatableMixin} from 'react-router-component';


export default React.createClass({
	displayName: 'DefaultPath',
	mixins: [NavigatableMixin],

	propTypes: {
		filters: React.PropTypes.array,
		list: React.PropTypes.array,
		defaultFilter: React.PropTypes.string
	},

	startRedirect () {
		clearTimeout(this.pendingRedirect);
		this.pendingRedirect = setTimeout(()=> this.performRedirect(), 1);
	},


	performRedirect () {
		let path = this.defaultFilterPath();
		if (path) {
			this.navigate(`/${path}`, {replace: true});
		}
	},


	findFilter (name) {
		return this.props.filters.find(f => f.name === name);
	},


	/**
	 *	Returns the path of the first filter that doesn't result in an emtpy list,
	 *	or the first filter if all result in empty lists,
	 *	or null if this.props.filters.length === 0
	 *
	 *	@return {object} The default filter or nothing.
	 */
	defaultFilterPath () {
		if (this.props.defaultFilter) {
			let dfp = this.props.defaultFilter;
			let df = (typeof dfp === 'string') ? this.findFilter(dfp) : dfp;
			return (df || {}).path;
		}

		let {filters = [], list} = this.props;
		let result = filters.length > 0 ? filters[0].kind : null;

		filters.some(filter => {
			if (list.filter(filter.filter).length > 0) {
				result = filter.path || filter.name.toLowerCase();
				return true;
			}
			return false;
		});

		return result;
	},


	isDefaulted () {
		let {filters = []} = this.props;
		let p = this.getPath() || '';

		let inSet = ()=> filters.reduce((x, f)=> x || (f.path === p), null);


		return /^.?null$/i.test(p) || !inSet(p);
	},


	componentDidUpdate () {
		if(this.isDefaulted()) {
			this.startRedirect();
		}
	},


	componentDidMount () {
		if(this.isDefaulted()) {
			this.startRedirect();
		}
	},


	render () {
		return (<Loading/>);
	}

});
