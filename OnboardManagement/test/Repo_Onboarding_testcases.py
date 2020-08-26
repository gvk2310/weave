import unittest
import mimetypes
import requests
from requests.auth import HTTPBasicAuth
import http.client


token = requests.get('http://dno-dev.acndevopsengineering.com/umg/auth' , auth = ('admin@dnops.com', 'Admin@123')).json()['token']

class testOnBoarding(unittest.TestCase):

    def test1_repoCreation(self):
        url = "http://dno-dev.acndevopsengineering.com/onboard/repo"
        payload = "{\"repo_name\":\"telefonica\",\"repo_vendor\":\"jfrog\",\"repo_type\":\"local\",\"repo_url\":\"http://44.230.46.6:8081/artifactory/Telefonica\",\"repo_username\":\"telefonica\",\"repo_password\":\"telefonica123\"}"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        response = requests.request("POST", url, headers=headers, data = payload)
        self.assertEqual(response.status_code, 200)

        #Wrong password
        payload1 = "{\"repo_name\":\"Comcast-local55\",\"repo_vendor\":\"jfrog\",\"repo_type\":\"local\",\"repo_url\":\"http://44.230.46.6:8081/artifactory/Telefonica\",\"repo_username\":\"telefonica\",\"repo_password\":\"jfrog\"}"
        response1 = requests.request("POST", url, headers=headers, data = payload1)
        self.assertEqual(response1.status_code, 500)

        #invalid repo name - Special charaters
        payload2 = "{\"repo_name\":\"!@ #$%^&&**\", \"repo_vendor\":\"jfrog\", \"repo_type\":\"local\",\"repo_url\":\"http://44.230.46.6:8081/artifactory/Telefonica\",\"repo_username\":\"telefonica\", \"repo_password\":\"telefonica123\"}"
        response2 = requests.request("POST", url, headers=headers, data = payload2)
        self.assertEqual(response2.status_code, 422)

        #Repo name = Null
        payload3 = "{\"repo_name\":\" \", \"repo_vendor\":\"jfrog\", \"repo_type\":\"local\",\"repo_url\":\"http://44.230.46.6:8081/artifactory/Telefonica\",\"repo_username\":\"telefonica\", \"repo_password\":\"telefonica123\"}"
        response3 = requests.request("POST", url, headers=headers, data = payload3)
        self.assertEqual(response3.status_code, 400)

        #Repo vendor = Null
        payload4 = "{\"repo_name\":\" \", \"repo_vendor\":\" \", \"repo_type\":\"local\",\"repo_url\":\"http://44.230.46.6:8081/artifactory/Telefonica\",\"repo_username\":\"telefonica\", \"repo_password\":\"telefonica123\"}"
        response4 = requests.request("POST", url, headers=headers, data = payload4)
        self.assertEqual(response4.status_code, 400)

        #Repo url = Null
        payload5 = "{\"repo_name\":\" \", \"repo_vendor\":\" \", \"repo_type\":\"local\",\"repo_url\":\" \",\"repo_username\":\"telefonica\", \"repo_password\":\"telefonica123\"}"
        response5 = requests.request("POST", url, headers=headers, data = payload5)
        self.assertEqual(response5.status_code, 400)

        #Repo Username = Null
        payload6 = "{\"repo_name\":\" \", \"repo_vendor\":\" \", \"repo_type\":\"local\",\"repo_url\":\"http://44.230.46.6:8081/artifactory/Telefonica\",\"repo_username\" : \" \", \"repo_password\":\"telefonica123\"}"
        response6 = requests.request("POST", url, headers=headers, data = payload6)
        self.assertEqual(response6.status_code, 400)

        #Repo password = Null
        payload7 = "{\"repo_name\":\" \", \"repo_vendor\":\" \", \"repo_type\":\"local\",\"repo_url\":\"http://44.230.46.6:8081/artifactory/Telefonica\",\"repo_username\":\"telefonica\", \"repo_password\":\" \"}"
        response7 = requests.request("POST", url, headers=headers, data = payload7)
        self.assertEqual(response7.status_code, 400)

        #Wrong Repo username
        payload8 = "{\"repo_name\":\" \", \"repo_vendor\":\" \", \"repo_type\":\"local\",\"repo_url\":\"http://44.230.46.6:8081/artifactory/Telefonica\",\"repo_username\":\"telefonica\", \"repo_password\":\"telefonica123\"}"
        response8 = requests.request("POST", url, headers=headers, data = payload8)
        self.assertEqual(response8.status_code, 400)

        #Wrong Repo url
        payload9 = "{\"repo_name\":\" \", \"repo_vendor\":\" \", \"repo_type\":\"local\",\"repo_url\":\"http://44.230.46.6:8081/artifactory/Telefonica-repo\",\"repo_username\":\"telefonica\", \"repo_password\":\"telefonica123\"}"
        response9 = requests.request("POST", url, headers=headers, data = payload9)
        self.assertEqual(response9.status_code, 400)

        #Wrong Repo type
        payload10 = "{\"repo_name\":\"Comcast-local55\",\"repo_vendor\":\"jfrog\",\"repo_type\":\"virtual\",\"repo_url\":\"http://44.230.46.6:8081/artifactory/Telefonica\",\"repo_username\":\"telefonica\",\"repo_password\":\"telefonica123\"}"
        response10 = requests.request("POST", url, headers=headers, data = payload10)
        self.assertEqual(response10.status_code, 400)

        #Wrong Repo vendor
        payload11 = "{\"repo_name\":\"Comcast-local55\",\"repo_vendor\":\"JFROG\",\"repo_type\":\"local\",\"repo_url\":\"http://44.230.46.6:8081/artifactory/Telefonica\",\"repo_username\":\"telefonica\",\"repo_password\":\"telefonica123\"}"
        response11 = requests.request("POST", url, headers=headers, data = payload11)
        self.assertEqual(response11.status_code, 400)

        #Wrong Repo Name
        payload12 = "{\"repo_name\":\"COMCAST-TEST\",\"repo_vendor\":\"jfrog\",\"repo_type\":\"local\",\"repo_url\":\"http://44.230.46.6:8081/artifactory/Telefonica\",\"repo_username\":\"telefonica\",\"repo_password\":\"telefonica123\"}"
        response12 = requests.request("POST", url, headers=headers, data = payload12)
        self.assertEqual(response12.status_code, 400)

        #Duplicate Repo Name
        payload13 = "{\"repo_name\":\"telefonica\",\"repo_vendor\":\"jfrog\",\"repo_type\":\"local\",\"repo_url\":\"http://44.230.46.6:8081/artifactory/Telefonica\",\"repo_username\":\"telefonica\",\"repo_password\":\"telefonica123\"}"
        response13 = requests.request("POST", url, headers=headers, data = payload13)
        print(response13.text)
        self.assertEqual(response13.status_code, 400)
        
        #repo type = special char
        payload14 = "{\"repo_name\":\"$#@$&@#(\",\"repo_vendor\":\"jfrog\",\"repo_type\":\"#@#@*&\",\"repo_url\":\"http://44.230.46.6:8081/artifactory/Telefonica\",\"repo_username\":\"telefonica\",\"repo_password\":\"telefonica123\"}"
        response14 = requests.request("POST", url, headers=headers, data = payload14)
        self.assertEqual(response14.status_code, 400)


        #Fetch Repo details
    def test2_getRepodetails(self):
        url = "http://dno-dev.acndevopsengineering.com/onboard/repo"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        response = requests.request("GET", url, headers=headers)
        #print(response.text)
        self.assertEqual(response.status_code, 200)

        #Delete Repo
    def test3_deleteRepo(self):
        url = "http://dno-dev.acndevopsengineering.com/onboard/repo"
        payload = "{\"repo_name\":\"telefonica\",\"delete_assets\" : \"True\"}"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        response = requests.request("DELETE", url, headers=headers, data = payload)
        self.assertEqual(response.status_code, 200)

        #Invalid RepoName
        payload1 = "{\"repo_name\":\"Comcast#$%\",\"delete_assets\" : \"True\"}"
        response1 = requests.request("DELETE", url, headers=headers, data = payload1)
        self.assertEqual(response1.status_code, 404)

        #Repo Name = Null
        payload2 = "{\"repo_name\":\" \"}"
        response2 = requests.request("DELETE", url, headers=headers, data = payload2)
        self.assertEqual(response2.status_code, 400)

        #Wrong Repo Name
        payload3 = "{\"repo_name\":\"comcast-l\",\"delete_assets\" : \"True\"}"
        response3 = requests.request("DELETE", url, headers=headers, data = payload3)
        self.assertEqual(response3.status_code, 404)

        payload4 = "{\"repo_name\":\"Comcast-1\",\"delete_assets\" : \"False\"}"
        response4 = requests.request("DELETE", url, headers=headers, data = payload4)
        self.assertEqual(response4.status_code, 404)

    
if __name__ == '__main__':

    unittest.main()
