var Call;

function defineModels(mongoose,fn){
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;

  /**
   * Model: Call
   */

  Call = new Schema({
    'id': ObjectId,
    'name': String,
    'city': String,
    'state': String,
    'zip': String,
    'age': Number,
    'tn': String,
    'status': String,
    'sold': Boolean,
    'allFlag': Boolean,
    'createdOn': Date,
    'completedOn': Date,
    'latitude' : Number,
    'longitude' : Number
  });

  mongoose.model('Call',Call);
  
  fn();
};

exports.defineModels = defineModels;
