import Filters from '../Filters';
import LibraryAccessor from './LibraryAccessor';

const sectionNames = {
	//SectionName's keys, MUST match the value.
	//To customize the display name, localize in the parts that display them.
	admin: 'admin',
	courses: 'courses',
	books: 'books'
};


const sectionPropertyMap = {
	[sectionNames.admin]: 'administeredCourses',
	[sectionNames.courses]: 'courses',
	[sectionNames.books]: ['bundles', 'packages']
};


const sectionFiltersMap = {
	[sectionNames.admin]: Filters,
	[sectionNames.courses]: Filters,
	[sectionNames.books]: [{name: 'Books'}]
};

function setSections (cmp) {
	if (cmp.isMounted()) {
		cmp.setState({sections: cmp.getAvailableSections()});
	}
}


export default {
	mixins: [LibraryAccessor],

	componentDidMount () {
		this.ensureLibraryLoaded().then(()=>setSections(this));
	},


	getSectionNames () {
		return Object.keys(sectionNames);
	},


	defaultSection () {
		return this.ensureLibraryLoaded()
			.then(() => {
				if (!this.getLibrary()) {
					console.warn('Early!!!');
				}
				let admin = this.getListForSection(sectionNames.admin);
					//if there are admin courses, default there...
				return admin.length ? sectionNames.admin :
					// if user doesn't have any courses default to the catalog.
						sectionNames.courses;
			});
	},


	getAvailableSections() {
		let names = this.getSectionNames();
		return names
			.map(x=>({key: x, label: sectionNames[x], count: this.getListForSection(x).length}))
			.filter(x=>x.count);
	},


	getListForSection (section) {
		let library = this.getLibrary();
		let properties = sectionPropertyMap[sectionNames[section]];
		if (!library) {
			return [];//not loaded yet
		}

		if (!properties) {
			console.error('Unknown section; returning empty array.');
			return [];
		}

		if (!Array.isArray(properties)) {
			properties = [properties];
		}

		return properties
			.map(p=>library[p])
			.reduce((a, l)=>a.concat(l), []);
	},


	getFiltersForSection (section) {
		return sectionFiltersMap[section];
	},


	getBinnedData (section) {
		let bins = [];
		let filters = this.getFiltersForSection(section);
		let items = this.getListForSection(section) || [];

		let getBin = o => ({
			name: o.name,
			items: (o.filter ? items.filter(o.filter) : items).sort(o.sort || (()=>0))
		});

		if (filters) {
			filters.forEach(f=> {
				let b = getBin(f);
				if (f.split){
					f.split(b.items).forEach(x=>bins.push(Object.assign(x, {name: f.name})));
				} else {
					bins.push(b);
				}
			});

		} else {
			bins.push({items});
		}


		return bins.filter(b=>b.items && b.items.length > 0);
	}
};
