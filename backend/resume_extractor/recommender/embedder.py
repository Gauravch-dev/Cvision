# recommender/embedder.py
from __future__ import annotations
from dataclasses import dataclass
from typing import List, Dict, Any, Optional
import numpy as np

try:
    from sentence_transformers import SentenceTransformer
except ImportError as e:
    raise ImportError("pip install sentence-transformers") from e


def _to_unit(vec: np.ndarray) -> np.ndarray:
    n = np.linalg.norm(vec)
    if n == 0:
        return vec
    return vec / n


@dataclass
class Embedder:
    model_name: str = "sentence-transformers/all-MiniLM-L6-v2"
    device: Optional[str] = None  # "cpu" or "cuda" if you want to force

    def __post_init__(self):
        if self.device:
            self.model = SentenceTransformer(self.model_name, device=self.device)
        else:
            self.model = SentenceTransformer(self.model_name)

    def encode_texts(self, texts: List[str], batch_size: int = 64) -> np.ndarray:
        # returns np.ndarray shape [N, D]
        emb = self.model.encode(
            texts,
            batch_size=batch_size,
            show_progress_bar=False,
            convert_to_numpy=True,
            normalize_embeddings=True,  # already unit vectors
        )
        return emb

    def encode_one(self, text: str) -> np.ndarray:
        emb = self.encode_texts([text], batch_size=1)[0]
        return emb

    def embed_views(self, views: Dict[str, str]) -> Dict[str, list]:
        """
        views = {
          "skills": "...",
          "experience": "...",
          "projects": "...",
          "education": "...",
          "certifications": "...",
          "phrases": "...",
          "full_text": "..."
        }
        """
        embeddings = {}
        for key, text in views.items():
            embeddings[key] = self.encode_one(text).tolist()
        return embeddings
