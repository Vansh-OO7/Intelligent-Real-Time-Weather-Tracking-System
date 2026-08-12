import serial

from json_packet_parser import JSONPacketParser
from api_client import APIClient
from config import SERIAL_PORT, BAUD_RATE


def main():

    print("JSON Ground Station Started...\n")

    try:

        ser = serial.Serial(
            SERIAL_PORT,
            BAUD_RATE,
            timeout=1
        )

        print(f"Connected to {SERIAL_PORT}")
        print("Waiting for JSON data...\n")

    except serial.SerialException as e:

        print("Could not open serial port!")
        print("Error:", e)
        return

    try:

        while True:

            line = ser.readline().decode(
                "utf-8",
                errors="ignore"
            ).strip()

            if not line:
                continue

            print("RAW:")
            print(line)

            try:

                sensor_data = JSONPacketParser.parse(line)

            except ValueError as e:

                print("❌ Packet parsing failed:")
                print(e)
                print("--------------------------------")
                continue

            print("\nParsed Sensor Data:")
            print(sensor_data)

            try:

                response = APIClient.send(sensor_data)

                if response.status_code == 201:

                    print("✅ Data Stored Successfully\n")

                else:

                    print(
                        f"❌ Backend Error: {response.status_code}"
                    )

                    print(response.text)

            except Exception as e:

                print("❌ API Error:", e)

    except KeyboardInterrupt:

        print("\nStopping Ground Station...")

    except serial.SerialException as e:

        print("\nSerial error:", e)

    finally:

        ser.close()

        print("Serial port closed.")


if __name__ == "__main__":
    main()