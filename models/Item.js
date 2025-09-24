import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: [true, 'Please specify if the item is lost or found']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description of the item'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please provide the location where the item was lost/found'],
    trim: true
  },
  image: {
    type: String,
    default: '' // URL to the image
  },
  status: {
    type: String,
    enum: ['pending', 'matched', 'claimed'],
    default: 'pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  contactInfo: {
    type: String,
    default: ''
  }
});

// Add text index for search functionality
ItemSchema.index({ description: 'text', category: 'text', location: 'text' });

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
