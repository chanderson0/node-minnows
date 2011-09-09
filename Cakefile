# From https://gist.github.com/1096141

fs         = require 'fs'
{exec}     = require 'child_process'
util       = require 'util'
growl      = require 'growl'

appFiles  = []

task 'coffeeFiles', 'how much coffee you got?!', ->
  traverseFileSystem = (currentPath) ->
    files = fs.readdirSync currentPath
    for file in files
      do (file) ->
        currentFile = currentPath + '/' + file
        stats = fs.statSync(currentFile)
        if stats.isFile() and currentFile.indexOf('.coffee') > 1 and appFiles.join('=').indexOf("#{currentFile}=") < 0
          appFiles.push currentFile
        else if stats.isDirectory()
          traverseFileSystem currentFile

  traverseFileSystem 'src'
  util.log "#{appFiles.length} coffee files found."
  return appFiles

task 'watch', 'Watch prod source files and build changes', ->
  invoke 'coffeeFiles'
  invoke 'build'
  util.log "Watching for changes in src"

  for file in appFiles then do (file) ->
    fs.watchFile file, (curr, prev) ->
      if +curr.mtime isnt +prev.mtime
        util.log "Saw change in #{file}"
        invoke 'build'

task 'build', 'Build single application file from source files', ->
  exec 'coffee -cb -o public/js/app/ src/', (err, stdout, stderr) ->
    if err
      util.log 'Error compiling coffee file.'
