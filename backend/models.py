from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

class SymmetryAnalysis(BaseModel):
    score: float
    assessment: str
    left_distance: float
    right_distance: float

class FeatureAnalysis(BaseModel):
    measurement: str
    assessment: str

class FaceAnalysisResult(BaseModel):
    landmarks_count: int
    symmetry: SymmetryAnalysis
    features: Dict[str, FeatureAnalysis]
    recommendations: List[str]
    confidence: float
    analysis_id: str
    timestamp: str

class AnalysisHistoryItem(BaseModel):
    analysis_id: str
    timestamp: str
    confidence: float
    symmetry_score: float

class AnalysisHistory(BaseModel):
    history: List[AnalysisHistoryItem]
    count: int

class ConsultationRecommendation(BaseModel):
    analysis_id: str
    consultation_notes: List[str]
    suggested_procedures: List[str]
    timeline: str
    confidence: float

class APIResponse(BaseModel):
    message: str
    status: str
    data: Optional[Dict] = None

class HealthCheck(BaseModel):
    status: str
    timestamp: str