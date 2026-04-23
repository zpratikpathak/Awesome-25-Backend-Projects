# 09 - Random Quote API

A Python-based REST API built with Flask that serves random quotes.

## Tech Stack
- Python 3.x
- Flask
- Flask-CORS

## Setup

1. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   python app.py
   ```

## Endpoints

### `GET /api/quotes/random`
Returns a random quote.
**Response:**
```json
{
  "author": "Albert Einstein",
  "text": "Life is like riding a bicycle. To keep your balance, you must keep moving."
}
```

### `GET /api/quotes`
Returns all available quotes in the system.