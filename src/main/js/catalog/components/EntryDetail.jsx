import React from 'react';

import {decodeFromURI} from 'nti-lib-interfaces/lib/utils/ntiids';

import NotFound from 'notfound/components/View';
import Loading from 'common/components/Loading';

import ContextSender from 'common/mixins/ContextSender';
import NavigationAware from 'common/mixins/NavigationAware';

import Store from '../Store';

import Detail from './Detail';
import EnrollButton from './EnrollButton';


export default React.createClass({
	displayName: 'EntryDetail',
	mixins: [ContextSender, NavigationAware],

	propTypes: {
		entryId: React.PropTypes.string
	},

	getInitialState () { return { loading: true }; },


	componentDidMount () {
		this.getDataIfNeeded(this.props);
		Store.addChangeListener(this.onChange);
	},


	componentWillUnmount () {
		Store.removeChangeListener(this.onChange);
	},


	componentWillReceiveProps (nextProps) {
		if (nextProps.entryId !== this.props.entryId) {
			this.getDataIfNeeded(nextProps);
		}
	},


	getDataIfNeeded (props) {
		const entryId = decodeFromURI(props.entryId);
		let entry = Store.getEntry(entryId);
		let loading = !entry || entry.loading;

		entry = loading ? null : entry;

		this.setState({ loading, entry },
			() => this.setPageSource(Store.getPageSource(), entryId));
	},


	makeHref (ref) {
		return this.getNavigable().makeHref('item/' + ref);
	},


	getContext () {
		const {entryId} = this.props;
		const ntiid = decodeFromURI(entryId);
		const href = this.makeHref(entryId);

		const entry = Store.getEntry(ntiid);

		const label = (entry || {}).Title;

		return {
			ref: entryId,
			ntiid,
			label,
			href
		};

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
