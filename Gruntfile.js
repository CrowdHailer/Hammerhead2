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
      },
      fullfat: {
        nonull: true,
        src: 'src/hammerhead2.css',
        dest: 'fullfat/hammerhead2.css'
      }
    },

    jshint: {
      options: {
        node: true,
        browser: true,
        esnext: true,
        bitwise: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        indent: 2,
        latedef: true,
        newcap: false,
        noarg: true,
        // "quotmark": "single",
        undef: true,
        unused: true,
        strict: true,
        trailing: true,
        smarttabs: true,
        globals: {
          $: true
        },
        reporter: require('jshint-stylish')
      },
      source: ['src/*.js', '!src/agile.js', '!src/prefix.js'],
      test: {
        options: {
          globals: {
            describe: true,
            it: true,
            beforeEach: true,
            afterEach: true,
            jasmine: true,
            spyOn: true,
            expect: true,

            $: true,
            Hammer: true,
            Hammerhead: true,
            _: true,
            SVGroovy: true,
            bean: true
          }
        },
        src: ['spec/*_spec.js', '!spec/agile_spec.js']
      }
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
    },

    connect: {
      options: {
        port: 9000,
        hostname: 'localhost',
      },
      debug: {
        options: {
          base: ['bower_components', 'src', 'debug']
        }
      },
      demo: {
        options: {
          base: ['bower_components', 'fullfat', 'demo']
        }
      },
      debugLocal: {
        options: {
          base: ['bower_components', 'src', 'debug'],
          open: true,
          keepalive: true
        }
      },
      demoLocal: {
        options: {
          base: ['bower_components', 'fullfat', 'demo'],
          open: true,
          keepalive: true
        }
      }
    },

    localtunnel: {
      options: {
        port: 9000,
        open: true,
        keepalive: true
      },
      debug: {
      },
      demo: {
        options: {
          port: 9000
        }
      }
    }

  });

  grunt.registerTask('build', ['clean', 'newer:jshint:source', 'karma', 'concat', 'uglify', 'copy']);
  grunt.registerTask('demo', function(target){
    if (target === 'share') {
      grunt.task.run(['build', 'connect:demo', 'localtunnel:demo']);
    } else {
      grunt.task.run(['build', 'connect:demoLocal']);
    }
  });
  grunt.registerTask('debug', function(target){
    if (target === 'share') {
      grunt.task.run(['connect:debug', 'localtunnel:debug']);
    } else{
      grunt.task.run(['connect:debugLocal']);
    }
  });

};