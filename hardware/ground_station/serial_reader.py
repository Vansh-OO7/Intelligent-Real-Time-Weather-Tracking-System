import serial

from config import SERIAL_PORT, BAUD_RATE


class SerialReader:

    def __init__(self):
        self.ser = serial.Serial(
            SERIAL_PORT,
            BAUD_RATE,
            timeout=1
        )

    def read_packet(self):

        packet = self.ser.readline().decode("utf-8").strip()

        if packet == "":
            return None

        return packet