import traceback
from ..log import logger
from ..config.config import app
from flask_mongoengine import MongoEngine

db = MongoEngine(app)


class Assets(db.Document):
    assetid = db.StringField(unique=True, required=True)
    name = db.StringField(required=True)
    vendor = db.StringField(required=True)
    group = db.StringField(required=True)
    type = db.StringField(required=True)
    size = db.StringField(default='')
    version = db.DecimalField(required=True)
    link = db.StringField(default='')
    repository = db.StringField(required=True)
    scan_result = db.StringField()
    onboard_status = db.StringField()

    

class Tests(db.Document):
    testcaseid = db.StringField(unique=True, required=True)
    name = db.StringField(required=True)
    description = db.StringField(required=True)
    category = db.StringField(required=True)
    scripttype = db.StringField(required=True)
    entrypoint = db.StringField(required=True)
    parameters = db.StringField(required=True)
    type = db.StringField(required=True)
    repository = db.StringField(required=True)
    link = db.StringField(default='')
    scan_result = db.StringField()
    onboard_status = db.StringField()



def get(**kwargs):
    try:
        if len(kwargs) > 0:
            asset = Assets.objects(__raw__=kwargs).first()
            return {"asset_id": asset.assetid,
                    "asset_name": asset.name,
                    "asset_vendor": asset.vendor,
                    "asset_group": asset.group,
                    "asset_type": asset.type,
                    "asset_size": asset.size,
                    "asset_version": asset.version,
                    "asset_link": asset.link,
                    "asset_repository": asset.repository,
                    "scan_result": asset.scan_result,
                    "onboard_status": asset.onboard_status} if asset else False
        return [{"asset_id": asset.assetid,
                 "asset_name": asset.name,
                 "asset_vendor": asset.vendor,
                 "asset_group": asset.group,
                 "asset_type": asset.type,
                 "asset_size": asset.size,
                 "asset_version": str(asset.version),
                 "asset_link": asset.link,
                 "asset_repository": asset.repository,
                 "scan_result": asset.scan_result,
                 "onboard_status": asset.onboard_status} for asset in
                Assets.objects()] if Assets.objects() else False
    except Exception as e:
        logger.error("Unable to get asset details")
        logger.debug(traceback)
        logger.error(e)


def create(**kwargs):
    try:
        asset = Assets(assetid=kwargs['assetid'],
                       name=kwargs['name'],
                       vendor=kwargs['vendor'],
                       group=kwargs['group'],
                       type=kwargs['type'],
                       size=kwargs['size'],
                       version=kwargs['version'],
                       repository=kwargs['repository'],
                       link=kwargs['link'],
                       scan_result=kwargs['scan_result'],
                       onboard_status=kwargs['onboard_status'])
        asset.save()
        return True
    except Exception as e:
        logger.error("Unable to save the asset details")
        logger.debug(traceback)
        logger.error(e)


def update(**kwargs):
    try:
        asset = Assets.objects(assetid=kwargs['assetid']).first()
        if all(item in kwargs for item in ['size', 'link']):
            asset.update(link=kwargs['link'])
            # do not change this, it's a workaround for mongo bug
            asset.size = kwargs['size']
            asset.save()
        if 'scan_result' in kwargs:
            asset.update(scan_result=kwargs['scan_result'])
        if 'onboard_status' in kwargs:
            asset.update(onboard_status=kwargs['onboard_status'])
    except Exception as e:
        logger.error("Unable to update asset details")
        logger.debug(traceback)
        logger.error(e)


def delete(**kwargs):
    try:
        asset = Assets.objects(__raw__=kwargs).first()
        asset.delete()
        return True
    except Exception as e:
        logger.error("Unable to delete an asset details")
        logger.debug(traceback)
        logger.error(e)
        
        
        
        
def getTest(**kwargs):
    try:
        if len(kwargs) > 0:
            test = Tests.objects(__raw__=kwargs).first()
            return {"test_id": test.testcaseid,
                    "test_name": test.name,
                    "test_description": test.description,
                    "test_category": test.category,
                    "test_type": test.type,
                    "test_scripttype": test.scripttype,
                    "test_entrypoint": test.entrypoint,
                    "test_parameters": test.parameters,
                    "test_link": test.link,
                    "test_repository": test.repository,
                    "scan_result": test.scan_result,
                    "onboard_status": test.onboard_status} if test else False
        return [{"test_id": test.testcaseid,
                    "test_name": test.name,
                    "test_description": test.description,
                    "test_category": test.category,
                    "test_type": test.type,
                    "test_scripttype": test.scripttype,
                    "test_entrypoint": test.entrypoint,
                    "test_parameters": test.parameters,
                    "test_link": test.link,
                    "test_repository": test.repository,
                    "scan_result": test.scan_result,
                    "onboard_status": test.onboard_status} for test in
                Tests.objects()] if Tests.objects() else False
    except Exception as e:
        logger.error("Unable to get test details")
        logger.debug(traceback)
        logger.error(e)


def createTest(**kwargs):
    try:
        test = Tests(testcaseid=kwargs['testcaseid'],
                     name=kwargs['name'],
                     description=kwargs['description'],
                     category=kwargs['category'],
                     type=kwargs['type'],
                     scripttype=kwargs['scripttype'],
                     entrypoint=kwargs['entrypoint'],
                     parameters=kwargs['parameters'],
                     repository=kwargs['repository'],
                     link=kwargs['link'],
                     scan_result=kwargs['scan_result'],
                     onboard_status=kwargs['onboard_status'] )
        test.save()
        return True
    except Exception as e:
        logger.error("Unable to save the test details")
        logger.debug(traceback)
        logger.error(e)


def updateTest(**kwargs):
    try:
        test = Tests.objects(testcaseid=kwargs['testcaseid']).first()
        if 'link' in kwargs:
            test.update(link=kwargs['link'])
        if 'description' in kwargs:
            test.update(description=kwargs['description'])
        if 'category' in kwargs:
            test.update(category=kwargs['category'])
        #if 'parameters' in kwargs:
        #    test.update(parameters=kwargs['parameters'])
        if 'scan_result' in kwargs:
            test.update(scan_result=kwargs['scan_result'])
        if 'onboard_status' in kwargs:
            test.update(onboard_status=kwargs['onboard_status'])
        return True
    except Exception as e:
        logger.error("Unable to update test details")
        logger.debug(traceback)
        logger.error(e)


def deleteTest(**kwargs):
    try:
        test = Tests.objects(__raw__=kwargs).first()
        if not test:
            return True
        test.delete()
        return True
    except Exception as e:
        logger.error("Unable to delete the testcase details")
        logger.debug(traceback)
        logger.error(e)

