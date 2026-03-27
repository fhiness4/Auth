const { required } = require('joi')
const mongoose = require('mongoose')

const profileschema = mongoose.Schema({
    bio:{
        type: String,
        default: undefined
    },
    location:{
        type: String,
        default: undefined
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    website:{
        type: String,
        default: undefined
    },
    github:{
        type: String,
        default: undefined
    },
      skills:[
      String
      ],
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Profile', profileschema)



