const htmldata  = require('../models/htmlmodels');

// adding html files
const addfile = async(req, res) =>{
  const { html, css, js , userId, name} = req.body;
  // console.log(req.body)
  // const {userId} = req.user;
  if (!html || !userId || !name) {
    res.json({ 
      success : false,
      message: "html, userid, and name code is required"
    });
  }
  
  try {
      const newhtml = new htmldata({
        userId: userId,
        html: html,
        css:css,
        js:js,
        name: name
      })
      
      await newhtml.save();
    res.status(201).json({ 
      success: true, 
      message: 'HTML block added successfully',
      data: newhtml
    });
    }
   catch (err) {
     res.status(404).json({ 
      success: false, 
      message: err.message[0],
    });
    console.error('Error:', err);
    
  }
}


// getting html hasChildNodes

const gethtml = async (req, res) => {
	const { codeid } = req.query;
if (!codeid) {
			return res
				.status(404)
				.json({ success: false, message: 'code id is required' });
		}
	try {
		const existingcode = await htmldata.find({ userId : codeid });
		if (!existingcode) {
			return res
				.status(404)
				.json({ success: false, message: 'code unavailable' });
		}
		res
			.status(200)
			.json({ success: true, message: 'single user code', data: existingcode });
	} catch (error) {
	//	console.log(error);
		res
				.status(404)
				.json({ success: false,
				message: error.message[0]});
	}
};

// delete html codes
const deletehtml = async (req, res) => {
	const { _id, userId } = req.query;
	try {
		const existingcode = await htmldata.findOne({ _id });
		if (!existingcode) {
			return res
				.status(404)
				.json({ success: false, message: 'code already unavailable' });
		}
		if (existingcode.userId.toString() !== userId) {
			return res.status(403).json({ success: false, message: 'Unauthorized' });
		}

		await htmldata.deleteOne({ _id });
		res.status(200).json({ success: true, message: 'code deleted'});
	} catch (error) {
		console.log(error);
	}
};



module.exports = {addfile, gethtml, deletehtml}