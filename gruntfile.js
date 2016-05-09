// Gruntfile.js
module.exports = function(grunt) {

    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        project: {
		    dist: '_site',
            assets: '_assets'
	    },


        // shell commands for use in Grunt tasks
        shell: {
            jekyllBuild: {
                command: 'jekyll build'
            },
            jekyllServe: {
                command: 'jekyll serve'
            }
        },

        sass: {
            dist: {
                options: {
                    includePaths: ['bower_components'],
    				outputStyle: 'expanded',
    				sourceMap: true
    			},
                files: [{
                    'styles/app.css': '<%= project.assets %>/styles/app.scss',
                    '<%= project.dist %>/styles/app.css': '<%= project.assets %>/styles/app.scss'
                }]
            }
        }, // sass

        postcss: {
            options: {
                map: true,
    			inline: false,
                processors: [
                    require('autoprefixer')({
                        browsers: 'last 2 version, IE 9'
                    }), // add vendor prefixes. for more: https://github.com/ai/browserslist
                    require('cssnano')() // minify the result
                ]
            },
            dist: {
                src: [
                    '<%= project.dist %>/styles/app.css',
                    'styles/app.css'
                ]
            }
        }, // postcss

        bowercopy: {
			options: {
				clean: true
			},
			scripts: {
				options: {
					destPrefix: '<%= project.assets %>/scripts/vendor'
				},
				files: {
                    'jquery.js': 'jquery/dist/jquery.js',
					'modernizr.js': 'modernizr/modernizr.js',
                    'enquire.js': 'enquire/dist/enquire.js',
                    'prism.js': 'prism/prism.js',
                    'jquery.matchHeight.js': 'matchHeight/jquery.matchHeight.js',
                    'jcf.js': 'jcf/js/jcf.js',
                    'jcf.select.js': 'jcf/js/jcf.select.js',
                    'jcf.radio.js': 'jcf/js/jcf.radio.js',
                    'jcf.checkbox.js': 'jcf/js/jcf.checkbox.js',
                    'tab.js' : 'bootstrap-sass/assets/javascripts/bootstrap/tab.js',
                    'fastclick.js': 'fastclick/lib/fastclick.js',
                    'jquery.magnific-popup.js': 'magnific-popup/dist/jquery.magnific-popup.js'
				}
			},
            production_scripts: {
				options: {
					destPrefix: 'scripts'
				},
				files: {
					'modernizr.js': 'modernizr/modernizr.js'
				}
			}
		}, // bowercopy

        manifest: {
            dist: {
                src: '<%= project.assets %>/scripts',
                dest: 'scripts'
            }
        }, // concat

        uglify: {
            dist: {
                src: 'scripts/app.js',
                dest: 'scripts/app.min.js'
            }
        }, // uglify

        connect: {
    		options: {
    			port: 9000,
    			livereload: 35729,
    			// change this to '0.0.0.0' to access the server from outside
    			hostname: '0.0.0.0',
    			base: './_site'
    		},
    		livereload: {
    			options: {
    				open: true
    			}
    		},
    		server: {
    			options: {
    				port: 9001,
    				keepalive: true,
    				open: false
    			}
    		}
    	}, // connect

        browserSync: {
            bsFiles: {
                src: ['<%= project.dist %>/**/*.*']
            },
            options: {
                watchTask: true,
                server: {
                    baseDir: './_site'
                },
                ghostMode: {
                   clicks: true,
                   scroll: true,
                   links: true,
                   forms: true
                }
            }
        }, //browserSync


        watch: {
            options: {
    	  		livereload: true,
     	 	},
            jekyll: {
                files: [
                    '_layouts/*.html',
                    '_includes/*.html',
                    '_data/*.*',
                    'blog/**/*.*',
                    '*.html',
                ],
                tasks: ['shell:jekyllBuild']
            },
            sass: {
                options: {
    	  			livereload: false
    			},
                files: ['<%= project.assets %>/styles/**/*.scss'],
                tasks: ['sass', 'postcss']
            },
            css: {
    			files: ['<%= project.dist %>/styles/*.css'],
    			tasks: []
      		},
            scripts: {
                files: [
                  '<%= project.assets %>/scripts/**/*.js'
                ],
                tasks: ['manifest', 'uglify', 'shell:jekyllBuild']
            },
            images: {
                files: ['images/**/*.*'],
                tasks: ['shell:jekyllBuild']
            }
        } // watch


    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
  	grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-manifest-concat');
    grunt.loadNpmTasks('grunt-bowercopy');

    grunt.registerTask('build', [
      'bowercopy',
      'manifest',
      'uglify',
      'shell:jekyllBuild',
      'sass',
      'postcss'
    ]);

    grunt.registerTask('dev', [
      'connect:livereload',
      'watch'
    ]);

    grunt.registerTask('default', ['build', 'dev']);
};
