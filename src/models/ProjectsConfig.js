import mongoose from 'mongoose';

const projectItemSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    trim: true
  },
  stars: {
    type: Number,
    default: 0
  },
  forks: {
    type: Number,
    default: 0
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  homepage: {
    type: String,
    trim: true
  },
  topics: [{
    type: String,
    trim: true
  }],
  visible: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date
  },
  createdAt: {
    type: Date
  }
}, { _id: false });

const portfolioProjectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  results: [{
    title: {
      type: String,
      required: true,
      trim: true
    }
  }],
  link: {
    type: String,
    required: true,
    trim: true
  },
  github: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  pinned: {
    type: Boolean,
    default: false
  },
  visible: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: false });

const projectsConfigSchema = new mongoose.Schema({
  portfolioProjects: [portfolioProjectSchema],
  githubProjects: [projectItemSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastUpdated before saving
projectsConfigSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Ensure only one active config document exists
projectsConfigSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

export default mongoose.models.ProjectsConfig || mongoose.model('ProjectsConfig', projectsConfigSchema);
