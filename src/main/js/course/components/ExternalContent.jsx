import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {getModel} from '@nti/lib-interfaces';
import Logger from '@nti/util-logger';
import {decodeFromURI} from '@nti/lib-ntiids';
import {Card, Loading, Mixins} from '@nti/web-commons';
import {getService} from '@nti/web-client';

import ContextContributor from 'common/mixins/ContextContributor';
import Discussions from 'content/components/discussions';
import CourseLinker from 'library/mixins/CourseContentLink';

import {LESSONS} from '../Sections';

const logger = Logger.get('course:components:ExternalContent');

const RelatedWorkReference = getModel('relatedworkref');

export default createReactClass({
	displayName: 'ExternalContent',
	mixins: [CourseLinker, ContextContributor, Mixins.NavigatableMixin],

	propTypes: {
		contentPackage: PropTypes.object.isRequired,

		relatedWorkRefId: PropTypes.string.isRequired,

		//TODO: refactor this into two components... one generic, one with getContext.
		outlineId: PropTypes.string.isRequired,
		course: PropTypes.object.isRequired
	},


	getContext () {
		let {outlineId, course} = this.props;

		let id = decodeFromURI(outlineId);
		return course.getOutlineNode(id)
			.then(node=>({
				ntiid: id,
				label: node.label,
				// ref: node.ref,
				href: this.courseHref(course.getID(), LESSONS) + node.ref + '/'
			}),
			//error
			() => {
				logger.warn('Could not find outline node: %s in course: %s', id, course.getID());
			});

	},


	getInitialState () {
		return {};
	},


	componentDidMount () {
		this.fill(this.props);
	},

	componentDidUpdate (prevProps) {
		if (this.props.relatedWorkRefId !== prevProps.relatedWorkRefId) {
			this.fill(this.props);
		}
	},


	fill (props) {
		let id = decodeFromURI(props.relatedWorkRefId);
		let {store} = this.state;

		if (store) {
			store.removeListener('change', this.onStoreChanged);
		}

		getService()
			.then(service =>
				service.getObject(id)
					.then(
						relatedWorkRef => {
							this.setState({relatedWorkRef});
							return relatedWorkRef;
						},
						() => RelatedWorkReference.fromID(service, id)
					)
					.then(ref => ref.getUserData())
			)

			.then(x => x.waitForPending().then(()=>x))
			.then(x => {
				x.addListener('change', this.onStoreChanged);
				this.setState({
					store: x,
					storeProvider: {getUserDataStore: ()=>x}
				},
				()=> this.onStoreChanged(x));
			});
	},


	onStoreChanged (store) {
		if (this.state.store !== store) {
			return;
		}

		//in the future, update stuff ...but atm, we don't need to do anything.
	},


	render () {
		let {contentPackage} = this.props;
		let {relatedWorkRef, storeProvider} = this.state;

		if (!storeProvider) {
			return ( <Loading.Mask /> );
		}

		return (
			<div>
				<Discussions UserDataStoreProvider={storeProvider} contentPackage={contentPackage} >
					{relatedWorkRef && ( <Card item={relatedWorkRef} contentPackage={contentPackage} /> )}
				</Discussions>
			</div>
		);
	}
});
