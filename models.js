var Call;

function defineModels(mongoose,fn){
    var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;

/**
 * Model: Call
 */

Call = new Schema({
    'id': ObjectId,
    'name': String,
    'zip': String,
    'age': Number,
    'tn': String,
    'status': String,
    'sold': Boolean,
    'Timestamp': Date,
    'allFlag': Boolean,
    'Completed': Boolean
});

 mongoose.model('Call',Call);

    fn();
};

exports.defineModels = defineModels;