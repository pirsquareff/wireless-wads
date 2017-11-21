
# coding: utf-8

# In[ ]:

import paho.mqtt.client as mqtt

# The callback for when the client receives a CONNACK response from the server.


def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("wads/project/demo")

# The callback for when a PUBLISH message is received from the server.


def on_message(client, userdata, msg):

    print("\n print" + " " + str(msg.payload))


client = mqtt.Client(transport='websockets')
client.on_connect = on_connect
# client.subscribe("wads/project/demo")
client.on_message = on_message
client.connect("35.198.193.141", 8000, 60)
client.subscribe("wads/project/demo")
client.loop_forever()
