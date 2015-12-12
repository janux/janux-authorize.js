'use strict';

var path = require('path');

var cfg = {
	dir: {
		src:     'src',
		build:   'build',
		test:    'test',
		doc:	 'doc'
	},
	file: {
		app: 'janux-security.js'
	},
	fileset: {}
}; 

cfg.fileset.ts = path.join(cfg.dir.src, '**','*.ts');
cfg.fileset.tsTest = path.join(cfg.dir.test, '**','*.spec.ts');

// files watched during the build
cfg.fileset.watch = [
];


// The test specs; override this locally to run a single test suite
cfg.fileset.test = [
	path.join(cfg.dir.test,'**','*.spec.js')
];

cfg.jshint = {
	rcfile:   '.jshintrc',
	reporter: 'default'
};

module.exports = cfg;

