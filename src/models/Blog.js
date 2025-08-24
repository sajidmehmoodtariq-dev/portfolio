import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxLength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  sections: [
    {
      type: {
        type: String,
        enum: ['content', 'code'],
        required: true
      },
      value: {
        type: String,
        required: true
      }
    }
  ],
  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    maxLength: [200, 'Excerpt cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  author: {
    type: String,
    required: true,
    default: 'Sajid Mehmood Tariq'
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  readTime: {
    type: Number, // in minutes
    default: 5
  },
  imageUrl: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: true
});

// Create slug from title before saving
blogSchema.pre('save', function(next) {
  // Always generate slug if it doesn't exist or title changed
  if (!this.slug || this.isModified('title') || this.isNew) {
    // Generate base slug
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
      .trim();
    
    // Ensure slug is not empty
    if (!baseSlug) {
      baseSlug = 'untitled-blog';
    }
    
    // Add timestamp to make it unique for now
    // We'll handle proper uniqueness in the route if needed
    const timestamp = Date.now().toString().slice(-6);
    this.slug = `${baseSlug}-${timestamp}`;
  }
  next();
});

// Estimate read time based on content length
blogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }
  next();
});

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);
