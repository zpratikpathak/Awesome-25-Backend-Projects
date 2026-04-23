import random

class QuoteService:
    def __init__(self):
        self.quotes = [
            {"text": "Life is what happens when you're busy making other plans.", "author": "John Lennon"}
        ]

    def get_random(self):
        return random.choice(self.quotes) if self.quotes else {}

    def add_quote(self, text, author):
        quote = {"text": text, "author": author}
        self.quotes.append(quote)
        return quote
