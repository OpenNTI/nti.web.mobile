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

## generate default forum topics for chemistry of beer
_See the notes that follow._

    http --timeout 1000000 -f -a ray.hatfield@nextthought.com:temp002 http://localhost/dataserver2/@@LegacyCourseTopicCreator blah@CHEM4970.csv

The user specified for authentication *(ray.hatfield@nextthought.com)* must be specified as a course instructor in the course's role_info.json. So in this case:

    ~/DataserverGlobalLibrary/sites/platform.ou.edu/Courses/Fall2014/CHEM 4970/Sections/100/role_info.json

contains: 

    {
        "nti.roles.course_instructor": {
            "allow": ["morv1533","112381533","ray.hatfield@nextthought.com"]
        },
        "nti.roles.course_ta": {
            "allow": ["bamp7055"]
        }
    }


And `CHEM4970.csv` is a file with the forum content:

    NTIID,DiscussionTitle,DiscussionScope,Body 1,Body 2
    "tag:nextthought.com,2011-10:NTI-CourseInfo-Fall2014_CHEM_4970_SubInstances_100","When it comes to your health, is it better to drink or not to drink alcohol?",All,,"There is considerable evidence that long-term heavy drinking and binge drinking have a very negative impact on health of the individual as well as negative impacts on society at large.  Assuming moderate consumption of alcohol, there seems to be mixed research on the negative versus positive impacts on health.  Using research or biochemical processes to support your argument, is it better to consume a moderate amount of alcohol or to abstain from consuming alcohol?
    
    Be concise, be thoughtful, and be civil."
    "tag:nextthought.com,2011-10:NTI-CourseInfo-Fall2014_CHEM_4970_SubInstances_100",What is beer?,All,,"When we say the word, beer, we imagine, have an understanding, and, maybe, sensory reaction, because we either know of or have experienced consuming beer. How would you describe beer to someone with no knowledge of the beverage? What is the fundamental essence of beer that differentiates it from other beverages? How is the chemistry of beer the same and different? What makes beer, beer? Be concise, be thoughtful, and be civil."
    "tag:nextthought.com,2011-10:NTI-CourseInfo-Fall2014_CHEM_4970_SubInstances_100",What is it that makes your favorite style of beer your favorite?,All,,"Not everyone has a single favorite movie or book, but when one really thinks about it there is usually a connection. Think about your favorite beer or what you think might be your favorite beer when compared to non-alcoholic drinks you may enjoy. What are the characteristics that make it stand out? Are these characteristics associated with a taste, color, smell, or appearance? Is there a specific compound or a class of compounds associated with the stereotypical flavor or aroma? At a molecular level, what is it that makes your favorite style of beer your favorite? 
    
    Be concise, be thoughtful, and be civil."

 [^notresuablebysameuser]: as of this writing (2015.01.03) these tokens can't be reused by the same user even after dropping the course.