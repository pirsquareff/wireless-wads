# coding: utf-8
import random
import time
import paho.mqtt.publish as publish
import json
import numpy as np
import sys


def get_device(mac, dist):
    return {'id': mac, 'distance': dist}


def get_data(pi_mac, devices_list):
    return {'fromRaspId': pi_mac, 'devices': devices_list, 'nDevices': len(devices_list)}


def get_dist():
    return 10#random.uniform(0.5, 10) + 10


def get_mac():
    return "%02x:%02x:%02x:%02x:%02x:%02x" % (
        random.randint(0, 255),
        random.randint(0, 255),
        random.randint(0, 255),
        random.randint(0, 255),
        random.randint(0, 255),
        random.randint(0, 255)
    )


def pub(msg):
    publish.single("wads/project/demo", msg,
                   hostname="35.198.193.141", port=28104)


f = open('./stationData.json', encoding='thai')
s = ''
for l in f:
    s += l
f.close()
station = json.loads(s, encoding='thai')
print(station)
print(sys.argv)
if(len(sys.argv) != 4):
    print('pls input max_devices and sleep time and pi_station')
else:
    if len(sys.argv) == 4:
        pi_mac = int(sys.argv[3]) % 10
        pi_mac = station[pi_mac]['id']
        print(pi_mac)
    else:
        pi_mac = get_mac()
    max_devices = int(sys.argv[1])
    sleep_time = int(sys.argv[2])

    print(max_devices, sleep_time)
    while True:
        is_send = True  # np.random.choice([1, 2], p=[0.9, 0.1]) % 2 == 1
        if is_send:
            n_devices = 5  # np.random.randint(0, max_devices)
            #n_devices = np.random.choice([0, n_devices])
            devices_list = [get_device(get_mac(), get_dist())
                            for i in range(n_devices)]
            data = get_data(pi_mac=pi_mac, devices_list=devices_list)
            # data['nDevices'] = n_devices
            msg = json.dumps(data, sort_keys=True)
            print(msg)
            pub(msg)

        time.sleep(sleep_time)
# data_station = json.loads(station, encoding='thai')
# print(data_station[0]['id'])
