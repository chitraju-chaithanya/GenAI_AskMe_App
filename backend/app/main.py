from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .services.document_processor import process_document
from .services.qa_service import get_answer
from .database import init_db
import magic

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request model for questions
class QuestionRequest(BaseModel):
    question: str

@app.on_event("startup")
async def startup():
    await init_db()

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        # Check file size (e.g., limit to 10MB)
        content = await file.read()
        if len(content) > 10 * 1024 * 1024:  # 10MB
            raise HTTPException(status_code=400, detail="File too large")
            
        # Reset file pointer
        await file.seek(0)
        
        # Check file type
        file_type = magic.from_buffer(content, mime=True)
        allowed_types = ['application/pdf', 'text/plain']
        if file_type not in allowed_types:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type: {file_type}. Allowed types: PDF, TXT"
            )
            
        # Reset file pointer again
        await file.seek(0)
        
        vectors = await process_document(file)
        return {
            "message": "Document processed successfully", 
            "vectors": len(vectors),
            "file_type": file_type
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error processing document: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/ask")
async def ask_question(request: QuestionRequest):
    try:
        answer = await get_answer(request.question)
        return {"answer": answer}
    except Exception as e:
        print(f"Error generating answer: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate answer")
