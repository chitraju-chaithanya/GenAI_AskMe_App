from openai import AsyncOpenAI
import os
from sqlalchemy import select
from sqlalchemy.sql import text
from ..database import SessionLocal
from ..models import Document

# Initialize OpenAI client
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def get_answer(question: str) -> str:
    try:
        # Generate embedding for the question
        response = await client.embeddings.create(
            input=question,
            model="text-embedding-ada-002"
        )
        question_embedding = response.data[0].embedding
        
        # Find most relevant documents using async SQLAlchemy
        async with SessionLocal() as db:
            # Create the query using select
            query = select(Document).order_by(
                Document.embedding.cosine_distance(question_embedding)
            ).limit(3)
            
            # Execute the query
            result = await db.execute(query)
            relevant_docs = result.scalars().all()
        
        # Combine relevant documents
        context = "\n".join([doc.content for doc in relevant_docs])
        
        if not context:
            return "I don't have enough context to answer this question. Please upload relevant documents first."
        
        # Generate answer using OpenAI
        chat_response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that answers questions based on the provided context."},
                {"role": "user", "content": f"Context: {context}\n\nQuestion: {question}"}
            ]
        )
        
        return chat_response.choices[0].message.content
    except Exception as e:
        print(f"Error in get_answer: {str(e)}")
        raise
