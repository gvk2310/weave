import unittest
import mimetypes
import requests
from requests.auth import HTTPBasicAuth
import http.client

token = requests.get('http://dno-dev.acndevopsengineering.com/umg/auth' , auth = ('admin@dnops.com', 'Admin@123')).json()['token']

class testInfraOnBoarding(unittest.TestCase):
    #Positive testcases wrt AWS cloud Type
    def test1_infra_Creation(self):
        url = 'http://dno-dev.acndevopsengineering.com/onboard/infra'
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            "infra_name" : "infra1",
            "cloud_type" : "AWS",
            "environment" : "Demo",
            "orchestrator" : "Cloudformation",
            "access_key" : "AKIA4QX7SK3EERNJCOPS",
            "secret_key" : "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"
            }
        #headers = {"Authorization": "Bearer {}".format(token)}
        #print(url, payload, headers)
        response = requests.request("POST", url, headers=headers, data = payload)
        print(response.text)
        self.assertEqual(response.status_code, 200)

        payload1 = {
            "infra_name" : "infra2",
            "cloud_type" : "AWS",
            "environment" : "Development",
            "orchestrator" : "Cloudformation",
            "access_key" : "AKIA4QX7SK3EERNJCOPS",
            "secret_key" : "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"
            }
        response1 = requests.request("POST", url, headers=headers, data = payload1)
        print(response1.text)
        self.assertEqual(response1.status_code, 200)


        payload2 = {
            "infra_name" : "infra3",
            "cloud_type" : "AWS",
            "environment" : "Stage",
            "orchestrator" : "Cloudformation",
            "access_key" : "AKIA4QX7SK3EERNJCOPS",
            "secret_key" : "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"
            }
        response2 = requests.request("POST", url, headers=headers, data = payload2)
        print(response2.text)
        self.assertEqual(response2.status_code, 200)

        payload3 = {
            "infra_name" : "infra4",
            "cloud_type" : "AWS",
            "environment" : "Test",
            "orchestrator" : "Cloudformation",
            "access_key" : "AKIA4QX7SK3EERNJCOPS",
            "secret_key" : "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"
            }
        response3 = requests.request("POST", url, headers=headers, data = payload3)
        print(response3.text)
        self.assertEqual(response3.status_code, 200)

        payload4 = {
            "infra_name" : "infra5",
            "cloud_type" : "AWS",
            "environment" : "Production",
            "orchestrator" : "Cloudformation",
            "access_key" : "AKIA4QX7SK3EERNJCOPS",
            "secret_key" : "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"
            }
        response4 = requests.request("POST", url, headers=headers, data = payload4)
        print(response4.text)
        self.assertEqual(response4.status_code, 200)

   ########################    Negative Test Cases wrt AWS      ############################
     
        #Null infra name
        payload5 = {
            "infra_name" : "",
            "cloud_type" : "AWS",
            "environment" : "Production",
            "orchestrator" : "Cloudformation",
            "access_key" : "AKIA4QX7SK3EERNJCOPS",
            "secret_key" : "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"
            }
        response5 = requests.request("POST", url, headers=headers, data = payload5)
        print(response5.text)
        self.assertEqual(response5.status_code, 400)

        # Null Cloud Type 
        payload6 = {
            "infra_name" : "CloudNull",
            "cloud_type" : "",
            "environment" : "Production",
            "orchestrator" : "Cloudformation",
            "access_key" : "AKIA4QX7SK3EERNJCOPS",
            "secret_key" : "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"
            }
        response6 = requests.request("POST", url, headers=headers, data = payload6)
        print(response6.text)
        self.assertEqual(response6.status_code, 400)

        # Null environment
        payload7 = {
            "infra_name" : "EnvNull",
            "cloud_type" : "AWS",
            "environment" : "",
            "orchestrator" : "Cloudformation",
            "access_key" : "AKIA4QX7SK3EERNJCOPS",
            "secret_key" : "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"
            }
        response7 = requests.request("POST", url, headers=headers, data = payload7)
        print(response7.text)
        self.assertEqual(response7.status_code, 400)

        # Null orchestrator
        payload8 = {
            "infra_name" : "orchestratorNull",
            "cloud_type" : "AWS",
            "environment" : "Production",
            "orchestrator" : "",
            "access_key" : "AKIA4QX7SK3EERNJCOPS",
            "secret_key" : "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"
            }
        response8 = requests.request("POST", url, headers=headers, data = payload8)
        print(response8.text)
        self.assertEqual(response8.status_code, 400)

        #Null Accesskey
        payload9 = {
            "infra_name" : "accesskeyNull",
            "cloud_type" : "AWS",
            "environment" : "Production",
            "orchestrator" : "Cloudformation",
            "access_key" : "",
            "secret_key" : "sfUOM5Rt7qcLzmNdP5qmRt4zJ56H789GMpGi+cVf"
            }
        response9 = requests.request("POST", url, headers=headers, data = payload9)
        print(response9.text)
        self.assertEqual(response9.status_code, 400)

        #Null secretkey
        payload10 = {
            "infra_name" : "secretkeyNull",
            "cloud_type" : "AWS",
            "environment" : "Production",
            "orchestrator" : "Cloudformation",
            "access_key" : "AKIA4QX7SK3EERNJCOPS",
            "secret_key" : ""
            }
        response10 = requests.request("POST", url, headers=headers, data = payload10)
        print(response10.text)
        self.assertEqual(response10.status_code, 400)

    #     #Wrong Infra Name
        payload11 = {
            "infra_name" : "Navya#$%",
            "cloud_type" : "AWS",
            "environment" : "Production",
            "orchestrator" : "Cloudformation",
            "access_key" : "AKIA4QX7SK3EERNJCOPS",
            "secret_key" : "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"
            }
        response11 = requests.request("POST", url, headers=headers, data = payload11)
        print(response11.text)
        self.assertEqual(response11.status_code, 422)

        #Wrong Cloud type
        payload12 = {
            "infra_name" : "Navya",
            "cloud_type" : "ajbdjha",
            "environment" : "Production",
            "orchestrator" : "Cloudformation",
            "access_key" : "AKIA4QX7SK3EERNJCOPS",
            "secret_key" : "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"
            }
        response12 = requests.request("POST", url, headers=headers, data = payload12)
        print(response12.text)
        self.assertEqual(response12.status_code, 400)

        #Wrong environment 
        payload13 = {
            "infra_name" : "Navya",
            "cloud_type" : "AWS",
            "environment" : "Navya",
            "orchestrator" : "Cloudformation",
            "access_key" : "AKIA4QX7SK3EERNJCOPS",
            "secret_key" : "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"
            }
        response13 = requests.request("POST", url, headers=headers, data = payload13)
        print(response13.text)
        self.assertEqual(response13.status_code, 400)

        #Wrong orchestrator
        payload14 = {
            "infra_name" : "Devnetops",
            "cloud_type" : "AWS",
            "environment" : "Dev",
            "orchestrator" : "hjcshfkhfui",
            "access_key" : "AKIA4QX7SK3EERNJCOPS",
            "secret_key" : "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"
            }
        response14 = requests.request("POST", url, headers=headers, data = payload14)
        print(response14.text)
        self.assertEqual(response14.status_code, 400)

        #Wrong AccessKey
        payload15 = {
            "infra_name" : "Navya",
            "cloud_type" : "AWS",
            "environment" : "Stage",
            "orchestrator" : "Cloudformation",
            "access_key" : "Myaccesskeyjsfjkshf",
            "secret_key" : "sfUOM5Rt7qcLzmNdP5qmRt4zJ56H789GMpGi+cVf"
            }
        response15 = requests.request("POST", url, headers=headers, data = payload15)
        print(response15.text)
        self.assertEqual(response15.status_code, 500)

        ##Wrong Secret Key
        payload16 = {
            "infra_name" : "Devnetops",
            "cloud_type" : "AWS",
            "environment" : "Test",
            "orchestrator" : "Cloudformation",
            "access_key" : "AKIA4QX7SK3EERNJCOPS",
            "secret_key" : "secretkhsgfhgseynsjkhwfhsfj"
            }
        response16 = requests.request("POST", url, headers=headers, data = payload16)
        print(response16.text)
        self.assertEqual(response16.status_code, 500)



     #######################  Positive testcases wrt Openstack Cloud type   ##########################

        payload17 = {
            "infra_name":"infra_openstack1",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Demo",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
            }
        response17 = requests.request("POST", url, headers=headers, data = payload17)
        print(response17.text)
        self.assertEqual(response17.status_code, 200)

        payload18 = {
            "infra_name":"infra_openstack2",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Development",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
            }    
        response18 = requests.request("POST", url, headers=headers, data = payload18)
        print(response18.text)
        self.assertEqual(response18.status_code, 200)

        payload19 = {
            "infra_name":"infra_openstack3",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Stage",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
            }    
        response19 = requests.request("POST", url, headers=headers, data = payload19)
        print(response19.text)
        self.assertEqual(response19.status_code, 200)

        payload20 = {
            "infra_name":"infra_openstack4",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Production",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
            }    
        response20 = requests.request("POST", url, headers=headers, data = payload20)
        print(response20.text)
        self.assertEqual(response20.status_code, 200)

        payload21 = {
            "infra_name":"infra_openstack5",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Test",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
            }    
        response21 = requests.request("POST", url, headers=headers, data = payload21)
        print(response21.text)
        self.assertEqual(response21.status_code, 200)

   #######################       Negative Testcases wrt Openstack       #########################

        # Null infra name
        payload22 = {
            "infra_name":"",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Test",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
            }    
        response22 = requests.request("POST", url, headers=headers, data = payload22)
        print(response22.text)
        self.assertEqual(response22.status_code, 400)

        #Null Cloud_Type
        payload23 = {
            "infra_name":"infra_openstack5",
            "cloud_type":"",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Test",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
            }    
        response23 = requests.request("POST", url, headers=headers, data = payload23)
        print(response23.text)
        self.assertEqual(response23.status_code, 400)

        #Null RcFIle
        payload24 = {
            "infra_name":"infra_openstack5",
            "cloud_type":"Openstack",
            "RcFile":"",
            "environment":"Test",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
            }    
        response24 = requests.request("POST", url, headers=headers, data = payload24)
        print(response24.text)
        self.assertEqual(response24.status_code, 400)

        #Null Environment
        payload25 = {
            "infra_name":"infra_openstack5",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
            }    
        response25 = requests.request("POST", url, headers=headers, data = payload25)
        print(response25.text)
        self.assertEqual(response25.status_code, 400)

        #Null Orchestrator
        payload26 = {
            "infra_name":"infra_openstack5",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Test",
            "orchestrator":"",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
            }    
        response26 = requests.request("POST", url, headers=headers, data = payload26)
        print(response26.text)
        self.assertEqual(response26.status_code, 400)

        #Null Orchestrator_url
        payload27 = {
            "infra_name":"infra_openstack5",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Test",
            "orchestrator":"OSM",
            "orchestrator_url":"",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
            }    
        response27 = requests.request("POST", url, headers=headers, data = payload27)
        print(response27.text)
        self.assertEqual(response27.status_code, 400)

        #Null Orchestrator_username
        payload28 = {
            "infra_name":"infra_openstack5",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Test",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"",
            "orchestrator_password":"admin"
            }    
        response28 = requests.request("POST", url, headers=headers, data = payload28)
        print(response28.text)
        self.assertEqual(response28.status_code, 400)

        #Null Orchestrator_password
        payload29 = {
            "infra_name":"infra_openstack5",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Test",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":""
            }    
        response29 = requests.request("POST", url, headers=headers, data = payload29)
        print(response29.text)
        self.assertEqual(response29.status_code, 400)

        # Wrong infra name
        payload30 = {
            "infra_name":"jsfhfwhri##%^$^%#^%",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Test",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
            }    
        response30 = requests.request("POST", url, headers=headers, data = payload30)
        print(response30.text)
        self.assertEqual(response30.status_code, 422)

        # Wrong cloud_type 
        payload31 = {
            "infra_name":"infra-osm",
            "cloud_type":"jbfjhsf",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Test",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
            }    
        response31 = requests.request("POST", url, headers=headers, data = payload31)
        print(response31.text)
        self.assertEqual(response31.status_code, 400)

        #Wrong RcFile
        payload32 = {
            "infra_name":"infra_openstack5",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin123\"\r\nexport OS_PASSWORD=\"secret123\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Test",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
            }    
        response32 = requests.request("POST", url, headers=headers, data = payload32)
        print(response32.text)
        self.assertEqual(response32.status_code, 500)

        #Wrong environment
        payload33 = {
            "infra_name":"infra_openstack1",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"VeenusEnv",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
            }
        response33 = requests.request("POST", url, headers=headers, data = payload33)
        print(response33.text)
        self.assertEqual(response33.status_code, 400)

        #Wrong Orchestrator
        payload34 = {
            "infra_name":"infra_openstack1",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Demo",
            "orchestrator":"jhuwerygweyjh",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
            }
        response34 = requests.request("POST", url, headers=headers, data = payload34)
        print(response34.text)
        self.assertEqual(response34.status_code, 400)

        #Wrong orchestrator url
        payload35 = {
            "infra_name":"infra_openstack1",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Demo",
            "orchestrator":"OSM",
            "orchestrator_url":"sbfksjfhakjfa",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
            }
        response35 = requests.request("POST", url, headers=headers, data = payload35)
        print(response35.text)
        self.assertEqual(response35.status_code, 500)

        #Wrong orchestrator username
        payload36 = {
            "infra_name":"infra_openstack1",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Demo",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"adminasbdhja",
            "orchestrator_password":"admin"
            }
        response36 = requests.request("POST", url, headers=headers, data = payload36)
        print(response36.text)
        self.assertEqual(response36.status_code, 500)

        #Wrong orchestrator password
        payload37 = {
            "infra_name":"infra_openstack1",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Demo",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"jkafbajfhaj"
            }
        response37 = requests.request("POST", url, headers=headers, data = payload37)
        print(response37.text)
        self.assertEqual(response37.status_code, 500)

        #Missing parameter : orchestrator
        payload38 = {
        "infra_name" : "infra555",
        "cloud_type" : "AWS",
        "environment" : "Production",
        "access_key" : "AKIA4QX7SK3EERNJCOPS",
        "secret_key" : "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"
        }
        response38 = requests.request("POST", url, headers=headers, data = payload38)
        print(response38.text)
        self.assertEqual(response38.status_code, 400)

        #Missing RC FIle 
        payload40 = {
            "infra_name":"infra_openstack555",
            "cloud_type":"Openstack",
            "environment":"Test",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin"
        }
        response40 = requests.request("POST", url, headers=headers, data = payload40)
        print(response40.text)
        self.assertEqual(response40.status_code, 400)

        # adding unneeded inputs
        payload41 = {
            "infra_name":"infra_openstack555",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Test",
            "orchestrator":"OSM",
            "orchestrator_url":"https://44.232.129.195:9999",
            "orchestrator_username":"admin",
            "orchestrator_password":"admin",
            "access_key" : "AKIA4QX7SK3EERNJCOPS",
            "secret_key" : "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"
        }
        response41 = requests.request("POST", url, headers=headers, data = payload41)
        print(response40.text)
        self.assertEqual(response41.status_code, 200)

        # Without orchestrator details
        payload42 = {
            "infra_name":"infra_openstack6",
            "cloud_type":"Openstack",
            "RcFile":"export OS_USERNAME=\"admin\"\r\nexport OS_PASSWORD=\"secret\"\r\nexport OS_PROJECT_DOMAIN_ID=\"Default\"\r\nexport OS_AUTH_URL=http://54.184.126.241/identity/v3",
            "environment":"Test"
            }    
        response42 = requests.request("POST", url, headers=headers, data = payload42)
        print(response42.text)
        self.assertEqual(response42.status_code, 200)


###########################  To Fetch Infra Details  #####################################
    def test2_getInfradetails(self):
        url = 'http://dno-dev.acndevopsengineering.com/onboard/infra'
        headers = {"Authorization": "Bearer {}".format(token)}
        response = requests.request("GET", url, headers=headers)
        print(response.text)
        self.assertEqual(response.status_code, 200)

################################      CLeanUp Code      ##################################

    def test3_CleanUp(self):
        url = 'http://dno-dev.acndevopsengineering.com/onboard/infra'
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {"infra_name" : "infra1"}
        response = requests.request("DELETE", url, headers=headers, data = payload)
        print(response.text)
        self.assertEqual(response.status_code, 200)
    
        payload1 = {"infra_name" : "infra2"}
        response1 = requests.request("DELETE", url, headers=headers, data = payload1)
        print(response1.text)
        self.assertEqual(response1.status_code, 200)

        payload2 = {"infra_name" : "infra3"}
        response2 = requests.request("DELETE", url, headers=headers, data = payload2)
        print(response2.text)
        self.assertEqual(response2.status_code, 200)

        payload3 = {"infra_name" : "infra4"}
        response3 = requests.request("DELETE", url, headers=headers, data = payload3)
        print(response3.text)
        self.assertEqual(response3.status_code, 200)

        payload4 = {"infra_name" : "infra5"}
        response4 = requests.request("DELETE", url, headers=headers, data = payload4)
        print(response4.text)
        self.assertEqual(response4.status_code, 200)

                ########### CleanUp wrt Openstack  ######################
        
        payload5 = {"infra_name":"infra_openstack1"}
        response5 = requests.request("DELETE", url, headers=headers, data = payload5)
        print(response5.text)
        self.assertEqual(response5.status_code, 200)

        payload6 = {"infra_name":"infra_openstack2"}
        response6 = requests.request("DELETE", url, headers=headers, data = payload6)
        print(response6.text)
        self.assertEqual(response6.status_code, 200)

        payload7 = {"infra_name":"infra_openstack3"}
        response7 = requests.request("DELETE", url, headers=headers, data = payload7)
        print(response7.text)
        self.assertEqual(response7.status_code, 200)

        payload8 = {"infra_name":"infra_openstack4"}
        response8 = requests.request("DELETE", url, headers=headers, data = payload8)
        print(response8.text)
        self.assertEqual(response8.status_code, 200)

        payload9 = {"infra_name":"infra_openstack5"}
        response9 = requests.request("DELETE", url, headers=headers, data = payload9)
        print(response9.text)
        self.assertEqual(response9.status_code, 200)

        payload10 = {"infra_name":"infra_openstack6"}
        response10 = requests.request("DELETE", url, headers=headers, data = payload10)
        print(response10.text)
        self.assertEqual(response10.status_code, 200)

        #Already deleted / Non existing  Infra entry 
        payload11 = {"infra_name":"infra_openstack5"}
        response11 = requests.request("DELETE", url, headers=headers, data = payload11)
        print(response11.text)
        self.assertEqual(response11.status_code, 404)

        #Null infra name for deletion
        payload12 = {"infra_name":""}
        response12 = requests.request("DELETE", url, headers=headers, data = payload12)
        print(response12.text)
        self.assertEqual(response12.status_code, 404)
         
if __name__ == '__main__':

    unittest.main()