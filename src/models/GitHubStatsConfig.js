import mongoose from 'mongoose';

const statItemSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    trim: true
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
  icon: {
    type: String,
    required: true,
    trim: true
  },
  gradient: {
    type: String,
    required: true,
    trim: true
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

const gitHubStatsConfigSchema = new mongoose.Schema({
  displayedStats: [statItemSchema],
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
gitHubStatsConfigSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Ensure only one active config document exists
gitHubStatsConfigSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

export default mongoose.models.GitHubStatsConfig || mongoose.model('GitHubStatsConfig', gitHubStatsConfigSchema);
