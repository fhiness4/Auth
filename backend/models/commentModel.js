const { required } = require('joi')
const mongoose = require('mongoose')

const commentschema = mongoose.Schema({
    comment:{
        type: String,
        required: [true, 'title is required'],
        trim: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    codeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'htmldata',
        required: true
    },
    likes: {
      type: Number,
      default: 0
    },
    likedBy:[
      String
      ]
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Comment', commentschema)

