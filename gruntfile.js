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
		uglify: {
			libs: {
				options: {
					preserveComments: 'all'
				},
				files: [
					{src: 'src/js/components/*.js', dest: 'js/scripts.min.js'}
				]
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
				src: ['js']
			}
		}

	});

	grunt.registerTask('default', ['uglify', 'buildcss', 'copy']);
	grunt.registerTask('buildcss',  ['compass:common']);

	//grunt.loadNpmTasks('grunt-contrib-compass');
}