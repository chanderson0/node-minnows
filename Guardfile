# A sample Guardfile
# More info at https://github.com/guard/guard#readme

# guard 'coffeescript', :bare => true, :input => 'src', :output => 'build'

# guard 'shell' do
#   watch(%r{src/(.+\.js)$}) { |m| `cp #{m[0]} build/#{m[1]}` }
# end

guard 'shell' do
  watch(%r{build/.*}) { `node lib/r.js -o build.js` }
end