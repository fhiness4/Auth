const postdata = async (req, res) => {
    const {name, password} = req.body
    console.log(req.body)
    if (!name || !password) {
        return res.status(404).json({
            success: false,
            message: 'name and password is required'
        })
    }

    res.status(200).json({
        success: true,
        data: {
            userName: name,
            userPassword: password
        }
    })
}
module.exports = {postdata}