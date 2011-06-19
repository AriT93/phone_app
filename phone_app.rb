require 'sinatra'
require 'mongo'
require 'haml'

before do

  @db = Mongo::Connection.new.db("test")
  @coll = @db["calls"]
end
get '/' do
  s = "<h1>Calls</h1>"
   s = s + "<ul>"
  @coll.find().each {|row|
    s = s + "<li> #{row['name']}  ::  #{row['tn']}</li>"
  }
  s = s + "</ul>"

  haml :index
end
