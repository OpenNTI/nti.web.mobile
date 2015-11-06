
export default function MockAssignment (props = {}) {

	const NoSubmit = false;
	/* eslint-disable camelcase */
	const available_for_submission_beginning = props['available_for_submission_beginning'] || '2014-08-16T05:00:00Z';
	const available_for_submission_ending = props['available_for_submission_ending'] || '2015-08-29T04:59:59Z';

	const proto = {
		MimeType: 'application/vnd.nextthought.assessment.assignment',
		canBeSubmitted: () => !NoSubmit,
		isNonSubmit: () => NoSubmit,
		isLate: () => true,
		available_for_submission_ending,
		available_for_submission_beginning,
		getDueDate () { return new Date(this.available_for_submission_ending); },
		getAssignedDate () { return new Date(this.available_for_submission_beginning); }
	};

	return Object.assign({}, proto, props);
}

// {
// 	getAssignedDate: () => new Date('2014-08-16T05:00:00Z'),
//
// 	getDueDate: () => new Date('2015-08-29T04:59:59Z'),
// 	'CategoryName': 'default',
// 	'CreatedTime': 0,
// 	'IsTimedAssignment': false,
// 	'Last Modified': 0,
// 	'Links': [
// 		{
// 			'Class': 'Link',
// 			'href': '/dataserver2/%2B%2Betc%2B%2Bhostsites/platform.ou.edu/%2B%2Betc%2B%2Bsite/Courses/Fall2015/BIOL%202124/AssignmentHistories/ray.hatfield@gmail.com/tag:nextthought.com,2011-10:OU-NAQ-OU_BIOL2124_F_2015_Human_Physiology.naq.asg.assignment:signature_form',
// 			'rel': 'History'
// 		},
// 		{
// 			'Class': 'Link',
// 			'href': '/dataserver2/%2B%2Betc%2B%2Bhostsites/platform.ou.edu/%2B%2Betc%2B%2Bsite/Courses/Fall2015/BIOL%202124/AssignmentSavepoints/ray.hatfield@gmail.com/tag:nextthought.com,2011-10:OU-NAQ-OU_BIOL2124_F_2015_Human_Physiology.naq.asg.assignment:signature_form/Savepoint',
// 			'rel': 'Savepoint'
// 		},
// 		{
// 			'Class': 'Link',
// 			'href': '/dataserver2/%2B%2Betc%2B%2Bhostsites/platform.ou.edu/%2B%2Betc%2B%2Bsite/Courses/Fall2015/BIOL%202124/AssignmentMetadata/ray.hatfield@gmail.com/tag:nextthought.com,2011-10:OU-NAQ-OU_BIOL2124_F_2015_Human_Physiology.naq.asg.assignment:signature_form/Metadata',
// 			'rel': 'Metadata'
// 		}
// 	],
// 	'Metadata': {
// 		'Duration': 1.7652091979980469,
// 		'StartTime': 1445441565.258911
// 	},
// 	'MimeType': 'application/vnd.nextthought.assessment.assignment',
// 	'NTIID': 'tag:nextthought.com,2011-10:OU-NAQ-OU_BIOL2124_F_2015_Human_Physiology.naq.asg.assignment:signature_form',
// 	'NoSubmit': false,
// 	'OID': 'tag:nextthought.com,2011-10:system-OID-0x083dcc:5573657273:etWU05F383A',
// 	'available_for_submission_beginning': '2014-08-16T05:00:00Z',
// 	'available_for_submission_ending': '2015-08-29T04:59:59Z',
// 	'category_name': 'default',
// 	'containerId': 'tag:nextthought.com,2011-10:OU-HTML-OU_BIOL2124_F_2015_Human_Physiology.honor_code_signature',
// 	'content': '<a name=\'assignment:signature_form\'></a>',
// 	'is_non_public': false,
// 	'locked': false,
// 	'no_submit': false,
// 	'ntiid': 'tag:nextthought.com,2011-10:OU-NAQ-OU_BIOL2124_F_2015_Human_Physiology.naq.asg.assignment:signature_form',
// 	'parts': [
// 		{
// 			'MimeType': 'application/vnd.nextthought.assessment.assignmentpart',
// 			'NTIID': 'tag:nextthought.com,2011-10:system-OID-0x0c5ad5:5573657273',
// 			'OID': 'tag:nextthought.com,2011-10:system-OID-0x0c5ad5:5573657273',
// 			'auto_grade': false,
// 			'content': '',
// 			'question_set': {
// 				'MimeType': 'application/vnd.nextthought.naquestionset',
// 				'NTIID': 'tag:nextthought.com,2011-10:OU-NAQ-OU_BIOL2124_F_2015_Human_Physiology.naq.set.qset:honor_signature',
// 				'OID': 'tag:nextthought.com,2011-10:system-OID-0x083dce:5573657273:etWU05F3838',
// 				'containerId': 'tag:nextthought.com,2011-10:OU-HTML-OU_BIOL2124_F_2015_Human_Physiology.honor_code_signature',
// 				'ntiid': 'tag:nextthought.com,2011-10:OU-NAQ-OU_BIOL2124_F_2015_Human_Physiology.naq.set.qset:honor_signature',
// 				'questions': [
// 					{
// 						'ContentRoot': '/content/sites/platform.ou.edu/OU_BIOL2124_F_2015_Human_Physiology/',
// 						'MimeType': 'application/vnd.nextthought.naquestion',
// 						'NTIID': 'tag:nextthought.com,2011-10:OU-NAQ-OU_BIOL2124_F_2015_Human_Physiology.naq.qid.honor.01',
// 						'OID': 'tag:nextthought.com,2011-10:system-OID-0x083dcd:5573657273:etWU05F3839',
// 						'containerId': 'tag:nextthought.com,2011-10:OU-HTML-OU_BIOL2124_F_2015_Human_Physiology.honor_code_signature',
// 						'ntiid': 'tag:nextthought.com,2011-10:OU-NAQ-OU_BIOL2124_F_2015_Human_Physiology.naq.qid.honor.01',
// 						'parts': [
// 							{
// 								'MimeType': 'application/vnd.nextthought.assessment.fillintheblankshortanswerpart',
// 								'NTIID': 'tag:nextthought.com,2011-10:system-OID-0x0c5ad6:5573657273',
// 								'OID': 'tag:nextthought.com,2011-10:system-OID-0x0c5ad6:5573657273',
// 								'solutions': [
// 									{
// 										'MimeType': 'application/vnd.nextthought.assessment.fillintheblankshortanswersolution',
// 										'NTIID': 'tag:nextthought.com,2011-10:system-OID-0x0c5ad7:5573657273',
// 										'OID': 'tag:nextthought.com,2011-10:system-OID-0x0c5ad7:5573657273',
// 										'value': {
// 											'001': {
// 												'Class': 'RegEx',
// 												'MimeType': 'application/vnd.nextthought.naqregex',
// 												'NTIID': 'tag:nextthought.com,2011-10:system-OID-0x0c5ad8:5573657273',
// 												'OID': 'tag:nextthought.com,2011-10:system-OID-0x0c5ad8:5573657273',
// 												'pattern': '.*',
// 												'solution': null
// 											}
// 										},
// 										'weight': 1
// 									}
// 								],
// 								'input': 'As a student, you alone take responsibility for the content that you submit or post in this course.<br />By signing your name below, you acknowledge that you understand OU’s guidelines for academic integrity and that you have read, understand, and agree to abide by these terms.<br /><br /><input type=\'blankfield\' name=\'001\' maxlength=\'60\' />',
// 								'content': '',
// 								'explanation': '',
// 								'answerLabel': ''
// 							}
// 						],
// 						'isSubmittable': true,
// 						'isQuestion': true,
// 						'content': ''
// 					}
// 				],
// 				'title': 'Honor Code Signature',
// 				'isSubmittable': true
// 			},
// 			'title': 'Submission'
// 		}
// 	],
// 	'title': 'Honor Code Signature',
// 	'isSubmittable': true
// };
