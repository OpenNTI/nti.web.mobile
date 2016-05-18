import React from 'react';
import cx from 'classnames';
import {Component as Video} from 'video';

import ItemChanges from 'common/mixins/ItemChanges';


export default React.createClass({
	displayName: 'Title',
	mixins: [ItemChanges],

	propTypes: {
		entry: React.PropTypes.object
	},

	getItem (props) {
		return props.entry;
	},

	render () {
		const {entry} = this.props;
		if (!entry) { return; }

		const {promoImage: promo, Video: video} = entry;
		const context = [entry.getID()];

		const cls = cx('catalog-entry-title header',{
			'with-video' : video,
			'with-promo': promo
		});

		return (
			<div className={cls}>
				{video ? (

					<div className="video-wrap">
						<Video src={video} context={context}/>
					</div>

				) : promo ? (

					<div className="promo-image" style={{backgroundImage: `url(${promo})`}}/>

				) :
					null
				}

				<div className="title">
					<div className="text">{entry.Title}</div>
				</div>
			</div>
		);
	}
});
