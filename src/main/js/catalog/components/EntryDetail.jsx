import React from 'react';
import PropTypes from 'prop-types';
import {decodeFromURI} from 'nti-lib-ntiids';
import {Loading} from 'nti-web-commons';

import NotFound from 'notfound/components/View';
import {Component as ContextSender} from 'common/mixins/ContextSender';
import GiftOptions from 'enrollment/components/enrollment-option-widgets/GiftOptions';
import EnrollmentStatus from 'enrollment/components/EnrollmentStatus';
import {getCatalogEntry} from 'enrollment/Api';

import Detail from './Detail';

export default class EntryDetail extends React.Component {

	static propTypes = {
		entryId: PropTypes.string
	}

	state = { loading: true }


	componentDidMount () {
		this.getDataIfNeeded(this.props);
	}


	componentWillUnmount () {}


	componentWillReceiveProps (nextProps) {
		if (nextProps.entryId !== this.props.entryId) {
			this.getDataIfNeeded(nextProps);
		}
	}


	async getDataIfNeeded (props) {
		this.setState({loading: true});
		const entryId = decodeFromURI(props.entryId);
		let entry = null;
		let error = null;

		try {
			entry = await getCatalogEntry(entryId);
			this.setState({ loading: false, entry });
			// this.setPageSource(Store.getPageSource(), entryId);
		} catch (e) {
			error = e;
		}

		this.setState({entry, loading: false, error});
	}


	render () {
		const {state: {entry, loading}, props: {entryId}} = this;

		if (loading) {
			return (<Loading.Mask />);
		}

		if (!entry) {
			return (<NotFound/>);
		}

		return (
			<div className="course-info">
				<ContextSender getContext={getContext} entry={entry} entryId={entryId} />
				<Detail {...this.props} entry={entry}/>
				<EnrollmentStatus catalogEntry={entry} />
				<GiftOptions catalogEntry={entry} />
			</div>
		);
	}

}


async function getContext () {
	const context = this;
	const {entry, entryId} = context.props;
	const ntiid = decodeFromURI(entryId);
	const href = context.getNavigable().makeHref('item/' + entryId);

	const label = (entry || {}).Title;

	return {
		ref: ntiid,
		ntiid,
		label,
		href
	};
}
