import mongoose from 'mongoose';

const hackathonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    default: 'Virtual'
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x200?text=Hackathon'
  },
  source: {
    type: String,
    required: true,
    enum: ['Devfolio', 'Devpost', 'Sample', 'User']
  },
  tags: [{
    type: String,
    trim: true
  }],
  registrationUrl: String,
  startDate: Date,
  endDate: Date,
  prizes: [{
    rank: String,
    description: String,
    value: String
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
hackathonSchema.index({ title: 'text', description: 'text' });
hackathonSchema.index({ status: 1, startDate: 1 });

const Hackathon = mongoose.model('Hackathon', hackathonSchema);

export default Hackathon; 