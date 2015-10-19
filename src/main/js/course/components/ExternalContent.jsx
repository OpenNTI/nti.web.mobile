import React from 'react';

import {getModel} from 'nti.lib.interfaces';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

import Card from 'common/components/Card';
import Loading from 'common/components/Loading';

import BasePathAware from 'common/mixins/BasePath';
import ContextContributor from 'common/mixins/ContextContributor';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import {getService} from 'common/utils';

import Discussions from 'content/components/discussions';

const RelatedWorkReference = getModel('relatedworkref');

export default React.createClass({
	displayName: 'ExternalContent',
	mixins: [BasePathAware, ContextContributor, NavigatableMixin],

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
		return course.getOutlineNode(id).then(node=>({
			ntiid: node.getID(),
			label: node.label,
			// ref: node.ref,
			href: this.getBasePath() + node.href
		}));

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
				service.getParsedObject(id)
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
				<Discussions UserDataStoreProvider={storeProvider}>
					{relatedWorkRef && ( <Card item={relatedWorkRef} contentPackage={contentPackage} disableLink/> )}
				</Discussions>
			</div>
		);
	}
});
