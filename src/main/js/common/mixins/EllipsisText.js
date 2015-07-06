import React from 'react';


/**
 * Goal: Group dom reads/writes into single passes.
 */
class SharedExecution {
	static isInterupted (task) {
		return task.skip || (task.parent && this.isInterupted(task.parent));
	}

	static clear(t) { if(t) { t.skip = true; } }

	static schedual(fn) {
		let me = this.instance || (this.instance = new SharedExecution());

		let task = {fn};

		me.add(task);
		me.start();

		return task;
	}


	get () {
		return (this.tasks || []).filter(x => !SharedExecution.isInterupted(x) && !x.run);
	}


	add (task) {
		this.tasks = this.get();
		this.tasks.push(task);
	}


	start () {
		if (!this.timeout) {
			this.timeout = setTimeout(() => { this.stop(); this.run(); }, 1);
		}
	}

	stop () {
		if (this.timeout) {
			clearTimeout(this.timeout);
			delete this.timeout;
		}
	}


	run () {
		for (let task of this.get()) {
			try {
				let child = task.fn.call();
				if (child) {
					child.parent = task;
				}
			} catch(e) {
				console.error(e);
			}
			task.run = true;
		}

		this.tasks = this.get();
		console.debug('Ellipse Pass... remain: ', this.tasks.length);
	}
}




function truncateText (el, measure) {
	let textProperty = (el.textContent != null) ? 'textContent' : 'innerText';

	let getText = () => el[textProperty];
	let setText = text => el[textProperty] = text;

	let setTitleOnce = () => {
		el.setAttribute('title', getText());
		setTitleOnce = () => {};
	};

	return SharedExecution.schedual(() => {
		let box = el;
		if (measure === 'parent') {
			box = el.parentNode;
		}

		function work () {
			if (box.scrollHeight - (box.clientHeight || box.offsetHeight) >= 1) {
				if (getText() !== '...') {
					setTitleOnce();
					setText(getText().replace(/.(\.+)?$/, '...'));
					return SharedExecution.schedual(work);
				}
			}
		}

		return work();
	});
}

export default {

	propTypes: {
		measureOverflow: React.PropTypes.oneOf(['self', 'parent']).isRequired
	},

	getDefaultProps () {
		return {
			measureOverflow: 'self'
		};
	},

	componentDidMount () {
		SharedExecution.clear(this.tt);
		this.tt = truncateText(React.findDOMNode(this), this.props.measureOverflow);
	},


	componentDidUpdate () {
		SharedExecution.clear(this.tt);
		this.tt = truncateText(React.findDOMNode(this), this.props.measureOverflow);
	}
};
