module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: 'dist'
    },

    copy: {
      dist: {
        nonull: true,
        src: 'src/hammerhead2.css',
        dest: 'dist/hammerhead2.css'
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      src: ['src/*.js', '!src/agile.js']
    },

    concat: {
      options: {
        separator: '\n'
      },
      dist: {
        src: [
          'src/prefix.js',
          'src/viewbox.js',
          'src/overflow.js',
          'src/touch.js',
          'src/positionhandler.js',
          'src/mousewheel.js',
          'src/init.js',
        ],
        dest: 'dist/<%= pkg.name %>.js'
      },
      fullfat: {
        src: [
          'bower_components/cumin/dist/cumin.js',
          'bower_components/cumin/dist/math.min.js',
          'bower_components/cumin/dist/compositions.min.js',
          'bower_components/belfry/dist/belfry.js',
          'bower_components/SoVeryGroovy/dist/SoVeryGroovy.js',
          'src/prefix.js',
          'src/viewbox.js',
          'src/overflow.js',
          'src/touch.js',
          'src/positionhandler.js',
          'src/mousewheel.js',
          'src/init.js',
        ],
        dest: 'fullfat/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      },
      fullfat: {
        files: {
          'fullfat/<%= pkg.name %>.min.js': ['<%= concat.fullfat.dest %>']
        }
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }

  });

  grunt.registerTask('default', ['clean', 'karma', 'concat', 'uglify', 'copy']);
};