import unittest
import mimetypes
import requests
from requests.auth import HTTPBasicAuth
import http.client


token = requests.get('http://dno-dev.acndevopsengineering.com/umg/auth' , auth = ('admin@dnops.com', 'Admin@123'),verify=False).json()['token']

class testUser(unittest.TestCase):

    def test1_1roleCreation(self):
        #correct values
        url = "http://dno-dev.acndevopsengineering.com/umg/roles"
        payload = "{\"role\": \"testrolek\",\"write\": [\"Test\"],\"read\":[\"Test\"]}"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        response = requests.request("POST", url, headers=headers, data = payload,verify=False)
        print(response.text)
        self.assertEqual(response.status_code, 200)

        payload1= "{\"role\": \"testrolev\",\"write\": [\"Test\"],\"read\":[\"Test\"]}"
        requests.request("POST", url, headers=headers, data = payload1)

    def test1_2roleCreation(self):
        #special characters
        url = "http://dno-dev.acndevopsengineering.com/umg/roles"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload2= "{\"role\": \"*&*&^%*^$%%^$\",\"write\": [\"Test\"],\"read\":[\"Test\"]}"
        response2 = requests.request("POST", url, headers=headers, data = payload2,verify=False)
        self.assertEqual(response2.status_code, 422)

    def test1_3roleCreation(self):
        #empty string
        url = "http://dno-dev.acndevopsengineering.com/umg/roles"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload3= "{\"role\": \" \",\"write\": [\"Test\"],\"read\":[\"Test\"]}"
        response3 = requests.request("POST", url, headers=headers, data = payload3,verify=False)
        self.assertEqual(response3.status_code, 422)

    def test1_4roleCreation(self):
        #duplicate value
        url = "http://dno-dev.acndevopsengineering.com/umg/roles"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload4= "{\"role\": \"testrolek \",\"write\": [\"Test\"],\"read\":[\"Test\"]}"
        response4 = requests.request("POST", url, headers=headers, data = payload4,verify=False)
        self.assertEqual(response4.status_code, 500)

    def test1_5roleCreation(self):
        #First Character is in uppercase
        url = "http://dno-dev.acndevopsengineering.com/umg/roles"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload5= "{\"role\": \"Testrolek \",\"write\": [\"Test\"],\"read\":[\"Test\"]}"
        response5 = requests.request("POST", url, headers=headers, data = payload5,verify=False)
        self.assertEqual(response5.status_code, 500)


    def test2_userCreation(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users"
        # correct values
        payload = "  {\"email\": \"kirti12345@gmail.com\",\"name\": \"Lucy\",\"password\": \"Abcnc@1234\",\"roles\": [\"testrolek\"]} "
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        response = requests.request("POST", url, headers=headers, data = payload,verify=False)
        self.assertEqual(response.status_code, 200)

    def test2_2userCreation(self):
        # duplicate name
        url = "http://dno-dev.acndevopsengineering.com/umg/users"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload1 = "  {\"email\": \"testing234@gmail.com\",\"name\": \"lucy11\",\"password\": \"Abc@1234\",\"roles\": [\"admin\"]} "
        response1 = requests.request("POST", url, headers=headers, data = payload1,verify=False)
        self.assertEqual(response1.status_code, 500) 

    def test2_3userCreation(self):   
        # wrong pwd
        url = "http://dno-dev.acndevopsengineering.com/umg/users"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload2 = "  {\"email\": \"gitam123@gmail.com\",\"name\": \"luciana\",\"password\": \"A34\",\"roles\": [\"admin\"]} "
        response2 = requests.request("POST", url, headers=headers, data = payload2,verify=False)
        self.assertEqual(response2.status_code, 417)

    def test2_4userCreation(self):
        # wrong email
        url = "http://dno-dev.acndevopsengineering.com/umg/users"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload3 = "  {\"email\": \"gitam.com\",\"name\": \"luciana\",\"password\": \"Abclp@123\",\"roles\": [\"admin\"]} "
        response3 = requests.request("POST", url, headers=headers, data = payload3,verify=False)
        self.assertEqual(response3.status_code, 500)

    def test2_5userCreation(self):
        # no role given
        url = "http://dno-dev.acndevopsengineering.com/umg/users"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload4 = "  {\"email\": \"testing123@gmail.com\",\"name\": \"lucy\",\"password\": \"Abc@1234\",\"roles\": [\"\"]} "
        response4 = requests.request("POST", url, headers=headers, data = payload4,verify=False)
        self.assertEqual(response4.status_code, 500) 
    
    def test2_6userCreation(self):
        # null email
        url = "http://dno-dev.acndevopsengineering.com/umg/users"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload5 = "  {\"email\": \"\",\"name\": \"luciana\",\"password\": \"Abc@1234\",\"roles\": [\"admin\"]} "
        response5 = requests.request("POST", url, headers=headers, data = payload5,verify=False)
        self.assertEqual(response5.status_code, 500)
    
    def test2_7userCreation(self):
        #null name
        url = "http://dno-dev.acndevopsengineering.com/umg/users"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload6 = "  {\"email\": \"testing234@gmail.com\",\"name\": \"\",\"password\": \"Abc@1234\",\"roles\": [\"admin\"]} "
        response6 = requests.request("POST", url, headers=headers, data = payload6,verify=False)
        self.assertEqual(response6.status_code, 500)

    def test2_8userCreation(self):  
        #null password
        url = "http://dno-dev.acndevopsengineering.com/umg/users"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload5 = "  {\"email\": \"\",\"name\": \"luciana\",\"password\": \"\",\"roles\": [\"admin\"]} "
        response5 = requests.request("POST", url, headers=headers, data = payload5,verify=False)
        self.assertEqual(response5.status_code, 417) 

    def test3_updatePwd(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users?action=3"
        payload = "{\"email\": \"kirti12345@gmail.com\", \"password\": \"Bunny@1234\"}"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        response = requests.request("PUT", url, headers=headers, data = payload,verify=False)
        self.assertEqual(response.status_code, 200)
        responsek = requests.get('http://dno-dev.acndevopsengineering.com/umg/auth', auth = ('kirti12345@gmail.com', 'Bunny@1234'))
        self.assertEqual(responsek.status_code, 200)

    def test3_1updatePwd(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users?action=3"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload1 = "{ \"email\": \"kirti12345@gmail.com\",\r\n   \"password\": \"\" }"
        response1 = requests.request("PUT", url, headers=headers, data = payload1,verify=False)
        self.assertEqual(response1.status_code, 417)

    def test3_2updatePwd(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users?action=3"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload2 = "{\"email\": \"kirti12345.com\",\r\n   \"password\": \"Sunny@123\" }"
        response2 = requests.request("PUT", url, headers=headers, data = payload2,verify=False)
        self.assertEqual(response2.status_code, 500)

    def test3_3updatePwd(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users?action=3"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload3 = "{\"email\": \"dev1@dnops.com\",\r\n   \"password\": \"test@123\"}"
        response3 = requests.request("PUT", url, headers=headers, data = payload3,verify=False)
        self.assertEqual(response3.status_code, 417)

    def test3_4updatePwd(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users?action=3"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload4 = "{\"email\": \"dev1dnops.com\",\r\n   \"password\": \"Sunny@123\"}"
        response4 = requests.request("PUT", url, headers=headers, data = payload4,verify=False)
        self.assertEqual(response4.status_code, 500)

    def test3_5updatePwd(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users?action=3"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload5 = "{\"email\": \"\",\r\n   \"password\": \"Sunny@123\"  }"
        response5 = requests.request("PUT", url, headers=headers, data = payload5,verify=False)
        self.assertEqual(response5.status_code, 500)
       


    def test4_addRole(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users?action=1"
        payload = "{\"email\": \"kirti12345@gmail.com\",\r\n   \"roles\": [\"testrolev\"]  }"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        response = requests.request("PUT", url, headers=headers, data = payload,verify=False)
        self.assertEqual(response.status_code, 200)
    
    def test4_2addRole(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users?action=1"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload1 = "{ \"email\": \"gitam123@gmail.com\", \"roles\": [\"\"]  }"
        response1 = requests.request("PUT", url, headers=headers, data = payload1,verify=False)
        self.assertEqual(response1.status_code, 500)
    
    def test4_3addRole(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users?action=1"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload2 = "{\r\n   \"email\": \"gitam123@testcom\",\r\n   \"roles\": [\"admin\"]  }\r\n\r\n\r\n"
        response2 = requests.request("PUT", url, headers=headers, data = payload2,verify=False)
        self.assertEqual(response2.status_code, 500)

    def test5_removeRole(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users?action=2"
        payload = "{  \"email\": \"kirti12345@gmail.com\", \"roles\": [\"testrolev\"]  }"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        response = requests.request("PUT", url, headers=headers, data = payload,verify=False)
        self.assertEqual(response.status_code, 200)
    
    def test5_2removeRole(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users?action=2"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload1 = "{\"email\": \"gitam123@gmail.com\",\r\n   \"roles\": [\"\"]  }"
        response1 = requests.request("PUT", url, headers=headers, data = payload1,verify=False)
        self.assertEqual(response1.status_code, 500)

    def test5_3removeRole(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users?action=2"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload2 = "{\"email\": \"gitam123@gmail.com\",\r\n   \"roles\": [\"tester\"]  }"
        response2 = requests.request("PUT", url, headers=headers, data = payload2,verify=False)
        self.assertEqual(response2.status_code, 500)

    def test5_4removeRole(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users?action=2"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload3 = "{\"email\": \"gitam123@k.com\",\r\n   \"roles\": [\"\"]  }"
        response3 = requests.request("PUT", url, headers=headers, data = payload3,verify=False)
        self.assertEqual(response3.status_code, 500)

    def test6_1createService(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/service"
        payload = "{\"name\": \"support\"}"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        response = requests.request("POST", url, headers=headers, data = payload,verify=False)
        self.assertEqual(response.status_code, 200)

    def test6_2createService(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/service"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload1 = "{\"name\": \"support\"}"
        response1 = requests.request("POST", url, headers=headers, data = payload1,verify=False)
        self.assertEqual(response1.status_code, 500)

    def test6_3createService(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/service"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload2 = "{\"name\": \"\"}"
        response2 = requests.request("POST", url, headers=headers, data = payload2,verify=False)
        self.assertEqual(response2.status_code, 422)

    def test6_4createService(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/service"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload3 = "{\"name\": \"&%&%^@@\"}"
        response3 = requests.request("POST", url, headers=headers, data = payload3,verify=False)
        self.assertEqual(response3.status_code, 422)

    def test7_addServiceToRole(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/roles?action=1"
        payload = "{\"role\": \"testrolev\",\"write\": [\"Test\"],\"read\":[\"Test\"]}"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        response = requests.request("PUT", url, headers=headers, data = payload,verify=False)
        self.assertEqual(response.status_code, 200)

    def test7_2addServiceToRole(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/roles?action=1"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload1 = "{\"role\": \"devops\",\"write\": [\"Test\"],\"read\":[\"Test\"]}"
        response1 = requests.request("PUT", url, headers=headers, data = payload1,verify=False)
        self.assertEqual(response1.status_code, 500)

    def test7_3addServiceToRole(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/roles?action=1"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload2 = "{\"role\": \"\",\"write\": [\"Test\"],\"read\":[\"Test\"]}\r\n\r\n"
        response2 = requests.request("PUT", url, headers=headers, data = payload2,verify=False)
        self.assertEqual(response2.status_code, 500)


    def test8_1removeServiceFromRole(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/roles?action=2"
        payload = "{\"role\": \"testrolev\",\"write\": [\"Test\"],\"read\":[\"Test\"]}\r\n\r\n"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        response = requests.request("PUT", url, headers=headers, data = payload,verify=False)
        self.assertEqual(response.status_code, 200)

    def test8_2removeServiceFromRole(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/roles?action=2"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload1 = "{\"role\": \"tester\",\"write\": [\"Test\"],\"read\":[\"Test\"]}\r\n\r\n"
        response1 = requests.request("PUT", url, headers=headers, data = payload1,verify=False)
        self.assertEqual(response1.status_code, 500)

    def test8_3removeServiceFromRole(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/roles?action=2"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload2 = "{\"role\": \"\",\"write\": [\"Test\"],\"read\":[\"Test\"]}\r\n\r\n"
        response2 = requests.request("PUT", url, headers=headers, data = payload2,verify=False)
        self.assertEqual(response2.status_code, 500)

    def test8_4removeServiceFromRole(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/roles?action=2"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload3 = "{\"role\": \"lalala\",\"write\": [\"Test\"],\"read\":[\"Test\"]}\r\n\r\n"
        response3 = requests.request("PUT", url, headers=headers, data = payload3,verify=False)
        self.assertEqual(response3.status_code, 500)

    def test_u_1deleteService(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/service"
        payload = "{\"name\": \"support\"}"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        response = requests.request("DELETE", url, headers=headers, data = payload ,verify=False)
        self.assertEqual(response.status_code, 200)

    def test_u_2deleteService(self):

        url = "http://dno-dev.acndevopsengineering.com/umg/service"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload3 = "{\"name\": \"support\"}"
        response3 = requests.request("DELETE", url, headers=headers, data = payload3,verify=False)
        self.assertEqual(response3.status_code, 412)

        #For already deleted service name 
    def test_u_3deleteService(self):

        url = "http://dno-dev.acndevopsengineering.com/umg/service"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload1 = "{\"name\": \"java\"}"    
        response1 = requests.request("DELETE", url, headers=headers, data = payload1 ,verify=False)
        self.assertEqual(response1.status_code, 412)

    def test_u_4deleteService(self):
        #Null value as service name for deletion - "200 OK - 500"
        url = "http://dno-dev.acndevopsengineering.com/umg/service"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}       
        payload2 = "{\"name\": \"\"}"
        response2 = requests.request("POST", url, headers=headers, data = payload2 ,verify=False)		
        self.assertEqual(response2.status_code, 422)

    def test_y_deleteRole(self):

        #valid inputs
        url = "http://dno-dev.acndevopsengineering.com/umg/roles"
        payload = "{\"role\": \"testrolek\"}"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        response = requests.request("DELETE", url, headers=headers, data = payload,verify=False)
        self.assertEqual(response.status_code, 200)

    def test_y_2deleteRole(self):

        url = "http://dno-dev.acndevopsengineering.com/umg/roles"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload4 = "{\r\n\t\"role\": \"testrolev\"\r\n}"
        requests.request("DELETE", url, headers=headers, data = payload4,verify=False)

    def test_y_3deleteRole(self):
        
        url = "http://dno-dev.acndevopsengineering.com/umg/roles"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        #non-existant value
        payload3 = "{\r\n\t\"role\": \"devNetops\"\r\n}"
        response3 = requests.request("DELETE", url, headers=headers, data = payload3,verify=False)
        self.assertEqual(response3.status_code,500)

    def test_y_4deleteRole(self):
        
        url = "http://dno-dev.acndevopsengineering.com/umg/roles"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        #null value
        payload1 = "{\r\n\t\"role\": \"\"\r\n}"
        response1 = requests.request("DELETE", url, headers=headers, data = payload1,verify=False)
        self.assertEqual(response1.status_code, 422)

    def test_y_5deleteRole(self):
        
        url = "http://dno-dev.acndevopsengineering.com/umg/roles"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        #valid value with invalid syntax
        payload2 = "{\r\n\t\"role\": \"Admin\"\r\n}"
        response2 = requests.request("DELETE", url, headers=headers, data = payload2,verify=False)
        self.assertEqual(response2.status_code, 412)


    def test_x_1deleteUser(self):
        #valid inputs
        url = "http://dno-dev.acndevopsengineering.com/umg/users"
        payload = "{\"email\": \"kirti12345@gmail.com\" }"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        response = requests.request("DELETE", url, headers=headers, data = payload,verify=False)
        self.assertEqual(response.status_code, 200)

    def test_x_2deleteUser(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        payload = "{\"email\": \"kirti12345@gmail.com\" }"

        #duplicate UserId
        response1 = requests.request("DELETE", url, headers=headers, data = payload,verify=False)
        self.assertEqual(response1.status_code, 500)

    def test_x_3deleteUser(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        #invalid email
        payload1 = "{\r\n   \"email\": \"gitam12.com\" }\r\n\r\n\r\n"
        response1 = requests.request("DELETE", url, headers=headers, data = payload1,verify=False)
        self.assertEqual(response1.status_code, 500)

    def test_x_4deleteUser(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users"
        headers = {"Authorization": "Bearer {}".format(token),'Content-Type': 'application/json'}
        #null value for email
        payload2 = "{\r\n   \"email\": \"\" }\r\n\r\n\r\n"
        response2 = requests.request("DELETE", url, headers=headers, data = payload2,verify=False)
        self.assertEqual(response2.status_code, 422)  

    def test_y_userList(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/users"
        headers = {"Authorization": "Bearer {}".format(token)}
        response = requests.request("GET", url, headers=headers ,verify=False)
        self.assertEqual(response.status_code, 200)


    def test_z_getRolesList(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/roles"
        headers = {"Authorization": "Bearer {}".format(token)}
        response = requests.request("GET", url, headers=headers ,verify=False)
        self.assertEqual(response.status_code, 200)

    def test_zz_serviceList(self):
        url = "http://dno-dev.acndevopsengineering.com/umg/service"
        headers = {"Authorization": "Bearer {}".format(token)}
        response = requests.request("GET", url, headers=headers ,verify=False) 
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':

    unittest.main() 
