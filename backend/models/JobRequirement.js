const mongoose = require('mongoose');

const jobRequirementSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    jobDescription: {
      type: String,
      required: [true, 'Job description is required'],
      minlength: [20, 'Job description must be at least 20 characters'],
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: function(arr) {
          return arr.length > 0;
        },
        message: 'Skills array cannot be empty'
      }
    },
    experience: {
      type: String,
      required: [true, 'Experience requirement is required'],
      trim: true,
    },
    candidateCount: {
      type: Number,
      required: [true, 'Candidate count is required'],
      min: [1, 'Candidate count must be at least 1'],
      default: 5,
    },
    resumeCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for faster queries
jobRequirementSchema.index({ createdAt: -1 });
jobRequirementSchema.index({ jobTitle: 'text', jobDescription: 'text' });

const JobRequirement = mongoose.model('JobRequirement', jobRequirementSchema);

module.exports = JobRequirement;