import mongoose from 'mongoose';

const topLanguageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  color: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const recentActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['commit', 'repo', 'pr', 'issue']
  },
  repo: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String, // Using string to match existing format (YYYY-MM-DD)
    required: true
  }
}, { _id: false });

const productivitySchema = new mongoose.Schema({
  commitsThisWeek: {
    type: Number,
    default: 0,
    min: 0
  },
  issuesOpened: {
    type: Number,
    default: 0,
    min: 0
  },
  pullRequests: {
    type: Number,
    default: 0,
    min: 0
  },
  repositoriesContributedTo: {
    type: Number,
    default: 0,
    min: 0
  },
  codeReviews: {
    type: Number,
    default: 0,
    min: 0
  }
}, { _id: false });

const recordsSchema = new mongoose.Schema({
  mostStarredRepo: {
    name: { type: String, default: 'N/A' },
    stars: { type: Number, default: 0, min: 0 }
  },
  mostForkedRepo: {
    name: { type: String, default: 'N/A' },
    forks: { type: Number, default: 0, min: 0 }
  },
  oldestRepo: {
    name: { type: String, default: 'N/A' },
    date: { type: String } // YYYY-MM-DD format
  },
  newestRepo: {
    name: { type: String, default: 'N/A' },
    date: { type: String } // YYYY-MM-DD format
  }
}, { _id: false });

const gitHubStatsSchema = new mongoose.Schema({
  // Overview Stats
  totalRepos: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  publicRepos: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  totalStars: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  totalForks: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  followers: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  following: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  
  // Activity Stats (update weekly)
  contributionsThisYear: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  contributionsLastWeek: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  longestStreak: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  currentStreak: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  
  // Language Stats
  topLanguages: [topLanguageSchema],
  
  // Project Stats by Category
  projectsByCategory: {
    'Frontend Projects': { type: Number, default: 0, min: 0 },
    'Web Applications': { type: Number, default: 0, min: 0 },
    'Backend & APIs': { type: Number, default: 0, min: 0 },
    'Learning Projects': { type: Number, default: 0, min: 0 },
    'Tools & Utilities': { type: Number, default: 0, min: 0 },
    'Mobile Apps': { type: Number, default: 0, min: 0 },
    'Other': { type: Number, default: 0, min: 0 }
  },
  
  // Recent Activity
  recentActivity: [recentActivitySchema],
  
  // Featured Projects (manually selected)
  featuredProjects: [{
    type: String,
    trim: true
  }],
  
  // Productivity Stats (update weekly)
  productivity: productivitySchema,
  
  // Personal Records
  records: recordsSchema,
  
  // Metadata
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
gitHubStatsSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Ensure only one active stats document exists
gitHubStatsSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

export default mongoose.models.GitHubStats || mongoose.model('GitHubStats', gitHubStatsSchema);
