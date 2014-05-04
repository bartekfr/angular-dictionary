module.exports = function(grunt){
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		distdir: 'dist',
		appdir: 'app',
		watch: {
			csscommon: {
				files: ['sass/*.scss'],
				tasks: ['compass:common']
			}
		},
		compass: {
			common: {
				options: {
					sassDir: "sass",
					cssDir: "css",
					outputStyle: "expanded",
					noLineComments: true
				}
			}
		},
		jshint: {
			components: {
				options: {
					curly: true,
					eqeqeq: true,
					loopfunc: true,
					eqnull: true,
					browser: true,
					globals: {
						jQuery: true
					},
				},
				src: ['js/*.js']
			}
		},
		jasmine: {
			all: {
				src: ['js/*.js'],
				options: {
					specs: 'tests/spec/*Spec.js',
					vendor: ['js/libs/angular.js', 'js/libs/angular-route.js', 'js/libs/angular-mocks.js']
				}
			}
		}

	});

	grunt.registerTask('default', ['buildcss', 'jshint']);
	grunt.registerTask('buildcss',  ['compass:common']);
	grunt.registerTask('js',  ['jshint', 'jasmine']);

	//grunt.loadNpmTasks('grunt-contrib-compass');
}