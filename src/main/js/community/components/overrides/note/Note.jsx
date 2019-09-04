import React from 'react';
import PropTypes from 'prop-types';
import Router from 'react-router-component';
import {encodeForURI} from '@nti/lib-ntiids';

import {Component as ContextSender} from 'common/mixins/ContextSender';

// import Edit from '../../../../../content/components/discussions/EditNote';
import ViewComment from '../../../../content/components/discussions/ViewComment';
import Detail from '../../../../content/components/discussions/Detail';

export default class CommunitNoteOverride extends React.Component {
	static propTypes = {
		note: PropTypes.object,
		channel: PropTypes.object,
		extraRouterProps: PropTypes.object
	}

	render () {
		const {note, extraRouterProps, ...otherProps} = this.props;

		return (
			<ContextSender getContext={getContext} {...this.props}>
				<Router.Locations contextual {...(extraRouterProps || {})}>
					<Router.Location path="/:commentId/edit(/*)" handler={ViewComment} root={note} {...otherProps} edit />
					<Router.Location path="/:commentId(/*)" handler={ViewComment} root={note} {...otherProps} />
					<Router.NotFound handler={Detail} item={note} {...otherProps} />
				</Router.Locations>
			</ContextSender>
		);
	}
}

function getContext () {
	const {note, channel} = this.props;
	const hrefPart = `${encodeForURI(channel.getID())}/${encodeForURI(note.getID())}`;

	return {
		label: (note && note.title) || 'Note',
		href: this.makeHref(hrefPart),
		ntiid: note.getID()
	};
}