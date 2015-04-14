// const getConst = x => Symbol(x);
const getConst = x => `5minute-enrollment:${x}`;

//Actions
export const PREFLIGHT_AND_SUBMIT = getConst('Preflight & Submit');
export const DO_EXTERNAL_PAYMENT = getConst('Do External Payment');
export const REQUEST_CONCURRENT_ENROLLMENT = getConst('Request Concurrent Enrollment');


//errors
export const PREFLIGHT_ERROR = getConst('Preflight Error');
export const REQUEST_ADMISSION_ERROR = getConst('Request Admission Error');
export const PAY_AND_ENROLL_ERROR = getConst('Pay & Enroll Error');

//admission status
export const ADMISSION_PENDING = 'PENDING';
export const ADMISSION_REJECTED = 'REJECTED';
export const ADMISSION_ADMITTED = 'ADMITTED';
export const ADMISSION_NONE = 'NONE';

//events
export const ADMISSION_SUCCESS = getConst('Success');
export const RECEIVED_PAY_AND_ENROLL_LINK = getConst('Received Pay & Enroll Link');
export const CONCURRENT_ENROLLMENT_ERROR = getConst('Concurrent Enrollment:Error');
export const CONCURRENT_ENROLLMENT_SUCCESS = getConst('Concurrent Enrollment:Success');

//fields
export const IS_CONCURRENT_FORM = getConst('Is Concurrent Form');

//links
export const PAY_AND_ENROLL = 'fmaep.pay.and.enroll';
export const CONCURRENT_ENROLLMENT_NOTIFY = 'concurrent.enrollment.notify';
