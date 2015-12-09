import React from 'react';

class Queue {
	constructor (maxConcurrent = 4, interval = 200) {
		Object.assign(this, {
			list: [],
			maxConcurrent,
			interval
		});
	}

	add (o) {
		const index = this.list.findIndex(x => x === o);
		if (index > -1) {//move to the end.
			this.list.splice(index, 1);

			console.debug('repeat?');
		}
		this.list.push(o);
	}

	remove (o) {
		const index = this.list.findIndex(x => x === o);
		if (index > -1) {
			this.list.splice(index, 1);
		}
	}

	wait (o) {
		this.add(o);

		const {interval, maxConcurrent} = this;

		return new Promise((go, abort) => {

			const check = () => {
				const {list} = this;
				const inList = list.includes(o);
				const inWindow = list.slice(0, maxConcurrent).includes(o);

				if (inWindow) {
					go();
				}
				else if (!inList) {
					abort();
				}
				else {
					setTimeout(check, interval);
				}
			};

			check();
		});
	}
}

const GOV = new Queue();

export default React.createClass({
	displayName: 'content:Icon',

	propTypes: {
		src: React.PropTypes.string
	},

	getInitialState () {
		return {};
	},

	componentWillMount () { this.start(); },
	componentWillReceiveProps (nextProps) {
		if (this.props.src !== nextProps.src) {
			this.start(nextProps);
		}
	},

	start (props = this.props) {
		const {src} = props;
		if (src) {
			GOV.wait(this)
				.then(()=> {
					if (this.isMounted()) {
						this.setState({icon: src});
					}
				})
				.catch(()=> console.log('Huh?'));
		}
	},

	componentWillUnmount () {
		GOV.remove(this);
	},

	onFinish () {
		GOV.remove(this);
	},

	render () {
		const {icon} = this.state;
		return (
			<img {...this.props}
				src={icon}
				onLoad={this.onFinish}
				onError={this.onFinish}
				/>
		);
	}
});
