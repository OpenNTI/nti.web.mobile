# Self-Assessment Workflow
--

##### Assumptions:

* There is no difference between a user and an instructor. The assessment behaves the same.


##### Begin 
* Start a new `session`
* Questions should be enabled and in initial state (specified by content), ready for user interaction.
* Hints, where available, are accessible.
* Cancel is disabled
* Submit is disabled
* Header is hidden/not-rendered.
* Unanswered count reflects all unanswered (some parts do not have an unanswered state a la Ordering)

##### Question Interaction
* Cancel enables
* Submit enables
* Unanswered count updates when the entire question is answered (all parts)

##### Cancel
* Destroys current `session`
* Resets states to be what it was prior to `Begin`
 * If there was a previous submission, the submitted state for that submission is set and `Try Again` is available.
 * If no previous submission, the state is reset to a `Begin`


##### Submit
* Gathers `session` data and submits it
* Solutions, where available, are now accessible
* Shows Header with status or result
* `Try Again` is now available.


##### Try Again
* Blank out state
* Resets to `Begin`



---


# Assignment Workflow
--

##### Assumptions:

* Save-Points simply make `sessions` persist between accesses.


##### Begin 
* If user is an instructor, solutions are accessible and the question is disabled from interaction.
* Load current `session` or start a new `session` if one is not found.
    * On new `session`:
        * Questions should be enabled and in initial state, ready for user interaction.
        * Hints, where available, are accessible.
        * Cancel is disabled
        * Submit is disabled
        * Header is hidden/not-rendered.
    * On resumed `session`:
        * All elements should return to their state.
* Unanswered count reflects all unanswered (some parts do not have an unanswered state a la Ordering)


##### Question Interaction
* Same as Self-Assessment
* If user is an instructor, the question is disabled. Only Solutions are intractable.


##### Cancel
* Destroys current `session`
* Resets states to `Begin`


##### Submit
* If the user is an instructor, `Submit` is not available.
* Gathers `session` data and submits it
* Solutions, where available, are now accessible
* Shows Header with status




