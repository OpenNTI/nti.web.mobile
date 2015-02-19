export default [
	{handler: 'Login',		path:'login/*'},
	{handler: 'Contact',	path:'contact/:configname/'},
	{handler: 'Contacts',	path:'contacts/*',				navIndex: 2},
	{handler: 'Content',	path:'content/:pkgId/*'},
	{handler: 'Course',		path:'course/:course/*'},
	{handler: 'Enrollment',	path:'enroll/:course/*'},
	{handler: 'Forums',		path:'forums/*',				navIndex: 1},
	{handler: 'Library',	path:'library/*',				navIndex: 0},
	{handler: 'Profile',	path:'profile/:username(/*)'},
	{handler: 'Home',		path:''}
];
