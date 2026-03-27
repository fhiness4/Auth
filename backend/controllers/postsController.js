
const Post = require('../models/postmodel');
const user  = require('../models/usersmodel');
const {createPostSchema} = require('../middlewares/validator')
// get posts
exports.getPosts = async (req, res) => {
	const { page } = req.query;
	const postsPerPage = 10;

	try {
		let pageNum = 0;
		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const result = await Post.find()
			.sort({ createdAt: -1 })
			.skip(pageNum * postsPerPage)
			.limit(postsPerPage)
			.populate(
			  {
				path: 'userId',
				select: ['email', "name","profilepic", "createdAt"]
			 });
		res.status(200).json({ success: true, message: 'posts', data: result });
	} catch (error) {
		console.log(error);
	}
};

// create post

exports.createPost = async (req, res) => {
	const { title, description , codeId, postPic, userId, tags} = req.body;
//   console.log(req.body)
	//const { userId } = req.user;
	try {
		const { error, value } = createPostSchema.validate({
			title,
			description,
			userId
		});
		if (error) {
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}
    
      const result = await Post.create({
			title,
			description,
			codeId,
			postPic,
			userId,
			tags
		});
		res.status(201).json({ success: true, message: 'created', data: result });
    
		
	} catch (error) {
		console.log(error);
	}
};
// get single post
exports.singlePost = async (req, res) => {
	const { _id } = req.query;

	try {
		const existingPost = await Post.findOne({ _id }).populate({
			path: 'userId',
			select: ['email', "name","profilepic", "createdAt"],
		});
		if (!existingPost) {
			return res
				.status(404)
				.json({ success: false, message: 'Post unavailable' });
		}
		res
			.status(200)
			.json({ success: true, message: 'single post', data: existingPost });
	} catch (error) {
		console.log(error);
	}
};

// updating post 

exports.updatePost = async (req, res) => {
	const { _id } = req.query;
	const { title, description } = req.body;
	const { userId } = req.user;
	try {
		const { error, value } = createPostSchema.validate({
			title,
			description,
			userId,
		});
		if (error) {
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}
		const existingPost = await Post.findOne({ _id });
		if (!existingPost) {
			return res
				.status(404)
				.json({ success: false, message: 'Post unavailable' });
		}
		if (existingPost.userId.toString() !== userId) {
			return res.status(403).json({ success: false, message: 'Unauthorized' });
		}
		existingPost.title = title;
		existingPost.description = description;

		const result = await existingPost.save();
		res.status(200).json({ success: true, message: 'Updated', data: result });
	} catch (error) {
		console.log(error);
	}
};

exports.deletePost = async (req, res) => {
	const { _id , userid} = req.query;

//	const { userId } = req.user;
  	try {
  		const existingPost = await Post.findOne({ _id });
  		if (!existingPost) {
  			return res
  				.status(404)
  				.json({ success: false, message: 'Post already unavailable' });
  		}
  		if (existingPost.userId.toString() !== userid) {
  			return res.status(403).json({ success: false, message: 'Unauthorized' });
  		}

		await Post.deleteOne({ _id });
		res.status(200).json({ success: true, message: 'deleted' });
	} catch (error) {
		console.log(error);
	}
};



// LIKE a post
exports.likePost = async(req, res) => {
  const{codeId, userId} = req.body
  const post = await Post.findOne({_id:codeId});
  
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

// UNLIKE a post
exports.unlikePost = async(req, res) =>{
  const{codeId, userId} = req.body
  const post = await Post.findOne({_id:codeId});
  
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


  // Advanced search with likes sorting
  exports.searchpost = async (req, res) =>{
    try {
      const {
        search,
        tags,
        sortBy = 'recents',
        page = 1,
        limit = 10,
      } = req.query;

      // Build query object
      let query = {};

      // Text search on name and description
      if (search) {
        query.title = {
          $regex: `^${search}`,
          $options: "i"
        }
      }

      // Tag filtering
      if (tags) {
        query.tags = {
          $regex: `^${tags}`,
          $options: "i"
        };
      }


      // Build sort object - prioritize likes sorting
      let sort = {};
      
      if (sortBy === 'likes') {
        sort.likes = -1;
      }
       else if (sortBy === 'recents') {
          sort.createdAt = -1; 
        }
        else {
        sort = { likes: -1, createdAt: -1 };
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query with pagination
      const postitems = await Post.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)).populate(
			  {
				path: 'userId',
				select: ['email', "name","profilepic", "createdAt"]
			 }).lean(); 

      // Get total count for pagination
      const total = await Post.countDocuments(query);

      

      res.json({
        success: true,
        data: postitems,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
        metadata: {
          sort: sort,
          filters: query,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

