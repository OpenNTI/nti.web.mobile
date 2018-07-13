import React from 'react';
import PropTypes from 'prop-types';
import { decodeFromURI } from '@nti/lib-ntiids';

import {Component as ContextSender} from 'common/mixins/ContextSender';

import GiftRedeem from '../store-enrollment/components/GiftRedeem';

export default class Redeem extends React.Component {
	static propTypes = {
		entryId: PropTypes.string
	}

	render () {
		return (
			<React.Fragment>
				<ContextSender getContext={getContext} {...this.props} />
				<GiftRedeem entryId={this.props.entryId} />
			</React.Fragment>
		);
	}
}

async function getContext () {
	//this will be called with the contextSender's context ("this")
	const context = this;
	const { entryId } = context.props;

	return [
		{
			label: 'Course',
			ntiid: decodeFromURI(entryId),
			href: context.makeHref('item/' + entryId + '/enrollment/')
		},
		{
			label: 'Redeem'
		}
	];
}
