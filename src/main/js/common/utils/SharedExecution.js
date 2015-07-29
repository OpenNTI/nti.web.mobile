/**
 * Goal: Group dom reads/writes into single passes.
 */
export default class SharedExecution {
	static isInterrupted (task) {
		return task.skip || (task.parent && this.isInterrupted(task.parent));
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
		return (this.tasks || []).filter(x => !SharedExecution.isInterrupted(x) && !x.run);
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

		let {length} = this.tasks;

		this.detectLeaks('Execution Pass... remain: ', length);
		if (length === 0) {
			this.noLeaks();
		}
	}


	detectLeaks (...args) {
		clearTimeout(this.leakWarning);
		this.leakWarning = setTimeout(() => console.debug(...args), 20);
	}

	noLeaks () {
		clearTimeout(this.leakWarning);
	}
}
