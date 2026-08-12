class PacketParser:

    @staticmethod
    def parse(packet):

        values = packet.split(",")

        if len(values) != 7:
            raise ValueError(
                f"Invalid packet received: {packet}"
            )

        return {

            "nodeId": "NODE01",

            "temperature": float(values[1]),

            "humidity": float(values[2]),

            "pressure": float(values[3]),

            "gasResistance": float(values[4]),

            "magnetometer": {

                "x": float(values[5]),
                "y": float(values[6]),
                "z": float(values[7])

            }

        }