#!/usr/bin/python
# -*- coding: utf-8 -*-
import logging
from flask import Flask, jsonify
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# 定义User对象:
class User(Base):
    # 表的名字:
    __tablename__ = 'user'
    # 表的结构:
    id = Column(Integer, primary_key=True)
    name = Column(String(20))

# 初始化数据库连接:
engine = create_engine('mysql+pymysql://root:123456@localhost:3306/test')
# 创建DBSession类型:
DBSession = sessionmaker(bind=engine)

app = Flask(__name__)

# log
file_handler = logging.FileHandler('app.log')
app.logger.addHandler(file_handler)


def initDb():
    # 创建session对象:
    session = DBSession()
    # 创建新User对象:
    new_user = User(id='70', name='Bob')
    # 添加到session:
    session.add(new_user)
    # 提交即保存到数据库:
    session.commit()
    # 关闭session:
    session.close()

    obj = {'id': 1, 'name': "hehe"}
    return obj


@app.route("/", methods=['GET'])
def index():
    initDb()
    return app.send_static_file('index.html')


@app.route("/task", methods=['GET'])
def get_tasks():
    str = "呵呵"

    tasks = initDb()

    logging.warning("warn")

    return jsonify({'tasks': tasks})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
