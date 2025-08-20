import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

const createPost =  async (req, res, next) => {
    try {
        const { foldername } = req.body
        const userId = req.user.id

         await prisma.folder.create({
            data: {
                name: foldername,
               user: {
                connect: { id: userId}
               }
            }
        })
        res.redirect('/folders')
        
    } catch (error) {
        next(error)
    }
}

const getAllFolders =  async (req, res, next) => {
      const folders = await prisma.folder.findMany()
         res.render('folders/all', {folders: folders})
}

const getOneFolder =  async (req, res) => {
    const id = parseInt(req.params.id)
    const folder = await prisma.folder.findUnique({
        where: { id },
        include: {
            files: true
        }
    })
    res.render('folders/folderDetails', {folder: folder})

}

const updateFolderGet = async(req, res) => {
    const id = parseInt(req.params.id)
    const folder = await prisma.folder.findUnique({
        where: { id }
    })
    res.render('folders/edit.ejs', {folder: folder})
}

const updateFolderPost = async(req, res) => {
    const id = parseInt(req.params.id)
    const folder = await prisma.folder.findUnique({
        where: { id }
    })
    res.render('folders/edit.ejs', {folder: folder})
}

const deleteFolder = async(req, res) => {
    const id = parseInt(req.params.id)
    const editedName = req.body.foldername;
    console.log(editedName)
    const editFolder = await prisma.folder.update({
        where: {id},
        data: {
            name: editedName
        }
    })
    console.log(editFolder)
    res.redirect('/folders')
}
export default {createPost, getAllFolders, getOneFolder, updateFolderPost,  updateFolderGet, deleteFolder}