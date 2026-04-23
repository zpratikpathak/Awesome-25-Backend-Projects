from app.services.stats import get_stats
class BotRunner:
    def run(self):
        print("Bot running with stats:", get_stats())