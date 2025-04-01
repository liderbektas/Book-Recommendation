import express from 'express';
import Book from '../models/book.js';
import protectRoute from '../middleware/auth.middleware.js';
import cloudaniry from '../lib/cloudinary.js';

const router = express.Router();

router.post('/', protectRoute, async (req, res) => {
  try {
    const { title, caption, image, rating } = req.body;

    if (!title || !caption || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const uploadRespone = await cloudaniry.uploader.upload(image);
    const imageUrl = uploadRespone.secure_url;

    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    await newBook.save();
    res.status(200).json(newBook);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username profileImage');

    const totalBooks = await Book.countDocuments();

    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPage: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/user', protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'username profileImage email');

    res.json({ books });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (book.image && book.image.includes('cloudinary')) {
      try {
        const publicId = book.image.split('/').pop().split('.')[0];
        await cloudaniry.uploader.destroy(publicId);
      } catch (error) {
        console.log('Error deleting from cloudinary', error);
      }
    }

    await book.deleteOne();

    res.json({ message: 'Book deleted succesfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
