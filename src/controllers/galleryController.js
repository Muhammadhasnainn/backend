const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Gallery = require("../models/galleryModel");

// Configure Multer to save files in an "uploads" folder with their original names
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create the uploads directory if it doesn't exist
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: File type not allowed!'));
  },
});

const getGallery = async (req, res) => {
  try {
    const images = await Gallery.getAll();
    const transformedImages = images.map((image) => ({
      id: image.id,
      alt_text: image.alt_text,
      tags: image.tags,
      image: image.image, // Return the file path
    }));
    res.status(200).json(transformedImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addImage = async (req, res) => {
  const { alt_text, tags } = req.body;
  const filePath = req.file?.path;

  if (!filePath) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  try {
    // Insert the file path into the database
    const id = await Gallery.create({ image: filePath, alt_text, tags });

    res.status(201).json({
      message: "Image added successfully",
      data: { id, alt_text, tags: tags || null, image: filePath },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch the image record to get the file path
    const image = await Gallery.getById(id);
    
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Delete the file from the filesystem
    if (image.image && fs.existsSync(image.image)) {
      try {
        await fs.promises.unlink(image.image); // Use async unlink
      } catch (unlinkError) {
        return res.status(500).json({ error: "Failed to delete image file" });
      }
    }

    // Delete the record from the database
    await Gallery.delete(id);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getGallery, addImage, deleteImage, upload };
