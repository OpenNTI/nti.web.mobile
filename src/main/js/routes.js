export default [
	{handler: 'Login',		path:'login/*'},
	{handler: 'Contact',	path:'contact/:configname/'},
	{handler: 'Content',	path:'content/:pkgId/*'},
	{handler: 'Course',		path:'course/:course/*'},
	{handler: 'Enrollment',	path:'enroll/:course/*'},
	{handler: 'Library',	path:'library/*'},
	{handler: 'Profile',	path:'profile/:username(/*)'},
	{handler: 'Home',		path:''}
];
