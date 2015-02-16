import React from 'react';

import {decodeFromURI} from 'dataserverinterface/utils/ntiids';

import NotFound from 'notfound/components/View';
import Loading from 'common/components/Loading';

import Store from '../Store';

import Detail from './Detail';
import EnrollButton from './EnrollButton';


export default React.createClass({
	displayName: 'CatalogEntryDetail',

	propTypes: {
		entryId: React.PropTypes.string,
		entry: React.PropTypes.object,
	},

	getInitialState () { return { loading: true }; },


	componentDidMount () {
		Store.addChangeListener(this._onChange);
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount () {
		Store.removeChangeListener(this._onChange);
	},


	componentWillReceiveProps (nextProps) {
		if (nextProps.entryId !== this.props.entryId || nextProps.entry !== this.props.entry) {
			this.getDataIfNeeded(nextProps);
		}
	},


	getDataIfNeeded (props) {
		var entryId = decodeFromURI(props.entryId);
		var entry = props.entry || Store.getEntry(entryId);
		var loading = entry && entry.loading;

		entry = loading ? null : entry;

		this.setState({
			loading: loading,
			entry: entry
		});
	},


	_onChange () {
		this.getDataIfNeeded(this.props);
	},


	render () {
		var {entry, loading} =  this.state;

		if (loading) {
			return (<Loading />);
		}

		if (!entry) {
			return (<NotFound/>);
		}

		return (
			<div>
				<Detail {...this.props} entry={entry}/>
				<EnrollButton catalogEntry={entry} />
			</div>
		);
	}

});
