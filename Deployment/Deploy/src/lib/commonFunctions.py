from io import BytesIO
import re
import xlwt
import xlrd
import jenkins
import requests
import traceback
from ..log import logger
from functools import wraps
from flask_restful import request
from werkzeug.datastructures import FileStorage
from ..config.config import token_auth_url, onboarding_url, jenkins_url, \
    jenkins_username, jenkins_password, jenkins_token


def nonEmptyString(value):
    if isinstance(value, str) and value.strip() and re.match(
            r'^[a-zA-Z0-9\-_|]+$', value):
        return value
    else:
        raise ValueError(
            'The string value is either empty or not allowed. Alphanumeric '
            'string with special characters (-_) allowed')


def genericString(value):
    if len(value) > 0:
        return value
    else:
        raise ValueError(
            'The string value is either empty or not allowed. Alphanumeric '
            'string with special characters (-_) allowed')


def checkStringLength(string):
    if (len(string) <= 25):
        return True
    else:
        return False


def excelFileType(file):
    if not isinstance(file, FileStorage) or file.filename.split('.')[-1] not in ['xls']:
        raise ValueError('Config file not provided or not an excel file input')
    return file


def verify_token(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        resp = requests.get(f"{token_auth_url}/isvalidrequest",
                            cookies=request.cookies)
        if resp.status_code != 200:
            return resp.json(), resp.status_code
        return func(*args, **kwargs)

    return wrapper


def assetDownloadDetails(assets):
    try:
        data = requests.get(f"{onboarding_url}/assetdetails?assets={assets}")
        if data.status_code == 200:
            return data.json()
        logger.error("Failed to retrieve asset download detail")
    except Exception as e:
        logger.error("Unable to get asset download detail")
        logger.debug(traceback.format_exc())
        logger.error(e)


def triggerJenkins(parameters, job_name):
    try:
        srv = jenkins.Jenkins(jenkins_url, username=jenkins_username,
                              password=jenkins_password)
        srv.build_job(job_name, parameters=parameters,
                      token=jenkins_token)
        return True
    except Exception as e:
        logger.error("Unable to trigger Jenkins Job")
        logger.debug(traceback.format_exc())
        logger.error(e)


def dictToXls(config):
    try:
        book = xlwt.Workbook()
        sheet = book.add_sheet('Sheet 1')

        header_style = xlwt.easyxf(
            'font: height 240,name Calibri, colour_index black, bold on; '
            'align: wrap on, vert centre, horiz center;'
            'borders: top thin, bottom thin, left thin, right thin;'
            'pattern: pattern solid, fore_color 44;')
        data_style = xlwt.easyxf(
            'font: name Calibri, colour_index black, bold off; align: wrap on, '
            'vert centre, horiz center;'
            'borders: top thin, bottom thin, left thin, right thin;')

        for i in range(len(config)):
            sheet.write(0, i, list(config.keys())[i], header_style)
            sheet.write(1, i, list(config.values())[i], data_style)
            if len(list(config.keys())[i]) * 367 > sheet.col(i).width:
                sheet.col(i).width = len(list(config.keys())[i]) * 367
        wb = BytesIO()
        book.save(wb)
        wb.seek(0)
        return wb
    except Exception as e:
        logger.error("Error while creating the config excel file")
        logger.debug(traceback.format_exc())
        logger.error(e)


def xlsToJson(xls_file):
    try:
        book = xlrd.open_workbook(file_contents=xls_file.read())
        sheet = book.sheet_by_index(0)
        headers = [sheet.cell_value(0, col) for col in range(sheet.ncols)]
        return [dict(zip(headers, [sheet.cell_value(row, col) for col in
                                   range(sheet.ncols)])) for row in
                range(1, sheet.nrows)]
    except Exception as e:
        logger.error("Error while opening the config excel file")
        logger.debug(traceback.format_exc())
        logger.error(e)
