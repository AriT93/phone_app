require 'sinatra'
require 'mongo'
require 'haml'
require 'net/http'
require 'open-uri'

before do
  @db = Mongo::Connection.new.db("test")
  @coll = @db["calls"]
end
get '/' do
  haml :index
end
post '/' do
  call = {
    "name" => params['name'],
    "age"  => params['age'],
    "tn" => params['tn'],
    "city" => params['city'],
    "state" => params['state'],
    "zip" => params['zip'],
    "latitude" => params['latitude'],
    "longitude" => params['longitude']
  }
  @coll.insert(call)
  redirect '/'
end
get '/agent' do
  haml :agent
end
get '/call/:phoneNum' do
  #url = "http://webservice/cgi-bin/makecall.cgi?"+params[:phoneNum]
  #result = open(url)
  #result.read
  '{"success":"made phone call"}'
end
