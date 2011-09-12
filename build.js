({
    baseUrl: "./build",
    paths: {
        'underscore': '../lib-wrapped/underscore-min',
        'paper': '../lib/paper'
    },
    dir: "public/js",
    locale: "en-us",

    // optimize: "uglify",
    optimize: "none",
    
    inlineText: true,
    skipPragmas: false,

    modules: [
        { name: "reckoning/reckoning" },
        { name: "minnows/minnows" },
        { name: "minnows/client" },
        //{ name: "minnows/server" }
    ],

    wrap: true
})