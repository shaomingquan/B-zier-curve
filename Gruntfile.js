// Gruntfile.js
module.exports = function (grunt) {
  // 项目配置
    console.log("*******************************************************");
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/*! <%= pkg.name %><%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        separator: '\n'
      },
      dist: {
        src: ['dev/_1MC.js','dev/_2D2.js','dev/_3SHAPE.js','dev/_4INHERIT_D2.js','dev/_5ANIMATER.js','dev/_6STYLE.js'],
        dest: 'release/cquery-<%= pkg.version %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'user/js/index.js',
        dest: 'release/js/index.min.js'
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'dev/*.js']
    },
    jsdoc : {
        dist : {
            src: ['release/cquery-<%= pkg.version %>.js'], 
            options: {
                destination: 'doc'
            }
        }
    },
    "jsDeleteComment":{
        options: {
        },

        build: {
            src: 'release/cquery-<%= pkg.version %>.js',
            dest: 'delComment'
        }
    }
  });
  grunt.registerMultiTask('jsDeleteComment', '', function() {
    this.files.forEach(function(f) {

      var src = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {

          var commentsReg = /(\/{2,}.*?(\r|\n))|(\/\*(\r|\n|.)*?\*\/)/g
          var blankLine = /(\n|\r)+/g;
          var js = grunt.file.read(filepath);
          console.log(js.match(commentsReg).length);
          js = js.replace(commentsReg, "\n");
          js = js.replace(blankLine, "\n");
          grunt.file.write(f.dest + filepath, js);   

          return true;
        }
      });
    });
  });

  // 加载提供"uglify"任务的插件
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc');
  // 默认任务
  grunt.registerTask('default', ['concat','jsDeleteComment','jsdoc'/*,'jshint'*/]);
};