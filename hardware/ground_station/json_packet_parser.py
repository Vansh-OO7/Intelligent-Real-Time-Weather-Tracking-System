import json


class JSONPacketParser:

    @staticmethod
    def parse(packet):

        try:
            data = json.loads(packet)

        except json.JSONDecodeError as e:
            raise ValueError(
                f"Invalid JSON packet: {packet}"
            ) from e

        # Required sensor fields
        required_fields = [
            "nodeId",
            "temperature",
            "humidity",
            "pressure",
            "gasResistance",
            "magnetic"
        ]

        for field in required_fields:
            if field not in data:
                raise ValueError(
                    f"Missing field '{field}' in packet"
                )

        magnetic = data["magnetic"]

        return {
            "nodeId": f"NODE{int(data['nodeId']):02d}",

            "temperature": float(data["temperature"]),

            "humidity": float(data["humidity"]),

            "pressure": float(data["pressure"]),

            "gasResistance": float(data["gasResistance"]),

            "magnetometer": {
                "x": float(magnetic["x"]),
                "y": float(magnetic["y"]),
                "z": float(magnetic["z"])
            }
        }