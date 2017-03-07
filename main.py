#!/usr/bin/python
# -*- coding: utf-8 -*-
import logging
import logging.config
import json

from flask import request
from flask import Flask
from db import initdb
from db import model

app = Flask(__name__)

# log
logging.config.fileConfig("logger.conf")
logger = logging.getLogger("example02")

# db
DAO = initdb.InitDB()


@app.route("/", methods=['GET'])
def mav():
    return app.send_static_file('login.html')


@app.route("/main", methods=['GET'])
def main():
    return app.send_static_file('cms.html')


@app.route("/login", methods=['POST'])
def login():
    para = request.get_data().decode()
    pdict = json.loads(para)
    obj = DAO.getadmin(pdict)
    return json.dumps(obj)


@app.route("/admin", methods=['POST'])
def admininfo():
    para = request.get_data().decode()
    pdict = json.loads(para)
    obj = DAO.getadmin(pdict)
    return json.dumps(obj)


@app.route("/adminchange", methods=['POST'])
def adminchange():
    para = request.get_data().decode()
    pdict = json.loads(para)
    obj = DAO.changeadmin(pdict)
    return json.dumps(obj)


@app.route("/navinfo", methods=['GET'])
def navinfo():
    obj = DAO.navinfo()
    return json.dumps(obj)


@app.route("/user/add/<uname>", methods=['GET'])
def user_add(uname):
    obj = DAO.addUser(uname)
    return json.dumps(obj)


@app.route("/user/get/<uid>", methods=['GET'])
def user_get(uid):
    try:
        obj = DAO.getUser(uid)
        return json.dumps(obj)
    finally:
        logger.warning("warn1")


# search service


@app.route("/search", methods=['POST'])
def search():
    para = request.get_data().decode()
    ddict = json.loads(para)
    pdict = json.loads(para)
    tmppage = int(pdict['cur'])
    if tmppage > 0:
        tmppage -= 1
    pdict['cur'] = tmppage
    obj = DAO.search(pdict)
    obj['cur'] = ddict['cur']
    return json.dumps(obj)

# all record & pageable
# live & his & user entity


@app.route("/live/all/<page>", methods=['GET'])
def live_all(page):
    return DAO.allRecord(page, model.LiveCourse)


@app.route("/his/all/<page>", methods=['GET'])
def his_all(page):
    return DAO.allRecord(page, model.HisCourse)


@app.route("/user/all/<page>", methods=['GET'])
def user_all(page):
    return DAO.allRecord(page, model.User)

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=3000, debug=True)
