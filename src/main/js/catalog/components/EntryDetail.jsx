import React from 'react';

import Logger from 'nti-util-logger';
import {decodeFromURI} from 'nti-lib-ntiids';

import NotFound from 'notfound/components/View';
import {Loading} from 'nti-web-commons';

import ContextSender from 'common/mixins/ContextSender';
import NavigationAware from 'common/mixins/NavigationAware';

import GiftOptions from 'enrollment/components/enrollment-option-widgets/GiftOptions';
import EnrollmentStatus from 'enrollment/components/EnrollmentStatus';

import Store from '../Store';

import Detail from './Detail';

const logger = Logger.get('catalog:EntryDetail');

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
		let loading = Store.isLoaded ? (entry && entry.loading) : true;

		entry = loading ? null : entry;

		this.replaceState({ loading, entry });

		this.setPageSource(Store.getPageSource(), entryId);
	},


	makeHref (ref) {
		return this.getNavigable().makeHref('item/' + ref);
	},

	componentDidUpdate () {
		logger.debug('DidUp', this.props.entryId);
	},

	getContext () {
		const MAX_WAIT = 30000;//30 seconds

		return new Promise((resolve, reject) => {
			const started = new Date();
			const step = () => {
				const {entryId} = this.props;
				logger.debug('getContext',entryId);
				const ntiid = decodeFromURI(entryId);
				const href = this.makeHref(entryId);
				const {entry} = this.state;
				const label = (entry || {}).Title;
				if (!entry) {
					if (new Date() - started > MAX_WAIT) {
						return reject('Timeout');
					}

					return setTimeout(step, 100);
				}

				resolve({ ref: ntiid, ntiid, label, href });
			};

			step();
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
			<div className="course-info">
				<Detail {...this.props} entry={entry}/>
				<EnrollmentStatus catalogEntry={entry} />
				<GiftOptions catalogEntry={entry} />
			</div>
		);
	}

});
