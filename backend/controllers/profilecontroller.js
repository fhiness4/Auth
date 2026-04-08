const Profile = require('../models/Profilemodel');
const user  = require('../models/usersmodel');
// get profile 
const getprofile = async (req, res)=>{
  const{userId} = req.query
  if (!userId) {
    return res.json({
      success: false,
      message: "userid required"
    })
  }
  try {
    const existingUser = await user.findOne({_id: userId});
   const existingprofile = await Profile.findOne({userId}).populate(
			  {
				path: 'userId',
				select: ['email', "name","profilepic", "createdAt"]
			 });
		if(existingprofile){
     return res.json({
      success: true,
      data: existingprofile
    })
     }else if(!existingprofile || existingUser){
     return res.json({
      success: true,
      data: existingUser
    })
   }else if (!existingprofile) {
     return res.json({
      success: false,
      message: "userid not found"
    })
   }
   else{
     return res.json({
      success: false,
      m3ssage: "error"
    })
   }
  } catch (e) {
    console.log(e)
    return res.json({
      success: false,
      message: "error occured"
    })
  }
}

// update profile
const updateprofile = async (req, res)=>{
  const{userId, bio, location, website, github, skills}= req.body
  if (!userId) {
    return res.json({
      success: false,
      message: "userid required"
    })
  }
  
  const existingUser = await user.findOne({userId});
  
  try {
    const existingprofile = await Profile.findOne({userId});
    if (!existingprofile || existingUser) {
      const result = await Profile.create({
			userId, bio, location, website, github, skills
		});
		res.status(201).json({ success: true, message: 'profile created', data: result });
    }else{
      existingprofile.bio = bio
      existingprofile.location = location
      existingprofile.website = website
      existingprofile.github = github
      existingprofile.skills = skills
    const result = await existingprofile.save();
		res.status(200).json({ success: true, message: 'profile Updated', data: result });
    }
  } catch (e) {
    console.log(e)
    res.json({ success: false, message: 'error occured' });
  }
}

module.exports = {getprofile, updateprofile}
