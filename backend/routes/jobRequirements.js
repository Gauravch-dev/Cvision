const express = require('express');
const router = express.Router();
const JobRequirement = require('../models/JobRequirement');

// @route   POST /api/job-requirements
// @desc    Create a new job requirement
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      jobTitle,
      jobDescription,
      skills,
      experience,
      candidateCount,
      resumeCount,
      embeddings,
    } = req.body;

    // Validation
    if (!userId || !jobTitle || !jobDescription || !skills || !experience) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (including userId)',
      });
    }

    // Parse skills if it's a string
    const skillsArray = typeof skills === 'string'
      ? skills.split(',').map(s => s.trim()).filter(Boolean)
      : skills;

    // Create job requirement
    const jobRequirement = new JobRequirement({
      userId, // Multi-tenancy: Link to user
      jobTitle,
      jobDescription,
      skills: skillsArray,
      experience,
      candidateCount: candidateCount || 5,
      resumeCount: resumeCount || 0,
      embeddings,
    });

    await jobRequirement.save();

    res.status(201).json({
      success: true,
      message: 'Job requirement created successfully',
      data: jobRequirement,
    });
  } catch (error) {
    console.error('Error creating job requirement:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating job requirement',
      error: error.message,
    });
  }
});

// @route   GET /api/job-requirements
// @desc    Get all job requirements
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    // Build query filter
    const filter = userId ? { userId } : {};

    const jobRequirements = await JobRequirement.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: jobRequirements.length,
      data: jobRequirements,
    });
  } catch (error) {
    console.error('Error fetching job requirements:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching job requirements',
    });
  }
});

// @route   GET /api/job-requirements/:id
// @desc    Get single job requirement
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const jobRequirement = await JobRequirement.findById(req.params.id);

    if (!jobRequirement) {
      return res.status(404).json({
        success: false,
        message: 'Job requirement not found',
      });
    }

    res.status(200).json({
      success: true,
      data: jobRequirement,
    });
  } catch (error) {
    console.error('Error fetching job requirement:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching job requirement',
    });
  }
});

// @route   PUT /api/job-requirements/:id
// @desc    Update job requirement status
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { status, resumeCount } = req.body;

    const jobRequirement = await JobRequirement.findById(req.params.id);

    if (!jobRequirement) {
      return res.status(404).json({
        success: false,
        message: 'Job requirement not found',
      });
    }

    if (status) jobRequirement.status = status;
    if (resumeCount !== undefined) jobRequirement.resumeCount = resumeCount;

    await jobRequirement.save();

    res.status(200).json({
      success: true,
      message: 'Job requirement updated successfully',
      data: jobRequirement,
    });
  } catch (error) {
    console.error('Error updating job requirement:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating job requirement',
    });
  }
});

// @route   PATCH /api/job-requirements/:id/recalculate-count
// @desc    Recalculate resumeCount from actual parsed_resumes in DB
// @access  Public
router.patch('/:id/recalculate-count', async (req, res) => {
  try {
    const jobId = req.params.id;
    const mongoose = require('mongoose');

    // Count resumes in parsed_resumes collection for this jobId
    const count = await mongoose.connection.db
      .collection('parsed_resumes')
      .countDocuments({ jobId: jobId });

    // Update the jobRequirement with the new count
    const jobRequirement = await JobRequirement.findByIdAndUpdate(
      jobId,
      { resumeCount: count },
      { new: true }
    );

    if (!jobRequirement) {
      return res.status(404).json({
        success: false,
        message: 'Job requirement not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Resume count recalculated: ${count}`,
      data: jobRequirement,
    });
  } catch (error) {
    console.error('Error recalculating resume count:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while recalculating resume count',
    });
  }
});

module.exports = router;