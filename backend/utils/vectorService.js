/**
 * Vector Service
 * Handles in-memory vector operations for the recommendation engine.
 */
class VectorService {
    /**
     * Calculates the Cosine Similarity between two vectors.
     * Formula: (A . B) / (||A|| * ||B||)
     * Range: -1 to 1 (1 means identical direction)
     * @param {number[]} vecA 
     * @param {number[]} vecB 
     * @returns {number} Similarity score
     */
    static cosineSimilarity(vecA, vecB) {
        if (!vecA || !vecB || vecA.length !== vecB.length) {
            // Return 0 if vectors are invalid or mismatched
            // (Graceful fallback for missing embeddings)
            return 0;
        }

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }

        if (normA === 0 || normB === 0) return 0;

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}

module.exports = VectorService;
