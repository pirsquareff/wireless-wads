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
    return random.uniform(0.5, 10)


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
    publish.single("wads/project/dev", msg,
                   hostname="35.198.193.141", port=28104)


station = """
[
  {
    "id": "0c:b9:e0:b5:86:d4",
    "name": "ห้องเรียน wireless",
    "image": "" ,
    "latitude": 13.736991, 
    "longitude": 100.533730
  },
  {
    "id": "b3:1c:7d:4b:71:bb",
    "name": "ตึกวิศวกรรมศาสตร์ 3",
    "image": "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/240px-Above_Gotham.jpg",
    "latitude": 13.736809,
    "longitude": 100.533133
  },
  {
    "id": "79:5d:a2:1c:fa:ab",
    "name": "อาคารจามจุรี 9",
    "image": "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/240px-Above_Gotham.jpg",
    "latitude": 13.735909,
    "longitude": 100.525458
  },
  {
    "id": "4a:39:c3:37:69:a0",
    "name": "iCanteen (โรงอาหารคณะวิศวฯ)",
    "image": "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_Gotham.jpg/240px-Above_Gotham.jpg",
    "latitude": 13.736938,
    "longitude": 100.534143
  },
  {
    "id": "06:30:8f:5c:01:a7",
    "name": "อาคารเจริญวิศวกรรม",
    "image": "" ,
    "latitude": 13.736014,
    "longitude": 100.533846
  },
  {
    "id": "c0:61:93:9d:78:8b",
    "name": "Larngear",
    "image": "" ,
    "latitude": 13.736769, 
    "longitude": 100.533676
  },
  {
    "id": "99:c4:bf:e0:40:de",
    "name": "ตึกภาดโยธา",
    "image": "" ,
    "latitude": 13.735640, 
    "longitude": 100.532950
  },
  {
    "id": "25:0e:40:72:59:f3",
    "name": "Department of Environmental Engneering",
    "image": "" ,
    "latitude": 13.735601, 
    "longitude": 100.532540
  },
  {
    "id": "9e:0c:c7:48:e3:c4",
    "name": "ATM กสิกรไทย ตึกวิศวกรรมศาสตร์ 3 ",
    "image": "" ,
    "latitude":13.736926, 
    "longitude": 100.532864
  },
  {
    "id": "74:ca:b7:d5:b4:0c",
    "name": "พื้นที่สูบบุหรี่ บริเวณหน้าตึก 100 ปี",
    "image": "" ,
    "latitude": 13.736574, 
    "longitude": 100.534149
  },
  {
    "id": "ec:e0:87:2c:86:e2",
    "name": "ตึก 100 ปี วิศวกรรมศาสตร์ ชั้น 1",
    "image": "" ,
    "latitude": 13.736389, 
    "longitude": 100.533822
  },
  {
    "id": "44:c5:d7:9b:e4:30",
    "name": "ตึกวิศวกรรมศาสตร์ 2",
    "image": "" ,
    "latitude": 13.736478, 
    "longitude": 100.533386
  },
  {
    "id": "b5:8a:48:2a:c4:52",
    "name": "ตึกวิศวกรรมศาสตร์ 1",
    "image": "" ,
    "latitude": 13.736587, 
    "longitude": 100.532630
  }
]

"""
station = json.loads(station, encoding='thai')

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
        is_send = np.random.choice([1, 2], p=[0.9, 0.1]) % 2 == 1
        if is_send:
            n_devices = np.random.randint(0, max_devices)
            n_devices = np.random.choice([0, n_devices])
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
