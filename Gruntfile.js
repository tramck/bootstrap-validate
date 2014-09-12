module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine: {
      unit: {
        src: ['validate.js'],
        options: {
          keepRunner: false,
          specs: ['spec/*.js'],
          vendor: ['components/jquery/dist/jquery.js']
        }
      }
    },
    jshint: {
      options: {
        bitwise: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        freeze: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        nonbsp: true,
        plusplus: true,
        quotmark: 'single',
        undef: true,
        unused: true,
        strict: true,
        trailing: true,
        validthis: true,
        globals: {
          console: true,
          window: true,
          jQuery: true
        }
      },
      all: {
        files: {
          src: ['validate.js']
        }
      }
    },
    connect: {
      server: {
        options: {
          base: '.',
          livereload: true
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      src: {
        files: ['validate.js', 'spec/*.js'],
        tasks: ['jshint', 'jasmine']
      },
      config: {
        files: ['Gruntfile.js', 'package.json'],
        options: {
          reload: true
        }
      }
    },
    uglify: {
      dist: {
        options: {
          banner: '<%= banner %>'
        },
        files: {
          'validate.min.js': ['validate.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt');

  grunt.registerTask('build', ['uglify'])

  grunt.registerTask('default', ['connect', 'watch']);

};