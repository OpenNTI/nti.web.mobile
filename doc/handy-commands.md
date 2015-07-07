# commands for enrolling, dropping courses, resetting user state, etc.

## create user with nextthought.com email
    nti_create_user --email admin@nextthought.com admin@nextthought.com temp001

## drop course

    http -a admin@nextthought.com:temp001 POST http://localhost:8082/dataserver2/CourseAdmin/UserCourseDrop ntiid=tag:nextthought.com,2011-10:NTI-CourseInfo-Spring2015_LSTD_1153 username=ray.hatfield@gmail.com

(or for history course summer 2015)

    http -a admin@nextthought.com:temp001 POST http://localhost:8082/dataserver2/CourseAdmin/UserCourseDrop ntiid=tag:nextthought.com,2011-10:NTI-CourseInfo-Summer2015_LSTD_1153_801 username=ray.hatfield@gmail.com

## enroll user for credit

    http -a admin@nextthought.com:temp001 POST http://localhost:8082/dataserver2/CourseAdmin/UserCourseEnroll username=local ntiid='tag:nextthought.com,2011-10:NTI-CourseInfo-Spring2015_LSTD_1153_SubInstances_500' scope=ForCredit

## reset admission status

    http -a admin@nextthought.com:temp001 POST http://localhost:8082/dataserver2/janux/fmaep_set_state/ username="ray.hatfield@gmail.com" state="reseted"

## set admission status to admitted
note: PIDM value can be an arbitrary number
    http -a admin@nextthought.com:temp001 POST http://localhost:8082/dataserver2/janux/fmaep_set_state/ username="ray.hatfield@gmail.com" state="Admitted" PIDM=1234

## generate reusable gift token [^notresuablebysameuser]
note: as of this writing (2015.01.03) these tokens can't be reused by the same user even after dropping the course.

#### localhost:
    http -a admin@nextthought.com:temp001 POST http://localhost:8082/dataserver2/store/create_invitation_purchase purchasable="tag:nextthought.com,2011-10:NTI-purchasable_course-LSTD_1153" quantity=5

#### ou-alpha:

    http -a greg.higgins@nextthought.com:temp002 POST https://ou-alpha.nextthought.com/dataserver2/store/create_invitation_purchase purchasable="tag:nextthought.com,2011-10:NTI-purchasable_course-LSTD_1153" quantity=5

## generate default forum topics for chemistry of beer
_See the notes that follow._

    http --timeout 1000000 -f -a admin@nextthought.com:temp001 http://localhost/dataserver2/@@LegacyCourseTopicCreator blah@CHEM4970.csv

The user specified for authentication *(admin@nextthought.com)* must be specified as a course instructor in the course's role_info.json. So in this case:

    ~/DataserverGlobalLibrary/sites/platform.ou.edu/Courses/Fall2014/CHEM 4970/Sections/100/role_info.json

contains:

    {
        "nti.roles.course_instructor": {
            "allow": ["morv1533","112381533","admin@nextthought.com"]
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

## add user profile data
### professional position:

    echo '[{"MimeType":"application/vnd.nextthought.profile.professionalposition", "companyName":"Jimbobcorp", "title":"Vice President of Pencil Sharpening", "startYear": "2010", "endYear":"2014", "description":"Did lots of work"}]' | http -a ray.hatfield@gmail.com:test1234 PUT http://localhost:8082/dataserver2/users/ray.hatfield%40gmail.com/++fields++positions

### educational experience
    /dataserver2/users/ray.hatfield%40gmail.com/++fields++education

## sync/update library

If you haven't already:
step one: clone this git repo
https://repos.nextthought.com/git/nti-git-test

    git clone https://repos.nextthought.com/git/nti-git-test

step two: checkout this svn repo
https://repos.nextthought.com/svn/nti-svn/nti.content.environments

    svn checkout https://repos.nextthought.com/svn/nti-svn/nti.content.environments

Mount pandora/Content at /Volumes/Content/

    workon nti.dataserver-buildout

(./buildout/bin/python setup.py dev) ?

    nti_update_library -l ../DataserverGlobalLibrary/ -s /Volumes/Content/ -f ../nti.content.environments/alpha/alpha-global-catalog.json

## synclibraries

    http --timeout 1000000 -a admin@nextthought.com:temp001 POST http://localhost:8082/dataserver2/@@SyncAllLibraries
