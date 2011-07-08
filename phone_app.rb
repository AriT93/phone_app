require 'sinatra'
require 'mongo'
require 'haml'
require 'net/http'

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
get '/location/:zip' do
  content_type :json 
  res = Net::HTTP.start("maps.googleapis.com",80) do |http|
     http.get "http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address="+params[:zip]
  end
  res.body
end  
