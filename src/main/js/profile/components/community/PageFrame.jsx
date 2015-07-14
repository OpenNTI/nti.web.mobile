import React from 'react';
import TransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import Controls from './HeaderControls';
import Head from './Head';
import Invite from './Invite';

// import {getWidth} from 'common/utils/viewport';

import ContextSender from 'common/mixins/ContextSender';

import Gradient from 'common/components/GradientBackground';
import Link from 'common/components/ActiveLink';
import Loading from 'common/components/Loading';
import Page from 'common/components/Page';

export default React.createClass({
	displayName: 'Community:Page',
	mixins: [ContextSender],

	propTypes: {
		pageContent: React.PropTypes.any,

		entity: React.PropTypes.object.isRequired,

		selected: React.PropTypes.string
	},

	getInitialState () {
		return {
			selected: void 0,
			showMenu: false
		};
	},


	componentDidMount () {
		this.populateSections();
	},

	componentWillReceiveProps (nextProps) {
		let {entity} = this.props;
		if (entity !== nextProps.entity) {
			this.populateSections(nextProps);
		}
	},


	populateSections (props = this.props) {
		let {entity} = props;
		this.setState(this.getInitialState(), ()=>
			entity.getDiscussionBoardContents()
				.then(o => this.setState({sections: o.Items}))
			);
	},


	toggleMenu () {
		let {showMenu} = this.state;
		this.setState({showMenu: !showMenu});
	},


	render () {
		let {sections, showMenu} = this.state || {};
		let {selected, entity, pageContent = 'div'} = this.props;

		let narrow = true;// getWidth() < 1024;
		let Content = pageContent;
		let filterParams;

		if (!sections) {
			return ( <Loading/> );
		}

		if (selected) {
			filterParams = {
				source: selected
			};
		}

		let topLeft = narrow
			? ( <Invite entity={entity}/> )
			: ( <h1>{entity.displayName}</h1> );

		let body = narrow && showMenu
			? this.renderMenu()
			: ( <section key="content"><Content {...this.props} filterParams={filterParams}/></section> );

		let {removePageWrapping} = Content || {};

		return (
			<Page title="Community">
				<Gradient className="community profile-wrapper" imgUrl={entity.backgroundURL}>

				{removePageWrapping
					? ( <Content {...this.props}/> )
					: ( <div>
							<div className="profile-top-controls">
								{topLeft}
								<Controls entity={entity}/>
							</div>
							<div className="profile">
								<nav>
									<Head entity={entity}
										narrow={narrow}
										sections={sections}
										selected={selected}
										onMenuToggle={this.toggleMenu}
										/>
								</nav>

								<TransitionGroup transitionName="community-menu" className="coordinate-root">
									{body}
								</TransitionGroup>
							</div>
						</div>
					)}

				</Gradient>
			</Page>
		);
	},


	renderMenu () {
		let {sections = []} = this.state;
		let all = {ID: '', title: 'All Topics'};

		let animationDelay = i => ({animationDelay: (i * 100) + 'ms'});

		let items = [all].concat(sections).map((x, i)=> (
			x.title !== 'Forum' && <Link href={(`/activity/${x.ID}/`).replace(/\/\//g, '/')}
				style={animationDelay(i)}
				onClick={this.toggleMenu}>{x.title}</Link>
		));

		return React.createElement('nav', {key: 'menu', className: 'fullscreen-sections'}, ...items);

	}
});
