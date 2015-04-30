/*eslint-disable camelcase*/
export default {

	BUTTONS: {
		OpenEnrollment: 'Enroll in the open course',
		drop: 'Drop this course',
		viewCourse: 'View Course',
		viewCatalog: 'View Catalog',
		giveThisAsGift: 'Give this as a gift',
		redeemGift: 'Redeem a gift'
	},


	CONFIRMATION: {
		header: 'Review and Pay',
		review: 'Please take a moment to review your order and submit your payment.',
		salesFinal: 'All sales are final.',
		giftInfo: 'Gift Information',
		paymentInfo: 'Payment Information',
		billingInfo: 'Billing Address',
		expires: 'Expires:',
		from: 'From:',
		to: 'To:',
		message: 'Message:'
	},


	GIFT: {
		HEADER: {
			title: 'Gift Information',
			description: 'If you would like for us to send a gift notification to the person for whom you are purchasing this course, ' +
							'please enter their name and email below. Pricing information is not included in this notification.'
		},
		RECIPIENT: {
			enable: 'Send a gift notification to:',
			firstName: 'First Name',
			lastName: 'Last Name',
			email: 'Email Address',
			message: 'Enter your message here...',
			fromLabel: 'From:',
			from: 'Your Name',
			sendDate: 'This notification will be sent upon completion of purchase.'
		},
		PAYMENT: {
			title: 'Payment Information',
			sub: ''
		},
		PRICING: {
			subType: 'Enrollment Type',
			total: 'total',
			begins: 'Course Begins',
			ends: 'Course Ends',
			hours: 'Credit Hours',
			refunds: 'Refunds',
			noRefunds: 'Not Refundable',
			couponPlaceholder: 'Coupon Code',
			coupon: 'I have a coupon',
			checkingCoupon: 'Checking Coupon',
			invalidCoupon: 'Invalid Coupon',
			validCoupon: 'Coupon Accepted: %(discount)s off',
			noCoupon: 'No Coupon',
			lockedCoupon: 'Coupon',
			x_creditHours: {
				one: '%(count)s Credit Hour',
				other: '%(count)s Credit Hours'
			}
		},
		SUCCESS: {
			title: 'Gift Purchase Successful',
			info: '<strong>%(courseTitle)s</strong> starts on <strong>%(startDate)s</strong> and will be conducted fully online.',
			toSender: 'We\'ve sent an email of this transaction to you at <a>%(sender)s</a>. ' +
						'We\'ve also sent a separate email that contains instructions on how to redeem this gift.',
			alert: 'Please be sure to pass this information along to the gift recipient in time to take advantage of the course.',
			toRecipient: 'We\'ve sent an email of this transaction to you at <a>%(sender)s</a>. ' +
							'We\'ve also sent you a copy of the gift notification that was sent to <a>%(receiver)s</a> ' +
							'with instructions on how to redeem this gift.',
			support: 'Please contact %(email)s if you have any issues.',
			transactionID: 'Transaction ID:',
			accessKey: 'Access Key:',
			supportPrompt: 'Please contact tech support if you have any issues.'
		},

		REDEEM: {
			'formTitle': 'Redeem this course with an Access Key',
			'accessKey': 'Access Key',
			'redeemButton': 'Redeem'
		},

		cancelPurchaseButton: 'Cancel',
		purchaseButton: 'Purchase Gift',
		agreeToTerms: 'I have read and agree to the <a href="%(url)s" target="_blank">licensing terms</a>.'
	},


	forms: {
		storeenrollment: {
			/*eslint-disable camelcase*/
			from: 'Email Address',
			fromLabel: 'This is where we will send your purchase confirmation.',
			name: 'Name on Card',
			number: '1234 1234 1234 1234',
			exp_: 'MM / YY',
			exp_month: 'MM',
			exp_year: 'YY',
			cvc: 'Code',
			address_line1: 'Address',
			address_line2: 'Address Continued',
			address_city: 'City',
			address_state: 'State/Province/Territory/Region',
			address_zip: 'Zip/Postal Code',
			address_country: 'Country',
			last4: 'Card ending in'
		},
		fiveminute: {
			admissionTitle: 'Admission to OU Janux',
			admissionDescription: 'Before you can earn college credit from the University of Oklahoma, ' +
				'we need you to answer some questions. Don\'t worry, the admission process is free and ' +
				'should only take a few minutes.',
			oklahomaResident: 'Are you an Oklahoma resident?',
			currentlyAttending: 'Are you currently attending the University of Oklahoma?',
			attendingHighschool: 'Are you currently attending high school?',
			historyEnrollViaOzone: 'LSTD 1153.500 fulfills US History Gen Ed requirement. To enroll, visit ' +
					'<a href="http://ozone.ou.edu" target="_blank">ozone.ou.edu</a> and enroll in LSTD 1153, Section 500.',
			name: 'Full Name',
			fullName: 'Full Name',
			first_name: 'First Name',
			middle_name: 'Middle Name',
			last_name: 'Last Name',
			former_name: 'What is your former last name?',
			date_of_birth: 'Birthdate',
			genderPrompt: 'What is your gender?',
			street_line1: 'Address',
			street_line2: 'Address Continued',
			address1: 'Address',
			address2: 'Address Continued',
			city: 'City',
			state: 'State',
			postal_code: 'Zip',
			zip: 'Zip',
			nation_code: 'Country',
			country: 'Country',
			mailingAddressDifferent: 'My mailing address is different.',
			mailingAddressLabel: 'Mailing Address',
			mailing_street_line1: 'Address',
			mailing_street_line2: 'Address Continued',
			mailing_city: 'City',
			mailing_state: 'State',
			mailing_postal_code: 'Zip',
			mailing_nation_code: 'Country',
			telephone_number: 'Phone Number',
			email: 'Email Address',
			social_security_number: 'Social Security Number',
			ssn_helptext: 'Your social security number is not requried for admission, but it is used for submission of a <a href="http://www.irs.gov/uac/Form-1098-T,-Tuition-Statement">1098T</a> to the IRS.',
			citizen: 'Are you a U.S. citizen?',
			residentOf: 'I am a resident of',
			okResident: 'Are you a resident of Oklahoma?',
			years_of_oklahoma_residency: 'How many years have you been an Oklahoma resident?',
			years_of_oklahoma_residency_placeholder: 'How many years?',
			hsGraduate: 'Are you a high school graduate?',
			attendedOU: 'Have you ever attended the University of Oklahoma?',
			sooner_id: 'What was your Sooner ID? (Leave this field blank if you do not remember.)',
			attendedAnotherUniversity: 'Have you ever attended another college or university?',
			stillAttending: 'I am still attending.',
			obtainedDegree: 'I have obtained a Bachelor\'s degree or higher.',
			goodAcademicStanding: 'I am in good academic standing.',
			signature: 'Signature',
			signatureAgreement: 'I affirm that I am not <a href="policy/">prohibited</a> from enrolling in any University of Oklahoma program. ' +
				'I understand that submitting any false information to the University, including but not limited to, ' +
				'any information contained on this form, or withholding information about my previous academic history will ' +
				'make my application for admission to the University, as well as any future applications, subject to denial, ' +
				'or will result in expulsion from the University. I pledge to conduct myself with academic integrity and ' +
				'abide by the tenets of The University of Oklahoma\'s <a href="http://integrity.ou.edu/" target="_blank">Integrity Pledge.</a>',
			submit: 'Submit Application',
			concurrentFormIntro: '<h2>You may qualify for concurrent enrollment.<h2><p>Through Concurrent Enrollment (CE), high school juniors ' +
				'and seniors can enroll in college classes and earn college credit while will in high school. Submit your contact info ' +
				'and date of birth below and a Concurrent Enrollment Counselor will be in touch to guide you through the ' +
				'<a href="http://www.ou.edu/content/go2/admissions/concurrent.html">Concurrent Enrollment Process.</a></p>',
			prohibitionPolicyHeading: 'Policy on Non-Academic Criteria in the Admission of Students',
			prohibitionPolicy: 'In addition to the academic criteria used as the basis for the admission of students, the University shall consider the following non-academic criteria in deciding whether a student shall be granted admission: whether an applicant has been expelled, suspended, or denied admission or readmission by any other educational institution; whether an applicant has been convicted of a felony or lesser crime involving moral turpitude; whether an applicant\'s conduct would be grounds for expulsion, suspension, dismissal or denial of readmission, had the student been enrolled at the University of Oklahoma. An applicant may be denied admission to the University if the University determines that there is substantial evidence, based on any of the instances described above, to indicate the applicant\'s unfitness to be a student at the University of Oklahoma.',
			contactMe: 'I want someone from the University of Oklahoma to contact me.'
		}
	},
	incompleteForm: 'Please complete all required fields.',
	requiredField: 'Field is required.',

	invalidExpiration: 'Expiration is invalid.',
	invalidCardNumber: 'Card number is invalid.',
	invalidCVC: 'CVC is invalid.',

	invalidEmail: 'Invalid Email.',
	invalidRecipient: 'Invalid Recipient Email.',

	enrollmentNotRefundable: 'Enrollment is not refundable.',

	enrollAsLifelongLearner: 'Enroll as a Lifelong Learner',
	enrollAsLifelongLearnerWithPrice: 'Enroll as a Lifelong Learner: %(price)s',

	storeEnrollmentTitle: 'Enroll as a Lifelong Learner',

	fiveMinuteEnrollmentTitle: 'Enroll for Credit',
	fiveMinuteNotAvailableOnMobile: 'Please visit from a desktop to enroll for credit. Coming soon to mobile.',
	fiveMinuteEnrollmentButton: 'Enroll for Credit',
	fiveMinuteEnrollmentDescription: 'Earn transcripted college credit from the University of Oklahoma.',
	proceedToPayment: 'Proceed to payment',
	concurrentThanksHead: 'Thank you for your interest in concurrent enrollment.',
	concurrentThanksBody: 'We\'ve received your contact information and a Concurrent Enrollment Counselor will ' +
		'be contacting you shortly. In the mean time, please feel free to explore the <a href="http://www.ou.edu/content/go2/admissions/concurrent.html">Concurent Enrollment website</a> ' +
		'to learn more about the process.'


};
