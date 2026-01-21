const JobRequirement = require('../models/JobRequirement');
const mongoose = require('mongoose'); // Needed for explicit collection access if model doesn't exist for parsed_resumes
const VectorService = require('../utils/vectorService');

// Weights defined by user
const WEIGHTS = {
    phrases: 0.45,
    full_text: 0.35,
    skills: 0.10,
    experience: 0.05,
    education: 0.03,
    certifications: 0.02,
};

// @route   GET /api/recommendations/:jobId
// @desc    Get recommended candidates for a job
// @access  Public
exports.getRecommendations = async (req, res) => {
    try {
        const { jobId } = req.params;

        // 1. Fetch the Job Requirement
        const job = await JobRequirement.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Ensure Job has embeddings
        if (!job.embeddings || !job.embeddings.full_text) {
            return res.status(400).json({
                success: false,
                message: 'Job embeddings are missing. Please re-generate the job analysis.'
            });
        }

        // 2. MongoDB Atlas Vector Search (Retrieval)
        // We use 'full_text' as the primary retrieval vector (35% weight)
        const pipeline = [
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embeddings.full_text",
                    queryVector: job.embeddings.full_text,
                    numCandidates: 100, // Number of nearest neighbors to find in the index
                    limit: 50           // Return top 50 for in-memory reranking
                }
            },
            {
                $project: {
                    filename: 1,
                    parsed_data: 1,
                    embeddings: 1, // Need all embeddings for reranking
                    score: { $meta: "vectorSearchScore" }
                }
            }
        ];

        // Access the 'parsed_resumes' collection directly
        const candidates = await mongoose.connection.db
            .collection('parsed_resumes')
            .aggregate(pipeline)
            .toArray();

        // 3. In-Memory Reranking (Hybrid Scoring)
        const scoredCandidates = candidates.map(candidate => {
            const cEmbs = candidate.embeddings || {};
            const jEmbs = job.embeddings || {};

            // Safe similarity calculation (returns 0 if missing)
            const scores = {
                phrases: VectorService.cosineSimilarity(jEmbs.phrases, cEmbs.phrases),
                full_text: VectorService.cosineSimilarity(jEmbs.full_text, cEmbs.full_text),
                skills: VectorService.cosineSimilarity(jEmbs.skills, cEmbs.skills),
                experience: VectorService.cosineSimilarity(jEmbs.experience, cEmbs.experience),
                education: VectorService.cosineSimilarity(jEmbs.education, cEmbs.education),
                certifications: VectorService.cosineSimilarity(jEmbs.certifications, cEmbs.certifications),
            };

            // Calculate Weighted Final Score
            const finalScore =
                (scores.phrases * WEIGHTS.phrases) +
                (scores.full_text * WEIGHTS.full_text) +
                (scores.skills * WEIGHTS.skills) +
                (scores.experience * WEIGHTS.experience) +
                (scores.education * WEIGHTS.education) +
                (scores.certifications * WEIGHTS.certifications);

            return {
                _id: candidate._id,
                filename: candidate.filename,
                parsed_data: candidate.parsed_data,
                matchScore: Math.round(Math.max(0, finalScore * 100)), // Convert to 0-100%
                matchDetails: {
                    phrases: Math.round(Math.max(0, scores.phrases * 100)),
                    full_text: Math.round(Math.max(0, scores.full_text * 100)),
                    skills: Math.round(Math.max(0, scores.skills * 100)),
                    experience: Math.round(Math.max(0, scores.experience * 100)),
                }
            };
        });

        // 4. Sort by Final Score (Descending)
        scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);

        // 5. Return Top Results
        const topMatches = scoredCandidates.slice(0, 10);

        res.status(200).json({
            success: true,
            count: topMatches.length,
            data: topMatches
        });

    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching recommendations',
            error: error.message
        });
    }
};
