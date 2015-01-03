# commands for enrolling, dropping courses, resetting user state, etc. 

## drop history course

    http -a ray.hatfield@nextthought.com:ray.hatfield POST http://localhost:8082/dataserver2/@@AdminUserCourseDrop  ntiid=tag:nextthought.com,2011-10:NTI-CourseInfo-Spring2015_LSTD_1153 username=ray.hatfield@gmail.com

## drop history course on ou-alpha

    http -a admin@nextthought.com:temp001 POST https://ou-alpha.nextthought.com/dataserver2/@@AdminUserCourseDrop ntiid=tag:nextthought.com,2011-10:NTI-CourseInfo-Spring2015_LSTD_1153_SubInstances_Stripe_000 username=ray.hatfield@nextthought.com

## enroll user for credit

    http -a ray.hatfield@nextthought.com:ray.hatfield POST https://ou-alpha.nextthought.com/dataserver2/@@AdminUserCourseEnroll username=ray.hatfield@gmail.com ntiid='tag:nextthought.com,2011-10:OU-HTML-EDAH5023_Admin_of_Adult_and_Higher_Education.course_info' scope=ForCredit

## enroll user for credit

    http -a admin@nextthought.com:temp001 POST https://ou-alpha.nextthought.com/dataserver2/@@AdminUserCourseEnroll username=julie.zhu ntiid='tag:nextthought.com,2011-10:OU-HTML-EDAH5023_Admin_of_Adult_and_Higher_Education.course_info' scope=ForCredit

## reset admission status

    http -a ray.hatfield@nextthought.com:ray.hatfield POST http://localhost:8082/dataserver2/janux/fmaep_set_state/ username="ray.hatfield@gmail.com" state="reseted"

## generate reusable gift token (localhost) [^notresuablebysameuser]

    http -a ray.hatfield@nextthought.com:ray.hatfield POST http://localhost:8082/dataserver2/store/create_invitation_purchase purchasable="tag:nextthought.com,2011-10:NTI-purchasable_course-LSTD_1153" quantity=5

## generate reusable gift token (ou-alpha) [^notresuablebysameuser]
note: as of this writing (2015.01.03) these tokens can't be reused by the same user even after dropping the course.

    http -a greg.higgins@nextthought.com:temp002 POST https://ou-alpha.nextthought.com/dataserver2/store/create_invitation_purchase purchasable="tag:nextthought.com,2011-10:NTI-purchasable_course-LSTD_1153" quantity=5

 [^notresuablebysameuser]: as of this writing (2015.01.03) these tokens can't be reused by the same user even after dropping the course.