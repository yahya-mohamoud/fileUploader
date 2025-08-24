import { PrismaClient } from "@prisma/client";
import { filesize } from "filesize";
const prisma = new PrismaClient()

const createPost = async (req, res, next) => {
    try {
        const { foldername } = req.body
        const userId = parseInt(req.user.id)

        await prisma.folder.create({
            data: {
                name: foldername,
                user: {
                    connect: { id: userId }
                }
            }
        })
        res.redirect('/folders')

    } catch (error) {
        next(error)
    }
}

const getAllFolders = async (req, res, next) => {
    const folders = await prisma.folder.findMany()
    res.render('folders/all', { folders: folders })
}

const getOneFolder = async (req, res) => {
    const id = parseInt(req.params.id)

    const folder = await prisma.folder.findUnique({
        where: { id },
        include: {
            files: true
        }
    })
    const files = await prisma.file.findMany()
    const formattedFiles = files.map(file => ({
        ...file,
        sizeFormatted: filesize(file.size)
    }))
    res.render('folders/folderDetails', { folder: folder, files: formattedFiles })

}

const updateFolderGet = async (req, res) => {
    const id = parseInt(req.params.id)
    const folder = await prisma.folder.findUnique({
        where: { id }
    })
    res.render('folders/edit.ejs', { folder: folder })
}

const deleteFolder = async (req, res) => {
    const id = parseInt(req.params.id)
    const folder = await prisma.folder.delete({
        where: { id }
    })
    res.redirect('/folders')
}

const updateFolderPost = async (req, res) => {
    const id = parseInt(req.params.id)
    const editedName = req.body.foldername;
    const editFolder = await prisma.folder.update({
        where: { id },
        data: {
            name: editedName
        }
    })
    res.redirect('/folders')
}
export default { createPost, getAllFolders, getOneFolder, updateFolderPost, updateFolderGet, deleteFolder }