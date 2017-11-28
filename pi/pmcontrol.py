import os
import netifaces
import time
import paho.mqtt.publish as publish

THIS_MAC = netifaces.ifaddresses('wlan1')[netifaces.AF_LINK][0]['addr']
WLAN0_MAC = netifaces.ifaddresses('wlan0')[netifaces.AF_LINK][0]['addr']
OUTPUT_FILENAME = "/home/pi/wads-production/wads.log"
Ptx = 20 #dBm
PATH_LOSS_EXP = 2.7
MON_TIME = 29

def calc_range(rssi):
    return ((10 ** ((Ptx - rssi)/(10 * PATH_LOSS_EXP)))/100)

os.system("sudo ifconfig wlan1 down")
os.system("sudo iwconfig wlan1 mode monitor")
os.system("sudo ifconfig wlan1 up")

while True:
    os.system("sudo python /home/pi/wads-production/probemon.py -i wlan1 -l -s -r -f -d '|' -o " + OUTPUT_FILENAME + "& sleep "+ str(MON_TIME) +"; sudo killall python");
    json_string = '{"fromRaspId":"' + THIS_MAC + '","devices":['
    macList = dict()

    with open(OUTPUT_FILENAME) as f:
        for line in f:
            res = line.split('|')
            #res[1] = mac_addr, res[-1] = rssi
            if(res[1] == WLAN0_MAC):
                continue
            if(res[1] not in macList):
                macList[res[1]] = calc_range(int(res[-1]))
            if(macList[res[1]] > calc_range(int(res[-1]))):
                macList[res[1]] = calc_range(int(res[-1]))
            #print(res[1],res[-1])
        f.close()

    for mac in macList:
        json_string = json_string + '{"id":"' + str(mac) + '","distance":"' + str(macList[mac]) + '"},'

    json_string = json_string + ']}'
    print(json_string)
    os.system("sudo rm -f " + OUTPUT_FILENAME)
    
    #remove last ","
    k = json_string.rfind(",")
    json_string_to_send = json_string[:k] + json_string[k+1:]

    #MQTT
    publish.single("wads/project/demo", json_string_to_send, hostname="35.198.193.141",port=28104)


'''
{
    "from_rasp_id":"MAC",
    "devices":[
        {
            "id":"MAC",
            "distance":"d"
        },
        {
            "id":"MAC",
            "distance":"d"
        }
    ]
}
'''
