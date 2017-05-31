import React from 'react';

import {Link} from 'react-router-component';

//import cx from 'classnames';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

export default class extends React.Component {
    static displayName = 'Community:Head';

    static propTypes = {
		entity: React.PropTypes.object,

		sections: React.PropTypes.array,

		selected: React.PropTypes.object,

		narrow: React.PropTypes.bool,

		onMenuToggle: React.PropTypes.func
	};

    static defaultProps = {
        onMenuToggle: () => {}
    };

    onMenuToggleClicked = (e) => {
		e.preventDefault();
		e.stopPropagation();

		this.props.onMenuToggle();
	};

    render() {
		let {entity, narrow, sections = [], selected} = this.props;

		selected = (sections.find(x=> x.ID === selected) || {}).title || 'All Topics';

		return (
			<div className="community head">
				<div className="coordinate-root">
					<div className="avatar-wrapper">
						<Avatar entity={entity}/>
					</div>
					{ narrow && (

						<div className="meta">
							<Link href="/info/" className="info-icon" />
							<DisplayName entity={entity} tag="h1"/>
							<ul>
								<li><a href="#" className="selector" onClick={this.onMenuToggleClicked}>{selected}</a></li>
							</ul>
						</div>

					) }
				</div>
			</div>
		);
	}
}
