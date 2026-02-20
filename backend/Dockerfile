# Dockerfile for FinTwitch Pathway Engine
FROM python:3.11-slim

LABEL maintainer="FinTwitch Team"
LABEL description="Real-time Financial Intelligence with Pathway + Gemini"

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY pathway_streaming_real.py .
COPY llm_service.py .
COPY financial_event_generator.py .

# Create .env placeholder (will be overridden by volume mount or env vars)
RUN echo "# Configure your API keys" > .env

# Expose API port
EXPOSE 8000
EXPOSE 5000
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/status || exit 1

# Run the application
CMD ["python", "pathway_streaming_real.py"]
