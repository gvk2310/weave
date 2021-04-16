import traceback
import json
import os
import datetime
from ..log import logger
from ..config.config import app
from flask_mongoengine import MongoEngine
from bcrypt import hashpw, checkpw, gensalt
import re

db = MongoEngine(app)


class Project(db.Document):
    project_id = db.StringField(unique=True, required=True)
    project_name = db.StringField(required=True,unique=True)
    project_details = db.StringField(required=True)

def getProject(**kwargs):
    try:
        if len(kwargs) >0:
            project = Project.objects(__raw__=kwargs).first()
            return {"project_id": project.project_id,
                    "project_name": project.project_name,
                    "project_details": project.project_details
                    } if project else False
        data = [{"project_id": project.project_id,
                 "project_name": project.project_name,
                 "project_details": project.project_details
                 }
                for project in Project.objects()]
        return data if data else False
    except Exception as e:
        logger.error("Failed to get project details")
        logger.debug(traceback.format_exc())
        logger.error(e)


def createProject(**kwargs):
    try:
        project = Project(project_id=kwargs['project_id'],
                          project_name=kwargs['project_name'],
                          project_details=kwargs['project_details'])
        project.save()
        return True
    except Exception as e:
        logger.error("Failed to create project")
        logger.debug(traceback.format_exc())
        logger.error(e)

def updateProject(**kwargs):
    try:
        project = Project.objects(name=kwargs['project_name']).first()
        if 'project_details' in kwargs:
            project.update(project_details=kwargs['project_details'])
        return True
    except Exception as e:
        logger.error("Failed to create project")
        logger.debug(traceback.format_exc())
        logger.error(e)

def deleteProject(**kwargs):
    try:
        project = Project.objects(project_name=kwargs['project_name']).first()
        project.delete()
        logger.info(f"Project '{project}' has been deleted")
        return True
    except Exception as e:
        logger.error("Failed to delete project")
        logger.debug(traceback.format_exc())
        logger.error(e)

@app.before_first_request
def initial_data_setup():
    createProject(project_id=datetime.datetime.now().strftime("PR%Y%m%d%H%M%S"),
                  project_name='Devnetops',
                  project_details='Devnetops project')

        
