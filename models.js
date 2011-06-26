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
    'tn': String
});

 mongoose.model('Call',Call);

    fn();
};

exports.defineModels = defineModels;