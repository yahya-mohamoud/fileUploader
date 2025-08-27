import { Router } from "express";
import multer from "multer";
import { supabase } from "../supabase.js";
import { PrismaClient } from "@prisma/client";
// import fileControllers from "../controllers/fileControllers.js";
import path from 'path'
const prisma = new PrismaClient()

const fileRoute = Router()
const upload = multer({ storage: multer.memoryStorage() })

fileRoute.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file
        const folderId = parseInt(req.body.folderId)

        if (!file) return res.status(400).json({ error: "No file uploaded" });

        const filePath = `${file.originalname}`;
        const { data, error } = await supabase.storage
            .from('upload')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            })

        if (error) {
            req.flash('error', error)
            throw error
        }

        const { data: publicUrlData } = supabase.storage
            .from('upload')
            .getPublicUrl(filePath)


        const fileUrl = publicUrlData.publicUrl;
        const savedFile = await prisma.file.create({
            data: {
                filename: file.originalname,
                path: fileUrl,
                size: file.size,
                folderId: folderId
            }
        })

        res.redirect(`/folders/details/${folderId}`)

    } catch (error) {
        req.flash(error, 'failed to upload the file')
    }
})

fileRoute.get('/download/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const file = await prisma.file.findUnique({
        where: { id }
    })


    if (!file) {
        return req.flash('file not found')
    }

    const { data, error } = await supabase.storage
        .from('upload')
        .download(file.filename)

    const buffer = Buffer.from(await data.arrayBuffer())

    res.setHeader(
        'Content-Disposition',
        `attachment; filename='${path.basename(file.filename)}'`
    )

    res.setHeader(
        'Content-Type',
        'application/octet-stream'
    )

    res.send(buffer)
})

fileRoute.get('/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const file = await prisma.file.findUnique({
        where: { id }
    })

    console.log(file.path)

    const { error: storageError } = await supabase.storage
        .from('upload')
        .remove([file.filename])

    await prisma.file.delete({
        where: { id }
    })

    res.redirect('/folders')

})

fileRoute.get('/views/:filename', async (req, res) => {
    const filename = req.params.filename;
    const {data, error} = await supabase
        .storage
        .from('upload')
        .getPublicUrl(filename)

            console.log(data.publicUrl)
        return res.redirect(data.publicUrl)
})

export default fileRoute