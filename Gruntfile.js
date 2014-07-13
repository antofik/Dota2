module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                compress: false /*{
                    drop_console: true
                }*/,
                beautify: true
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'client',
                    src: '**/*.js',
                    dest: 'work'
                }]/*,
                src: 'client/*.js',
                dest: 'build'*/
            }
        },
        concat: {
            build: {
                files: {
                    'work/client.js': ['work/**/*.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', [
        'uglify',
        'concat'
    ]);

};