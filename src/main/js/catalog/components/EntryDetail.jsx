import React from 'react';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import NotFound from 'notfound/components/View';
import Loading from 'common/components/Loading';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';
import NavigationAware from 'common/mixins/NavigationAware';

import Store from '../Store';

import Detail from './Detail';
import EnrollButton from './EnrollButton';


export default React.createClass({
	displayName: 'EntryDetail',
	mixins: [BasePathAware, ContextSender, NavigationAware],

	propTypes: {
		entryId: React.PropTypes.string,
		entry: React.PropTypes.object
	},

	getInitialState () { return { loading: true }; },


	componentDidMount () {
		Store.addChangeListener(this.onChange);
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount () {
		Store.removeChangeListener(this.onChange);
	},


	componentWillReceiveProps (nextProps) {
		if (nextProps.entryId !== this.props.entryId || nextProps.entry !== this.props.entry) {
			this.getDataIfNeeded(nextProps);
		}
	},


	getDataIfNeeded (props) {
		let entryId = decodeFromURI(props.entryId);
		let entry = props.entry || Store.getEntry(entryId);
		let loading = entry && entry.loading;

		entry = loading ? null : entry;

		this.setPageSource(Store.getPageSource(), entryId);

		this.setState({
			loading: loading,
			entry: entry
		});
	},


	makeHref (ref) {
		return this.getNavigable().makeHref('item/' + ref);
	},


	getContext () {
		let ref = 'item/' + ref;
		let href = this.getNavigable().makeHref(ref);

		let {entryId, entry} = this.props;
		let id = decodeFromURI(entryId);

		entry = entry || Store.getEntry(id);

		let label = (entry || {}).Title;

		return Promise.resolve({
			ntiid: id,
			label,
			href,
			ref
		});

	},


	onChange () {
		this.getDataIfNeeded(this.props);
	},


	render () {
		let {entry, loading} = this.state;

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
