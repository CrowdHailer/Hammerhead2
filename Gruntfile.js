'use strict';

module.exports = function(grunt) {
    
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({

        // Empties folders to start fresh
        clean: {
            dist: {
                src: 'dist'
            }
        }
    });
};