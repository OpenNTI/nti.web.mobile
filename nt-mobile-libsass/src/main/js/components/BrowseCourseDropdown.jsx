/** @jsx React.DOM */

/*
	A dropdown that shows when you click 'Browse Courses'.
*/

var React = require('react/addons');
var CatalogEntry = require('./CatalogEntry');

module.exports = React.createClass({
	handleChange: function(event){
		this.setState({value: event.target.value});
		console.log(event);
	},
	render: function() {
		return (
			<div id="drop2" data-dropdown-content className="medium f-dropdown content">
				<ul className="large small-block-grid-2 medium-block-grid-3 large-block-grid-3">
					
					<CatalogEntry src="https://ou-alpha.nextthought.com/content/ANTH1613_Native_Peoples_of_Oklahoma/presentation-assets/webapp/v1/contentpackage-landing-232x170.png"
							title="Native Peoples of Oklahoma"/>
					<CatalogEntry src="https://ou-alpha.nextthought.com/content/ANTH4970_Practical_Importance_of_Human_Evolution/presentation-assets/webapp/v1/contentpackage-landing-232x170.png"
							title="Practical Importance of Human Evolution" />
					<CatalogEntry src="https://ou-alpha.nextthought.com/content/CHEM4970_Chemistry_of_Beer/presentation-assets/webapp/v1/contentpackage-landing-232x170.png"
							title="Chemistry of Beer" />
					<CatalogEntry src="https://ou-alpha.nextthought.com/content/COMM4970_Understanding_and_Detecting_Deception/presentation-assets/webapp/v1/contentpackage-landing-232x170.png"
							title="Understanding and Detecting Deception" />
					<CatalogEntry src="https://ou-alpha.nextthought.com/content/CS1300_Power_and_Elegance_of_Computational_Thinking/presentation-assets/webapp/v1/contentpackage-landing-232x170.png"
							title="Power and Elegance of Computational Thinking" />
					<CatalogEntry src="https://ou-alpha.nextthought.com/content/CS1323_Intro_to_Computer_Programming/presentation-assets/webapp/v1/contentpackage-landing-232x170.png"
							title="Introduction to Computer Programming" />
					<CatalogEntry src="https://ou-alpha.nextthought.com/content/EDAH5023_Admin_of_Adult_and_Higher_Education/presentation-assets/webapp/v1/contentpackage-landing-232x170.png"
							title="Administration of Adult and Higher Eductation" />
					<CatalogEntry src="https://ou-alpha.nextthought.com/content/ENGR1510_Intro_to_Water/presentation-assets/webapp/v1/contentpackage-landing-232x170.png"
							title="Introduction to Water" />
					<CatalogEntry src="https://ou-alpha.nextthought.com/content/GEOG3890_Hydraulic_Fracturing_and_Water_Resources/presentation-assets/webapp/v1/contentpackage-landing-232x170.png"
							title="Hydralic Fracturing and Water Resources" />
					<CatalogEntry src="https://ou-alpha.nextthought.com/content/GEOL1114_Physical_Geology/presentation-assets/webapp/v1/contentpackage-landing-232x170.png"
							title="Physical Geology for Science and Engineering Majors" />
					<CatalogEntry src="https://ou-alpha.nextthought.com/content/HSCI3013_History_of_Science/presentation-assets/webapp/v1/contentpackage-landing-232x170.png"
							title="History of Science to the Age of Newton" />
					<CatalogEntry src="https://ou-alpha.nextthought.com/content/PSC4283_Civil_Rights_and_Civil_Liberties/presentation-assets/webapp/v1/contentpackage-landing-232x170.png"
							title="Civil Rights and Civil Liberties" />
					<CatalogEntry src="https://ou-alpha.nextthought.com/content/SOC1113_Intro_to_Sociology/presentation-assets/webapp/v1/contentpackage-landing-232x170.png"
							title="Introduction to Sociology" />
				</ul>
			</div>
		);
	}
});
