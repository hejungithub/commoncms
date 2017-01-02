#!/usr/bin/python
# -*- coding: utf-8 -*-
import logging
import logging.config
import json

from flask import request
from flask import Flask, jsonify
from db import initdb

app = Flask(__name__)

# log
logging.config.fileConfig("logger.conf")
logger = logging.getLogger("example02")

# db
DAO = initdb.InitDB()


@app.route("/", methods=['GET'])
def index():
    return app.send_static_file('index.html')


@app.route("/cms/login", methods=['GET'])
def loginview():
    return app.send_static_file('login.html')


@app.route("/cms/login", methods=['POST'])
def login():
    para = request.get_data().decode()
    print(para)
    return jsonify(para)


@app.route("/cms/admin", methods=['POST'])
def admininfo():
    para = request.get_data().decode()
    print(para)
    return jsonify(para)


@app.route("/cms", methods=['GET'])
def nav():
    return app.send_static_file('cms.html')


@app.route("/user/add/<uname>", methods=['GET'])
def user_add(uname):
    obj = DAO.addUser(uname)
    return jsonify(obj)


@app.route("/user/get/<uid>", methods=['GET'])
def user_get(uid):
    try:
        obj = DAO.getUser(uid)
        return jsonify(obj)
    finally:
        logger.warning("warn1")


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=3000, debug=True)
