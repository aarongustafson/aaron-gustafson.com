/*
	gulpfile.js
	===========
	Rather than manage one giant configuration file responsible
	for creating multiple tasks, each task has been broken out into
	its own file in tasks/gulp/tasks. Any file in that folder gets automatically
	required by the loop in ./tasks/gulp/index.js (required below).

	To add a new task, simply add a new task file to tasks/gulp/tasks.
*/

require('require-dir')('./_tasks/gulp');