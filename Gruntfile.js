/*global module:false*/
var path = require('path');
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('./package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/express-grunted.js'],
        dest: 'dist/express-grunted.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        node: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        },
        reporterOutput: ''
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      express: {
        src: ['app.js','routes/*.js']
      },
      lib_test: {
        src: ['test/**/*.js']
      },
      target1: ['Gruntfile.js','src/public/js/*.js','src/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      express: {
        files: ['<%= jshint.express.src %>','views/*'],
        tasks: ['jshint:gruntfile']
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    },
    express: {
      custom: {
          options: {
              port: 3000,
              bases: 'public',
              server: path.resolve('./app'),
              livereload: true, // if you just specify `true`, default port `35729` will be used
              serverreload: true
            }
          }
      }
  });

/*
livereloadServer: {
  server: path.resolve(__dirname, './app'),
  bases: path.resolve(__dirname, 'public'),
  livereload: true, // if you just specify `true`, default port `35729` will be used
  serverreload: true
}
}
custom: {
      options: {
        port: 3000,
        bases: 'public',
        server: path.resolve('./app')
      }
    }
}
*/
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express');

  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('dev', ['default', 'express', 'watch']);
};
