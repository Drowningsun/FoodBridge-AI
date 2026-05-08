FROM python:3.13-slim

WORKDIR /app

COPY apps/ml-services/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/ml-services/ .

EXPOSE 8001

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001"]
