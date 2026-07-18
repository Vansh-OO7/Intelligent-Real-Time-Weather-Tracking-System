from packet_parser import PacketParser

packet = "NODE01,29.6,71,1007.3,18230,12,-5,38"

sensor_data = PacketParser.parse(packet)

print(sensor_data)