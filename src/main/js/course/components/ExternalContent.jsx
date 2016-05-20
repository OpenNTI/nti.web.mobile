import React from 'react';

import {getModel} from 'nti-lib-interfaces';
import Logger from 'nti-util-logger';
import {decodeFromURI} from 'nti-lib-ntiids';

import Card from 'common/components/Card';
import {Loading} from 'nti-web-commons';

import ContextContributor from 'common/mixins/ContextContributor';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import {getService} from 'nti-web-client';

import Discussions from 'content/components/discussions';
import CourseLinker from 'library/mixins/CourseContentLink';

import {LESSONS} from '../Sections';

const logger = Logger.get('course:components:ExternalContent');

const RelatedWorkReference = getModel('relatedworkref');

export default React.createClass({
	displayName: 'ExternalContent',
	mixins: [CourseLinker, ContextContributor, NavigatableMixin],

	propTypes: {
		contentPackage: React.PropTypes.object.isRequired,

		relatedWorkRefId: React.PropTypes.string.isRequired,

		//TODO: refactor this into two components... one generic, one with getContext.
		outlineId: React.PropTypes.string.isRequired,
		course: React.PropTypes.object.isRequired
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

	componentWillReceiveProps (nextProps) {
		if (this.props.relatedWorkRefId !== nextProps.relatedWorkRefId) {
			this.fill(nextProps);
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
			return ( <Loading/> );
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
