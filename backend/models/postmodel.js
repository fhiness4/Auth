const { required } = require('joi')
const mongoose = require('mongoose')

const postschema = mongoose.Schema({
    title:{
        type: String,
        required: [true, 'title is required'],
        trim: true
    },
    description:{
        type: String,
        required: [true, 'description is required'],
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
      ],
      comments: {
      type: Number,
      default: 0
    },
    commentsBy:[
      String
      ],
      tags:[
      String
      ],
     postPic:{
        type: String,
	    required: true
		}
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Post', postschema)



