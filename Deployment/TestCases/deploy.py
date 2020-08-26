import unittest
import mimetypes
import requests
from requests.auth import HTTPBasicAuth
import http.client
import json
import time

token = requests.get('http://dno-dev.acndevopsengineering.com/umg/auth' , auth = ('admin@dnops.com', 'Admin@123')).json()['token']

class testDeploy(unittest.TestCase):
    def test01_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy1',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200724061422',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'versa'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\csv3.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)

        print(response.text)
        self.assertEqual(response.status_code, 200)


    def test02_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy2',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200805154720',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'generic'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\config-generic.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)

        print(response.text)
        self.assertEqual(response.status_code, 200)

#################################    Negative Test cases   ##################################
    #Null Name
    def test03_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': '',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200724061422',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'versa'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\mycsv.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)
        print(response.text)
        self.assertEqual(response.status_code, 400) 

    #Null Environment
    def test04_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'cft-12',
            'environment': '',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200724061422',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'versa'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\mycsv.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files, verify = False)
        print(response.text)
        self.assertEqual(response.status_code, 400) 

    #Null infra 
    def test05_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'cft-12',
            'environment': 'dev',
            'infra': '',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200724061422',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'versa'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\mycsv.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files, verify = False)
        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Null Orchestrator
    def test06_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'cft-12',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': '',
            'assets': 'template=AS20200724061422',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'versa'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\mycsv.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files, verify = False)
        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Null template 
    def test07_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'cft-12',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': '',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'versa'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\mycsv.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)
        print(response.text)
        self.assertEqual(response.status_code, 500)

    #Null Director IP
    def test08_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'cft-12',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200724061422',
            'director_ip': '',
            'controller_ip': 'http://52.24.86.201',
            'type': 'versa'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\mycsv.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)
        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Null Controller IP
    def test09_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'cft-12',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200724061422',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': '',
            'type': 'versa'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\mycsv.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)
        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Wrong Name
    def test10_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': '@#$%^&',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200724061422',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'versa'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\mycsv.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)
        print(response.text)
        self.assertEqual(response.status_code, 400)


    #Wrong environment
    def test11_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'cft-12',
            'environment': 'dev@#$%^',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200724061422',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'versa'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\mycsv.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)
        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Wrong Infra
    def test12_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'cft-12',
            'environment': 'dev',
            'infra': '@#$%^',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200724061422',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'versa'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\mycsv.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)
        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Wrong Infra - Not an onboarded Infra
    def test13_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'cft-12',
            'environment': 'dev',
            'infra': 'aws_11',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200724061422',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'versa'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\mycsv.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)
        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Wrong Orchestrator
    def test14_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'cft-12',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': '@#$%^&',
            'assets': 'template=AS20200724061422',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'versa'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\mycsv.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)
        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Wrong template
    def test15_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'cft-12',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200724061422@#$%^&',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'versa'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\mycsv.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)
        print(response.text)
        self.assertEqual(response.status_code, 500)

    #Wrong director IP
    def test16_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'cft-12',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200724061422',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'versa'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\mycsv.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)
        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Wrong Controller Ip
    def test17_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'cft-12',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200724061422',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': '52.24.86.201',
            'type': 'versa'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\mycsv.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)
        print(response.text)
        self.assertEqual(response.status_code, 400)

############################# Negative testcases wrt Generic deployment ####################################

    #Null Deployment name
    def test18_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': '',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200805154720',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'generic'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\config-generic.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)

        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Null environment 
    def test19_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy2',
            'environment': '',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200805154720',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'generic'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\config-generic.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)

        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Null Infra
    def test20_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy2',
            'environment': 'dev',
            'infra': '',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200805154720',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'generic'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\config-generic.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)

        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Null Orchestartor
    def test21_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy2',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': '',
            'assets': 'template=AS20200805154720',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'generic'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\config-generic.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)

        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Null Assets
    def test22_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy2',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': '',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'generic'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\config-generic.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)

        print(response.text)
        self.assertEqual(response.status_code, 500)

    #Null director_ip
    def test23_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy2',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200805154720',
            'director_ip': '',
            'controller_ip': 'http://52.24.86.201',
            'type': 'generic'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\config-generic.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)

        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Null COntroller_ip
    def test24_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy2',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200805154720',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': '',
            'type': 'generic'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\config-generic.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)

        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Null type
    def test25_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy2',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200805154720',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': ''}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\config-generic.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)

        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Wrong deployment name 
    def test26_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy2@#$%^',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200805154720',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'generic'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\config-generic.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)

        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Wrong environment
    def test27_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy2',
            'environment': 'soumya2#$%^',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200805154720',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'generic'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\config-generic.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)

        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Wrong Infra
    def test28_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy2',
            'environment': 'dev',
            'infra': '@#$%^&',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200805154720',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'generic'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\config-generic.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)

        print(response.text)
        self.assertEqual(response.status_code, 400)

#Wrong Orchestrator
    def test29_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy2',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': '@#$%^&#$%^&',
            'assets': 'template=AS20200805154720',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'generic'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\config-generic.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)

        print(response.text)
        self.assertEqual(response.status_code, 400)

#Wrong assets
    def test30_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy2',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=@#$%^&AS20200805154720',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'generic'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\config-generic.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)

        print(response.text)
        self.assertEqual(response.status_code, 500)

    #Wrong director_ip
    def test31_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy2',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200805154720',
            'director_ip': '35.160.43.204:9182',
            'controller_ip': 'http://52.24.86.201',
            'type': 'generic'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\config-generic.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)

        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Wrong controller_ip
    def test32_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy2',
            'environment': 'dev',
            'infra': 'aws',
            'orchestrator': 'cloudformation',
            'assets': 'template=AS20200805154720',
            'director_ip': 'https://35.160.43.204:9182',
            'controller_ip': '52.24.86.201',
            'type': '@#$%^&'}
        files = [
            ('config', open(r'C:\Users\k.navya.veenus\Postman\files\config-generic.csv','rb'))
        ]
        response = requests.request("POST", url, headers=headers, data = payload, files = files , verify = False)

        print(response.text)
        self.assertEqual(response.status_code, 400)

#=====================================================================================================#

    def test33_getDeployments(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        response = requests.request("GET", url, headers=headers, verify = False)
        print(response.text)
        self.assertEqual(response.status_code, 200)

#======================================================================================================#

    #Update deployment details
    def test34_update(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"    
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy1'}
        
        response = requests.request("GET", url, headers=headers, data = payload)

        for d in response.json():
            if all(i in d.items() for i in payload.items()):
                id = d["id"] 
                break 

        print(id)
             
        # print(token) 
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        payload1 = {"deployment_id": id, "status": "abc", "message": "Updated Msg.."}
        headers1 = {
        'Auth-Token': '11d2cc12486764cb4e2862d2388b70a826',
        'Content-Type': 'application/json'
        }
        response1 = requests.request("PUT", url, headers=headers1, data = json.dumps(payload1) )
        print(response1.text)       
        self.assertEqual(response1.status_code, 200)
        time.sleep(180)
    

#=======================================================================================================#

    #CleanUp Code wrt to Versa
    def test35_CleanUp(self):  
        url = "http://dno-dev.acndevopsengineering.com/deploy"    
        payload = {
            'name': 'deploy1'}
        headers = {"Authorization": "Bearer {}".format(token)}
        response = requests.request("GET", url, headers=headers, data = payload, verify = False)
 
        for d in response.json():
            if all(i in d.items() for i in payload.items()):
                id = d["id"]  

                print(id) 
        payload1 = {"id": id, "force_delete":"false"}
        response1 = requests.request("DELETE", url, headers=headers, data = payload1,verify = False) 
        print(response1.text)       
        self.assertEqual(response1.status_code, 200)


    #================ For Generic deployment ===================#
    def test36_CleanUp(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            'name': 'deploy2'}
        headers = {"Authorization": "Bearer {}".format(token)}
        response = requests.request("GET", url, headers=headers, data = payload, verify = False)
 
        for d in response.json():
            if all(i in d.items() for i in payload.items()):
                id = d["id"]  

                print(id) 
        payload1 = {"id": id, "force_delete":"false"}
        response1 = requests.request("DELETE", url, headers=headers, data = payload1,verify = False) 
        print(response1.text)       
        self.assertEqual(response1.status_code, 200)

       
    #Null ID
    def test37_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            "id":""
        }
        response = requests.request("DELETE", url, headers=headers, data = payload)
        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Wrong ID
    def test38_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            
            "id":"AS20200722072145!@#$%^&*"
        }
        response = requests.request("DELETE", url, headers=headers, data = payload)
        print(response.text)
        self.assertEqual(response.status_code, 400)

    #Already deleted deployment
    def test39_deploy(self):
        url = "http://dno-dev.acndevopsengineering.com/deploy"
        headers = {"Authorization": "Bearer {}".format(token)}
        payload = {
            
            "id":"AS20200722072145"
        }
        response = requests.request("DELETE", url, headers=headers, data = payload)
        print(response.text)
        self.assertEqual(response.status_code, 400)


if __name__ == '__main__':

    unittest.main()
