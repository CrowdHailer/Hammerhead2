module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\n'
      },
      dist: {
        src: [
          'src/prefix.js',
          'src/viewbox.js',
          'src/agile.js',
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
          'bower_components/belfry/dist/belfry.js',
          'bower_components/SoVeryGroovy/dist/SoVeryGroovy.js',
          'src/prefix.js',
          'src/viewbox.js',
          'src/agile.js',
          'src/overflow.js',
          'src/touch.js',
          'src/positionhandler.js',
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

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['karma', 'concat', 'uglify']);
};