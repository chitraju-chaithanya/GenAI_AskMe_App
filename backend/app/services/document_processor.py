from openai import AsyncOpenAI
from typing import List
import os
import magic
from PyPDF2 import PdfReader
from io import BytesIO
from ..models import Document
from ..database import SessionLocal

# Initialize OpenAI client
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def process_document(file) -> List[float]:
    content = await file.read()
    
    # Detect file type
    file_type = magic.from_buffer(content, mime=True)
    
    # Extract text based on file type
    if file_type == 'application/pdf':
        text = extract_text_from_pdf(content)
    elif file_type == 'text/plain':
        text = content.decode('utf-8')
    else:
        raise ValueError(f"Unsupported file type: {file_type}")
    
    # Split text into chunks
    chunks = split_text(text)
    
    # Generate embeddings using OpenAI
    embeddings = []
    async with SessionLocal() as db:
        for chunk in chunks:
            if chunk.strip():  # Only process non-empty chunks
                embedding = await generate_embedding(chunk)
                embeddings.append(embedding)
                
                # Store in database
                doc = Document(content=chunk, embedding=embedding)
                db.add(doc)
                await db.commit()
        
    return embeddings

def extract_text_from_pdf(content: bytes) -> str:
    pdf_file = BytesIO(content)
    pdf_reader = PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() + "\n"
    return text

def split_text(text: str, chunk_size: int = 1000) -> List[str]:
    words = text.split()
    chunks = []
    current_chunk = []
    current_size = 0
    
    for word in words:
        word_size = len(word) + 1  # +1 for space
        if current_size + word_size > chunk_size:
            if current_chunk:  # Only add non-empty chunks
                chunks.append(' '.join(current_chunk))
            current_chunk = [word]
            current_size = word_size
        else:
            current_chunk.append(word)
            current_size += word_size
    
    if current_chunk:  # Add the last chunk if it exists
        chunks.append(' '.join(current_chunk))
    
    return chunks

async def generate_embedding(text: str) -> List[float]:
    try:
        response = await client.embeddings.create(
            input=text,
            model="text-embedding-ada-002"
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Error generating embedding: {str(e)}")
        raise
