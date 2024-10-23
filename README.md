# AskMe Assistant

A modern document-based question-answering application that uses AI to provide accurate answers based on uploaded documents. The application leverages OpenAI's GPT-3.5 model and vector embeddings for semantic search and accurate responses.

## Features

- 📄 Document Upload Support (PDF & TXT)
- 🔍 Semantic Search using Vector Embeddings
- 💡 AI-Powered Question Answering
- 🎨 Modern, Responsive UI
- 🌓 Dark/Light Mode Support
- 🚀 Real-time Processing
- 📊 Progress Indicators
- ⚡ Async Backend Processing

## Tech Stack

### Frontend
- React.js with Hooks for state management
- Chakra UI for modern, accessible components
- React Icons for beautiful icons
- Emotion for styled components
- Framer Motion for smooth animations

### Backend
- FastAPI for high-performance async API
- SQLAlchemy with async support for database operations
- OpenAI API for AI capabilities
- pgvector for efficient vector similarity search
- PostgreSQL for reliable data storage
- Python 3.9 for modern Python features

### Infrastructure
- Docker for containerization
- Docker Compose for service orchestration

## Prerequisites

- Docker and Docker Compose installed on your machine
- OpenAI API Key (get it from [OpenAI Platform](https://platform.openai.com))
- Git for version control

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/chitraju-chaithanya/GenAI_AskMe_App.git
   cd GenAI_AskMe_App
   ```

2. Create a `.env` file in the root directory:

   Then edit the `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

3. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs


5. Stoping the containers:
   ```bash
   docker-compose down
   ```

## Usage

1. Upload your documents (PDF or TXT) using the upload interface
2. Wait for the processing to complete (progress will be shown)
3. Start asking questions about your documents
4. The AI will provide relevant answers based on the content


