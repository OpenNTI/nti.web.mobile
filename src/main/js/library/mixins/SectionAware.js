import Filters from '../Filters';
import LibraryAccessor from './LibraryAccessor';

const SECTION_NAMES = {
	//SectionName's keys, MUST match the value.
	//To customize the display name, localize in the parts that display them.
	admin: 'admin',
	courses: 'courses',
	books: 'books'
};


function swapFirstTwo (list) {
	let [A, B, ...C] = list;
	return [B, A, ...C];
}


const SECTION_PROPERTY_MAP = {
	[SECTION_NAMES.admin]: 'administeredCourses',
	[SECTION_NAMES.courses]: 'courses',
	[SECTION_NAMES.books]: ['bundles', 'packages']
};

const SECTION_PRESCIENCE = {
	[SECTION_NAMES.admin]: 0,
	[SECTION_NAMES.courses]: 1,
	[SECTION_NAMES.books]: 2
};


const SECTION_FILTERS_MAP = {
	[SECTION_NAMES.admin]: swapFirstTwo(Filters),
	[SECTION_NAMES.courses]: swapFirstTwo(Filters),
	[SECTION_NAMES.books]: [{name: 'Books'}]
};

const AVAILABLILITY = {
	[SECTION_NAMES.courses]: (list, library) =>
									(list.count > 0) || (library.hasCatalog || (()=> true)).call(library)
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
		return Object.keys(SECTION_NAMES);
	},


	defaultSection () {
		return this.ensureLibraryLoaded()
			.then(() => {
				if (!this.getLibrary()) {
					console.warn('Early!!!');
				}

				return this.getAvailableSections()[0].label;
			});
	},


	getAvailableSections () {
		let names = this.getSectionNames();
		let defaultAvailability = list => list.count > 0;
		return names
			.map(x=>({key: x, label: SECTION_NAMES[x], count: this.getListForSection(x).length}))
			.sort((a, b) => SECTION_PRESCIENCE[a.key] - SECTION_PRESCIENCE[b.key])
			.filter(x=> (AVAILABLILITY[x.key] || defaultAvailability)(x, this.getLibrary()));
	},


	getListForSection (section) {
		let library = this.getLibrary();
		let properties = SECTION_PROPERTY_MAP[SECTION_NAMES[section]];
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
		return SECTION_FILTERS_MAP[section];
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
				if (f.split) {
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
