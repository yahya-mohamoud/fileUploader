import { Router } from "express";
import multer from "multer";
import { supabase } from "../supabase.js";
import { PrismaClient } from "@prisma/client";
// import fileControllers from "../controllers/fileControllers.js";

const prisma = new PrismaClient()

const fileRoute = Router()
const upload = multer({ storage: multer.memoryStorage() })

fileRoute.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file
        const folderId = parseInt(req.body.folderId)

        if (!file) return res.status(400).json({ error: "No file uploaded" });

        const filePath = `${Date.now()}-${file.originalname}`;
        const { data, error } = await supabase.storage
            .from('upload')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            })

        if (error) throw error

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
        res.status(500).json({ error: error.message })
    }
})

fileRoute.get('/download/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const file = await prisma.file.findUnique({
        where: { id }
    })
    const { data, error } = await supabase.storage
        .from('upload')
        .download(file.name)

    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(file.name)}"`);
    res.setHeader('Content-Type', data.type);

    data.arrayBuffer().then(buffer => {
        res.send(Buffer.from(buffer));
    });
})

fileRoute.get('/delete/:id', async(req, res) => {
    const id = parseInt(req.params.id)
    const file = await prisma.file.findUnique({
        where: {id}
    })

    const {error: storageError} = await supabase.storage
        .from('upload')
        .remove([file.path])

    await prisma.file.delete({
        where: {id}
    })

    res.redirect('/folders')

})

export default fileRoute