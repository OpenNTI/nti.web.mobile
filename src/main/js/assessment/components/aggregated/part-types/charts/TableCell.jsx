import React from 'react';
import cx from 'classnames';


export default class extends React.Component {
    static displayName = 'TableCell';

    static propTypes = {
		label: React.PropTypes.string,
		count: React.PropTypes.number,
		percent: React.PropTypes.number,
		total: React.PropTypes.number,
		rank: React.PropTypes.oneOf(['first', 'second', 'none'])
	};

    static defaultProps = {
        rank: 'none'
    };

    render() {
		const {props: {count, rank, label}} = this;

		const cls = cx({
			['rank-' + rank]: rank
		});

		// const percentString = (percent || 0).toFixed(2);

		return (
			<td className={cls} data-count={count} data-for={label}>
				{/*percentString*/count}
			</td>
		);
	}
}
