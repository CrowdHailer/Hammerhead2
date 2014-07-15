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
        }
    });
};