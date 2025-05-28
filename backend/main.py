from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cv2
import numpy as np
import mediapipe as mp
from typing import Dict, List, Optional
import io
from PIL import Image
import uuid
import json
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="NextFace AI API",
    description="Facial analysis API for plastic surgery consultation",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize MediaPipe
mp_face_mesh = mp.solutions.face_mesh
mp_face_detection = mp.solutions.face_detection
mp_drawing = mp.solutions.drawing_utils

class FaceAnalyzer:
    def __init__(self):
        self.face_mesh = mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5
        )
        self.face_detection = mp_face_detection.FaceDetection(
            model_selection=1,
            min_detection_confidence=0.5
        )
    
    def analyze_face(self, image: np.ndarray) -> Dict:
        """Analyze facial features and landmarks"""
        try:
            # Convert BGR to RGB
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Face detection
            detection_results = self.face_detection.process(rgb_image)
            if not detection_results.detections:
                raise ValueError("No face detected in the image")
            
            # Face mesh analysis
            mesh_results = self.face_mesh.process(rgb_image)
            if not mesh_results.multi_face_landmarks:
                raise ValueError("Could not extract facial landmarks")
            
            landmarks = mesh_results.multi_face_landmarks[0]
            
            # Analyze facial features
            analysis_result = {
                "landmarks_count": len(landmarks.landmark),
                "symmetry": self._analyze_symmetry(landmarks, image.shape),
                "features": self._analyze_features(landmarks, image.shape),
                "recommendations": self._generate_recommendations(landmarks, image.shape),
                "confidence": self._calculate_confidence(detection_results.detections[0]),
                "analysis_id": str(uuid.uuid4()),
                "timestamp": datetime.now().isoformat()
            }
            
            return analysis_result
            
        except Exception as e:
            logger.error(f"Face analysis error: {e}")
            raise HTTPException(status_code=400, detail=f"Face analysis failed: {str(e)}")
    
    def _analyze_symmetry(self, landmarks, image_shape) -> Dict:
        """Analyze facial symmetry"""
        try:
            # Get key landmark points
            height, width = image_shape[:2]
            
            # Convert normalized coordinates to pixel coordinates
            points = []
            for landmark in landmarks.landmark:
                x = int(landmark.x * width)
                y = int(landmark.y * height)
                points.append([x, y])
            
            # Calculate symmetry score (simplified)
            # In a real implementation, you would use more sophisticated algorithms
            left_eye = np.array(points[33])  # Left eye center approximation
            right_eye = np.array(points[362])  # Right eye center approximation
            nose_tip = np.array(points[1])  # Nose tip
            
            # Calculate distances and symmetry
            face_center_x = width // 2
            left_distance = abs(left_eye[0] - face_center_x)
            right_distance = abs(right_eye[0] - face_center_x)
            
            symmetry_score = max(0, 100 - abs(left_distance - right_distance) * 2)
            
            assessment = "Excellent" if symmetry_score > 90 else \
                        "Good" if symmetry_score > 80 else \
                        "Fair" if symmetry_score > 70 else "Needs attention"
            
            return {
                "score": round(symmetry_score, 1),
                "assessment": assessment,
                "left_distance": float(left_distance),
                "right_distance": float(right_distance)
            }
        except Exception as e:
            logger.error(f"Symmetry analysis error: {e}")
            return {"score": 0, "assessment": "Analysis failed", "left_distance": 0, "right_distance": 0}
    
    def _analyze_features(self, landmarks, image_shape) -> Dict:
        """Analyze individual facial features"""
        try:
            height, width = image_shape[:2]
            features = {}
            
            # Convert landmarks to pixel coordinates
            points = []
            for landmark in landmarks.landmark:
                x = int(landmark.x * width)
                y = int(landmark.y * height)
                points.append([x, y])
            
            # Nose analysis
            nose_tip = points[1]
            nose_bridge = points[6]
            nose_width = abs(points[31][0] - points[35][0])  # Nostril width
            
            features["nose"] = {
                "measurement": f"{nose_width}px width",
                "assessment": "Proportional" if 30 < nose_width < 50 else "Consider consultation"
            }
            
            # Eye analysis
            left_eye_width = abs(points[33][0] - points[133][0])
            right_eye_width = abs(points[362][0] - points[263][0])
            eye_symmetry = abs(left_eye_width - right_eye_width)
            
            features["eyes"] = {
                "measurement": f"L:{left_eye_width}px, R:{right_eye_width}px",
                "assessment": "Symmetric" if eye_symmetry < 5 else "Slight asymmetry detected"
            }
            
            # Lip analysis
            upper_lip = points[13]
            lower_lip = points[14]
            lip_thickness = abs(upper_lip[1] - lower_lip[1])
            
            features["lips"] = {
                "measurement": f"{lip_thickness}px thickness",
                "assessment": "Natural proportion" if 15 < lip_thickness < 30 else "Consider enhancement"
            }
            
            return features
            
        except Exception as e:
            logger.error(f"Feature analysis error: {e}")
            return {"error": "Feature analysis failed"}
    
    def _generate_recommendations(self, landmarks, image_shape) -> List[str]:
        """Generate AI-powered recommendations"""
        try:
            recommendations = []
            
            # Basic recommendations based on analysis
            recommendations.append("Maintain good skincare routine for optimal results")
            recommendations.append("Consider professional consultation for personalized advice")
            recommendations.append("Non-invasive treatments may enhance natural features")
            
            # You can integrate with OpenAI GPT here for more sophisticated recommendations
            # This is a placeholder for LangChain integration
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Recommendations generation error: {e}")
            return ["Consult with a qualified plastic surgeon for personalized recommendations"]
    
    def _calculate_confidence(self, detection) -> float:
        """Calculate analysis confidence score"""
        try:
            # Use detection confidence as base
            base_confidence = detection.score[0] * 100
            return round(min(95.0, base_confidence), 1)
        except:
            return 75.0

# Initialize face analyzer
face_analyzer = FaceAnalyzer()

# In-memory storage (in production, use a proper database)
analysis_storage = {}

@app.get("/")
async def root():
    return {"message": "NextFace AI API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/analyze-face")
async def analyze_face(file: UploadFile = File(...)):
    """Upload and analyze a face image"""
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image data
        image_data = await file.read()
        
        # Convert to OpenCV format
        image = Image.open(io.BytesIO(image_data))
        image_array = np.array(image)
        
        # Convert RGB to BGR for OpenCV
        if len(image_array.shape) == 3:
            image_array = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)
        
        # Analyze the face
        analysis_result = face_analyzer.analyze_face(image_array)
        
        # Store result (in production, save to database)
        analysis_id = analysis_result["analysis_id"]
        analysis_storage[analysis_id] = analysis_result
        
        logger.info(f"Face analysis completed for ID: {analysis_id}")
        
        return JSONResponse(
            status_code=200,
            content=analysis_result
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analyze face endpoint error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/analysis-history")
async def get_analysis_history():
    """Get all analysis history"""
    try:
        # Return list of all analyses (without full data for performance)
        history = []
        for analysis_id, data in analysis_storage.items():
            history.append({
                "analysis_id": analysis_id,
                "timestamp": data.get("timestamp"),
                "confidence": data.get("confidence"),
                "symmetry_score": data.get("symmetry", {}).get("score", 0)
            })
        
        # Sort by timestamp (newest first)
        history.sort(key=lambda x: x["timestamp"] if x["timestamp"] else "", reverse=True)
        
        return {"history": history, "count": len(history)}
        
    except Exception as e:
        logger.error(f"Get history error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve analysis history")

@app.get("/api/analysis/{analysis_id}")
async def get_analysis(analysis_id: str):
    """Get specific analysis by ID"""
    try:
        if analysis_id not in analysis_storage:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        return analysis_storage[analysis_id]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get analysis error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve analysis")

@app.delete("/api/analysis/{analysis_id}")
async def delete_analysis(analysis_id: str):
    """Delete specific analysis"""
    try:
        if analysis_id not in analysis_storage:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        del analysis_storage[analysis_id]
        
        return {"message": "Analysis deleted successfully", "analysis_id": analysis_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete analysis error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete analysis")

@app.get("/api/consultation/{analysis_id}")
async def get_consultation_recommendations(analysis_id: str):
    """Get detailed consultation recommendations for an analysis"""
    try:
        if analysis_id not in analysis_storage:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        analysis = analysis_storage[analysis_id]
        
        # Generate detailed consultation recommendations
        # This is where you would integrate with LangChain and OpenAI GPT
        detailed_recommendations = {
            "analysis_id": analysis_id,
            "consultation_notes": [
                "Based on facial analysis, the following areas may benefit from consultation:",
                f"Facial symmetry score: {analysis.get('symmetry', {}).get('score', 0)}%",
                "Consider discussing enhancement options with a qualified surgeon",
                "Non-invasive treatments may be suitable as a first step"
            ],
            "suggested_procedures": [
                "Consultation for facial harmony assessment",
                "Discussion of non-surgical options",
                "Skincare regimen optimization"
            ],
            "timeline": "Schedule consultation within 2-4 weeks for optimal planning",
            "confidence": analysis.get("confidence", 0)
        }
        
        return detailed_recommendations
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get consultation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate consultation recommendations")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)