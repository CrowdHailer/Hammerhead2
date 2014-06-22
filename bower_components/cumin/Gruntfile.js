module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\n'
      },
      dist: {
        src: [
          'src/helpers.js',
          'src/cumin.js',
          // 'src/compositions.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>'],
          'dist/math.min.js': 'src/math.js',
          'dist/compositions.min.js': 'src/compositions.js'
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      },
      min: {
        configFile: 'karmamin.conf.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['karma:unit', 'concat', 'uglify', 'karma:min']);
};