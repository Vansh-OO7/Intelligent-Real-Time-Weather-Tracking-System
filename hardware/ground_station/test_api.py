from packet_parser import PacketParser
from api_client import APIClient

try:
    packet = "NODE01,29.6,71,1007.3,18230,12,-5,38"

    sensor_data = PacketParser.parse(packet)
    print("Parsed:", sensor_data)

    response = APIClient.send(sensor_data)

    print("Status Code:", response.status_code)
    print("Response:", response.text)

except Exception as e:
    print("ERROR:", e)