const uploadFile = (req, res) => {
    console.log(req.file, req.body)
    res.redirect('/folders')
}


export default { uploadFile}