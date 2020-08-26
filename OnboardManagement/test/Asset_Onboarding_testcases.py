import unittest
import mimetypes
import requests
from requests.auth import HTTPBasicAuth
import http.client

token = requests.get('http://dno-dev.acndevopsengineering.com/umg/auth' , auth = ('admin@dnops.com', 'Admin@123'),verify= False).json()['token']

class testOnBoarding(unittest.TestCase):
   

    def test0_repoCreation(self):
        url = "http://dno-dev.acndevopsengineering.com/onboard/repo" 
        payload = "{\"repo_name\":\"Comcast-Repo\",\"repo_vendor\":\"jfrog\",\"repo_type\":\"local\",\"repo_url\":\"http://44.230.46.6:8081/artifactory/Comcast-Repo\",\"repo_username\":\"jfroguser2\",\"repo_password\":\"jfroguser2\"}"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        response = requests.request("POST", url, headers=headers, data = payload,verify=False)
        print(response.json())
        self.assertEqual(response.status_code, 200)

    def test1_positive_TestCases(self):
        url = "http://dno-dev.acndevopsengineering.com/onboard/asset"
        payload = {'asset_group': 'Director',
        'asset_name': 'AssetNamekirti',
        'asset_type': 'key files',
        'asset_vendor': 'comcast',
        'asset_repository': 'Comcast-Repo',
        'asset_version': '6'}
        files = [
            ('asset_file', open(r'C:\Users\k.melevalayangatt\Desktop\pythoncoding\project\devnetops\UserMgmt\src\config\config.py','rb'))
        ] 
        headers = {"Authorization": "Bearer {}".format(token)}
        response = requests.request("POST", url, headers=headers, data = payload, files = files,verify=False)
        print(response.text)
        self.assertEqual(response.status_code, 200)

        payload1 = {'asset_group': 'Director',
        'asset_name': 'Asset1',
        'asset_type': 'template',
        'asset_vendor': 'comcast',
        'asset_repository': 'Comcast-Repo',
        'asset_version': '4'}
        files = [
            ('asset_file', open(r'C:\Users\k.melevalayangatt\Desktop\pythoncoding\project\devnetops\UserMgmt\src\config\config.py','rb'))
        ] 
        response1 = requests.request("POST", url, headers=headers, data = payload1, files = files,verify=False)
        print(response1.text)
        self.assertEqual(response1.status_code, 200)

        payload2 = {'asset_group': 'Director',
        'asset_name': 'Asset#!@@',
        'asset_type': 'template',
        'asset_vendor': 'comcast',
        'asset_repository': 'Comcast-Repo',
        'asset_version': '4'}
        files = [
            ('asset_file', open(r'C:\Users\k.melevalayangatt\Desktop\pythoncoding\project\devnetops\UserMgmt\src\config\config.py','rb'))
        ] 
        response2 = requests.request("POST", url, headers=headers, data = payload2, files = files,verify=False)
        print(response2.text)
        self.assertEqual(response2.status_code, 422)

        payload3 = {'asset_group': 'Director',
        'asset_name': 'Asset-123',
        'asset_type': 'vnfd',
        'asset_vendor': 'comcast',
        'asset_repository': 'Comcast-Repo',
        'asset_version': '4'}
        files = [
            ('asset_file', open(r'C:\Users\k.melevalayangatt\Desktop\pythoncoding\project\devnetops\UserMgmt\src\config\config.py','rb'))
        ] 
        response3 = requests.request("POST", url, headers=headers, data = payload3, files = files,verify=False)
        print(response3.text)
        self.assertEqual(response3.status_code, 200)

        payload4 = {'asset_group': 'Director',
        'asset_name': 'Asset_name',
        'asset_type': 'qcow',
        'asset_vendor': 'comcast',
        'asset_repository': 'Comcast-Repo',
        'asset_version': '4'}
        files = [
            ('asset_file', open(r'C:\Users\k.melevalayangatt\Desktop\pythoncoding\project\devnetops\UserMgmt\src\config\config.py','rb'))
        ] 
        response4 = requests.request("POST", url, headers=headers, data = payload4, files = files,verify=False)
        print(response4.text)
        self.assertEqual(response4.status_code, 200)

        payload5 = {'asset_group': 'Director',
        'asset_name': 'AssetNamekirti',
        'asset_type': 'key files',
        'asset_vendor': 'comcast',
        'asset_repository': 'Comcast-Repo',
        'asset_version': '6'}
        files = [
            ('asset_file', open(r'C:\Users\k.melevalayangatt\Desktop\pythoncoding\project\devnetops\UserMgmt\src\config\config.py','rb'))
        ] 
        response5 = requests.request("POST", url, headers=headers, data = payload5, files = files,verify=False)
        print(response5.text)
        self.assertEqual(response5.status_code, 500)

    def test2_negative_cases(self):

        #wrong name
        url = "http://dno-dev.acndevopsengineering.com/onboard/asset"
        payload = {'asset_group': 'Director',
        'asset_name': '%&^(*^',
        'asset_type': 'key files',
        'asset_vendor': 'comcast',
        'asset_repository': 'Comcast-Repo',
        'asset_version': '4'}
        files = [
            ('asset_file', open(r'C:\Users\k.melevalayangatt\Desktop\pythoncoding\project\devnetops\UserMgmt\src\config\config.py','rb'))
        ] 
        headers = {"Authorization": "Bearer {}".format(token)}
        response = requests.request("POST", url, headers=headers, data = payload, files = files,verify=False)
        print(response.text)
        self.assertEqual(response.status_code, 422)

        #wrong type
        url = "http://dno-dev.acndevopsengineering.com/onboard/asset"
        payload1 = {'asset_group': 'Director',
        'asset_name': 'AssetName',
        'asset_type': '',
        'asset_vendor': 'comcast',
        'asset_repository': 'Comcast-Repo',
        'asset_version': '4'}
        files = [
            ('asset_file', open(r'C:\Users\k.melevalayangatt\Desktop\pythoncoding\project\devnetops\UserMgmt\src\config\config.py','rb'))
        ] 
        headers = {"Authorization": "Bearer {}".format(token)}
        response1 = requests.request("POST", url, headers=headers, data = payload1, files = files,verify=False)
        print(response1.text)
        self.assertEqual(response1.status_code, 400)

        #wrong vendor
        url = "http://dno-dev.acndevopsengineering.com/onboard/asset"
        payload2 = {'asset_group': 'Director',
        'asset_name': 'AssetName',
        'asset_type': 'key files',
        'asset_vendor': '#$(@#&(*',
        'asset_repository': 'Comcast-Repo',
        'asset_version': '4'}
        files = [
            ('asset_file', open(r'C:\Users\k.melevalayangatt\Desktop\pythoncoding\project\devnetops\UserMgmt\src\config\config.py','rb'))
        ] 
        headers = {"Authorization": "Bearer {}".format(token)}
        response2 = requests.request("POST", url, headers=headers, data = payload2, files = files,verify=False)
        print(response2.text)
        self.assertEqual(response2.status_code, 500)

        #wrong repo
        url = "http://dno-dev.acndevopsengineering.com/onboard/asset"
        payload3 = {'asset_group': 'Director',
        'asset_name': 'AssetName',
        'asset_type': 'key files',
        'asset_vendor': 'comcast',
        'asset_repository': 'kirti',
        'asset_version': '4'}
        files = [
            ('asset_file', open(r'C:\Users\k.melevalayangatt\Desktop\pythoncoding\project\devnetops\UserMgmt\src\config\config.py','rb'))
        ] 
        headers = {"Authorization": "Bearer {}".format(token)}
        response3 = requests.request("POST", url, headers=headers, data = payload3, files = files,verify=False)
        print(response3.text)
        self.assertEqual(response3.status_code, 500)

    def test3_gettingList(self):
        url = "http://dno-dev.acndevopsengineering.com/onboard/asset"
        headers = {"Authorization": "Bearer {}".format(token)}
        response = requests.request("GET", url, headers=headers,verify=False)
        self.assertEqual(response.status_code, 200) 

    def test4_CleanUp(self):
        url = "http://dno-dev.acndevopsengineering.com/onboard/asset"       
        payload = {'asset_group': 'Director',
        'asset_name': 'AssetNamekirti',
        'asset_type': 'key files',
        'asset_vendor': 'comcast',
        'asset_version': '6.00'}
        headers = {"Authorization": "Bearer {}".format(token)}
        response = requests.request("GET", url, headers=headers,verify=False)

        for d in response.json():
            if all(i in d.items() for i in payload.items()):
                id = d['asset_id']   
        payload1 = {'asset_id': id}
        response1 = requests.request("DELETE", url, headers=headers, data = payload1,verify = False) 
        print(response1.text)       
        self.assertEqual(response1.status_code, 200)
  

    def test5_deleteRepo(self):

        url = "http://dno-dev.acndevopsengineering.com/onboard/repo"
        payload = "{\"repo_name\":\"Comcast-Repo\",\"delete_assets\" : \"True\"}"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        response = requests.request("DELETE", url, headers=headers, data = payload,verify=False)
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()


