import React from 'react';
import { Link } from 'react-router-component';

export default function LoginButton(props) {
	return <Link {...props} className="tiny button" />;
}
