#!/usr/bin/python
# -*- coding: utf-8 -*-

import json
import urllib.request
import urllib.response
import urllib.parse

from flask import request
from flask import Flask
from app import dbtool
from app import model
from app.utils import logger

app = Flask(__name__)

# db
DAO = dbtool.DataDB()


@app.route("/", methods=['GET'])
def login_html():
    return app.send_static_file('login.html')


@app.route("/main", methods=['GET'])
def cms_html():
    return app.send_static_file('cms.html')


@app.route("/login", methods=['POST'])
def act_login():
    para = request.get_data().decode()
    pdict = json.loads(para)
    return json.dumps(DAO.get_admin(pdict))


@app.route("/admin", methods=['POST'])
def act_admin_info():
    para = request.get_data().decode()
    pdict = json.loads(para)
    return json.dumps(DAO.get_admin(pdict))


@app.route("/adminchange", methods=['POST'])
def act_admin_change():
    para = request.get_data().decode()
    pdict = json.loads(para)
    return json.dumps(DAO.changeadmin(pdict))


@app.route("/navinfo", methods=['GET'])
def act_nav_info():
    return json.dumps(DAO.nav_info())


@app.route("/user/add/<uname>", methods=['GET'])
def act_user_add(uname):
    return json.dumps(DAO.addUser(uname))


@app.route("/user/get/<uid>", methods=['GET'])
def act_user_get(uid):
    return json.dumps(DAO.getUser(uid))


@app.route("/mt4strategy/get/<uid>", methods=['GET'])
def act_mt4strategy_get(uid):
    try:
        obj = DAO.getMt4Strategy(uid)

        mt4ids = ''
        for tmp in obj:
            mt4ids += tmp['mt4id']
            mt4ids += ','

        paradata = {'mt4idlist': mt4ids[:-1]}

        if paradata['mt4idlist']:
            ret = service_api('action=MT4listInfo', paradata)
        else:
            ret = {}

        return json.dumps(ret)

    except Exception as err:
        logger.info(err)
        return json.dumps({})


@app.route("/mt4recommend/all/<page>", methods=['GET'])
def act_mt4recommend_get_all(page):
    try:
        ret = []
        getret = service_api('action=SelInsideList', {"name": "", "sr": "0", "sort": "1"})
        if getret:
            obj = DAO.allRecordMT4Recommend(page)
            for tmp in obj['data']:
                mt4ids = int(tmp['mt4id'])
                for tmpret in getret:
                    if mt4ids == tmpret['Mt4ID']:
                        ret.append(tmpret)

        return json.dumps(ret)

    except Exception as err:
        logger.info(err)

        return json.dumps({})


@app.route("/mt4strategy/save", methods=['POST'])
def act_mt4recommend_save():
    para = request.get_data().decode()
    pdict = json.loads(para)
    obj = DAO.addMT4recommend(pdict)
    if obj:
        upret = service_api('action=UpdateInside', {"mt4id": obj['mt4id'], "innerAccount": "1"})
        if getattr(upret, 'errMsg', None):
            return json.dumps(obj)
        else:
            return json.dumps({})
    else:
        return json.dumps({})


# search service


@app.route("/search", methods=['POST'])
def act_user_search():
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
def act_live_get_all(page):
    return json.dumps(DAO.allRecord(page, model.LiveCourse))


@app.route("/his/all/<page>", methods=['GET'])
def act_his_get_all(page):
    return json.dumps(DAO.allRecord(page, model.HisCourse))


@app.route("/user/all/<page>", methods=['GET'])
def act_user_get_all(page):
    return json.dumps(DAO.allRecord(page, model.User))


@app.route("/mt4strategy/all/<page>", methods=['GET'])
def act_mt4strategy_get_all(page):
    return json.dumps(DAO.allRecordMT4(page))


@app.route("/tixian/all/<page>", methods=['GET'])
def act_tixian_get_all(page):
    return json.dumps(DAO.allRecord(page, model.Tixian))


@app.route("/tixian/do/<idx>", methods=['GET'])
def act_tixian_do(idx):
    return json.dumps(DAO.dotixian(idx))


@app.route("/tixian/cancel/<idx>", methods=['GET'])
def act_tixian_cancel(idx):
    return json.dumps(DAO.dotixiancancel(idx))


@app.route("/sysaddval", methods=['POST'])
def act_sys_addval():
    para = request.get_data().decode()
    ddict = json.loads(para)
    obj = DAO.addUserVal(ddict)
    return json.dumps(obj)


def service_api(act, para):
    para = json.dumps(para, separators=(',', ':'))
    para = act + '''&json=''' + para
    para = 'http://118.178.95.73/Bonanza/Mt4Interface.ashx?' + para
    req = urllib.request.Request(method='GET', url=para)
    resp = urllib.request.urlopen(req)
    ret = resp.read().decode()

    while str == type(ret):
        ret = json.loads(ret)

    return ret


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=3000, debug=True)
