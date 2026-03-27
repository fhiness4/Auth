const Comment  = require('../models/commentModel');

// create comment
const addComment = async(req, res)=>{
  const {userId, codeId, comment} = req.body;
  if(!userId || !codeId || !comment){
    return res.json({
      success: false,
      message: "userId , codeId, and comment required!"
    })
  };
  
  try {
    const newcomment = new Comment({
      userId,
      codeId,
      comment
    });
    await newcomment.save();
    res.status(200).json({
      success: true,
      message: "comment added",
      data: newcomment
    })
  } catch (e) {
    console.log(e)
    res.json({
      success: false,
      message: e._message
    })
  }
};

// get comment
const getComment = async(req,  res)=>{
  const {codeId, page}= req.query;
  const postsPerPage = 10;
  let pageNum = 0;
		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
  if(!codeId){
    res.json({
      success:false,
      message: "codeid is required"
    })
  }
  try {
    const existingComment = await Comment.find({codeId}).sort({ createdAt: -1 })
			.skip(pageNum * postsPerPage)
			.limit(postsPerPage).populate({
      path: 'userId',
		  select: ['email', "name","profilepic", "createdAt"]
    });
    
    if (!existingComment) {
     return  res.json({
      success: false,
      message: "comment not available"
    })
    }
    
    res.json({
      success: true,
      data: existingComment
    })
  } catch (e) {
    console.log(e)
    res.json({
      success: false,
      message: "error occured"
    })
  }
}
// delete comment
const deleteComment = async(req, res)=> {
     const{_id, userId} = req.query
     if (!_id || !userId) {
     return  res.json({
         success: false,
         message: "id is required"
       })
     }
     try {
       const existingComment = await Comment.findOne({_id});
       if (!existingComment) {
        return res.json({
         success: false,
         message: "coee unavailable"
       })
       };
       if (userId !== existingComment.userId.toString()) {
       return  res.json({
         success: false,
         message: "unauthorized"
       })
       };
       await Comment.deleteOne({_id});
       res.json({
         success: true,
         message: "comment deleted"
       })
       
     } catch (e) {
       console.log(e)
       res.json({
         success: false,
         message: "error occured"
       })
     }
}

// comment liking
const likePost = async(req, res) => {
  const{_id, userId} = req.body
  const post = await Comment.findOne({_id:codeId});
  
  // Check if user already liked
  if (!post.likedBy.includes(userId)) {
    post.likes += 1;
    post.likedBy.push(userId);
    await post.save();
    return res.json({ liked: true, likes: post.likes });
  }else{
    return res.json({ liked: false, message: 'Already liked!' });
  }
  
}

// UNLIKE a comment
const unlikePost = async(req, res) =>{
  const{_id, userId} = req.body
  const post = await Comment.findOne({_id});
  
  // Check if user liked
  if (post.likedBy.includes(userId)) {
    post.likes -= 1;
    post.likedBy = post.likedBy.filter(id => id !== userId);
    await post.save();
    return res.json({ liked: true, likes: post.likes });
  }else{
    return res.json({ liked: false, message: 'Not liked yet!' });
  }

}


module.exports = {addComment, getComment, deleteComment, unlikePost, likePost}