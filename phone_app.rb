require 'sinatra'
require 'mongo'
require 'haml'

before do
  @db = Mongo::Connection.new.db("test")
  @coll = @db["calls"]
end
get '/' do
  haml :index
end
post '/' do
  call = { "name" => params['name'], "tn" => params['tn']}
  @coll.insert(call)
  redirect '/'
end
get '/agent' do
  haml :agent
end
