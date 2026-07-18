import requests

from config import API_URL, TIMEOUT


class APIClient:

    @staticmethod
    def send(data):

        response = requests.post(
            API_URL,
            json=data,
            timeout=TIMEOUT
        )

        return response