module.exports = function(grunt) {
    'use strict';
    
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({

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
            }
        },

        // Combine source files
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'src/prefix.js',
                    'src/viewbox.js',
                    'src/overflow.js',
                    'src/positionhandler.js',
                    'src/touch.js',
                    'src/mousewheel.js',
                    'src/init.js'
                ],
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
        }
    });

    grunt.registerTask('build', ['clean:dist', 'concat:dist', 'uglify:dist', 'copy:dist']);
};