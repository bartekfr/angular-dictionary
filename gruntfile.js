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
			},
			js: {
				files: ['js/*.js'],
				tasks: ['jshint']
			}
		},
		browserSync: {
			dev: {
				bsFiles: {
					src : ['css/*.css', 'js/*.js']
				},
				options: {
					watchTask: true,
					server: {
						baseDir: "./"
					}
				}
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

	grunt.registerTask('default', ['browserSync', 'buildcss', 'jshint']);
	grunt.registerTask('live', ['browserSync', 'watch']);
	grunt.registerTask('buildcss',  ['compass:common']);
	grunt.registerTask('js',  ['jshint', 'jasmine']);

	//grunt.loadNpmTasks('grunt-contrib-compass');
}