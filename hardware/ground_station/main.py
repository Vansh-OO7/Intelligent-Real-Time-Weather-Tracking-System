from serial_reader import SerialReader
from packet_parser import PacketParser
from api_client import APIClient


def main():

    reader = SerialReader()

    print("Ground Station Started...\n")

    while True:

        try:

            packet = reader.read_packet()

            if packet is None:
                continue

            print(f"Received Packet: {packet}")

            sensor_data = PacketParser.parse(packet)

            print(sensor_data)

            response = APIClient.send(sensor_data)

            if response.status_code == 201:
                print("✅ Data Stored Successfully\n")
            else:
                print(response.status_code)
                print(response.text)

        except Exception as e:
            print("ERROR:", e)


if __name__ == "__main__":
    main()