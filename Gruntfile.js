module.exports = function(grunt) {
    'use strict';
    
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Configurable paths
    var config = {
        src: [
            'src/prefix.js',
            'src/viewbox.js',
            'src/overflow.js',
            'src/positionhandler.js',
            'src/touch.js',
            'src/mousewheel.js',
            'src/init.js'
        ],
    };
    
    grunt.initConfig({

        // Project settings
        config: config,

        // Empties folders to start fresh
        clean: {
            dist: {
                src: 'dist'
            }
        },

        // Check code quality
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            grunt: {
                options: {
                    globals: {
                        require: false,
                        module: true,
                    }
                },
                src: 'Gruntfile.js'
            },
            source: {
                src: 'src/*.js'
            }
        },

        // Combine source files
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: config.src,
                dest: 'dist/hammerhead2.js'
            }
        },

        // Minimise dist files
        uglify: {
            dist: {
                files: {
                    'dist/hammerhead2.min.js': 'dist/hammerhead2.js'
                }
            }
        },

        // Copy CSS files
        copy: {
            dist: {
                nonull: true,
                src: 'src/hammerhead2.css',
                dest: 'dist/hammerhead2.css'
            }
        },

        // Install bower dependencies
        wiredep: {
            test: {
                src: 'test/index.html'
            }
        },

        // Run local connect server
        connect: {
            options: {
                port: 9000,
                hostname: '0.0.0.0',
                livereload: 35729,
            },
            test: {
                options: {
                    port: 9001,
                    open: false,
                    base: ['bower_components', 'src', 'test']
                }
            }
        },

        // Run tests in shell
        jasmine: {
            test: {
                src: config.src,
                options: {
                    vendor: [
                        'bower_components/zepto/zepto.min.js',
                        'bower_components/hammerjs/hammer.min.js',
                        'bower_components/bean/bean.min.js',
                        'bower_components/cumin/dist/cumin.min.js',
                        'bower_components/cumin/dist/math.min.js',
                        'bower_components/SoVeryGroovy/dist/SoVeryGroovy.min.js'
                    ],
                    specs: 'test/spec/*',
                }
            }
        },

        // Run tasks on file modifications
        watch: {
            test: {
                files: ['test/spec/*.js', 'src/*.js'],
                options: {
                    livereload: 35729
                }
            }
        }

    });

    grunt.registerTask('build', ['clean:dist', 'concat:dist', 'uglify:dist', 'copy:dist']);
    grunt.registerTask('test', ['jasmine:test']);
    grunt.registerTask('livetest', ['connect:test', 'watch:test']);
};