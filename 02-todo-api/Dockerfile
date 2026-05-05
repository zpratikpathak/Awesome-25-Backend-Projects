FROM python:3.12-slim-trixie
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY main.py smoke.py ./
COPY src ./src
ENV PYTHONDONTWRITEBYTECODE=1
EXPOSE 8000
CMD ["python", "main.py"]