from sqlalchemy import Column, Integer, Float, String, DateTime, Numeric
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

"""
实体表对象，定义模型与表的映射关系
增加转化json对象处理
"""


def convert_datetime(value):
    if isinstance(value, str):
        tt = datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
        return tt
    else:
        return value.strftime("%Y-%m-%d %H:%M:%S")


def to_dict(self):
    ret = {}
    for col in self.__table__.columns:
        if isinstance(col.type, DateTime):
            value = convert_datetime(getattr(self, col.name))
        elif isinstance(col.type, Numeric):
            value = float(getattr(self, col.name))
        else:
            value = getattr(self, col.name)
        ret[col.name] = value
    return ret


def merge(self, obj):
    for col in self.__table__.columns:
        if isinstance(col.type, DateTime):
            setattr(self, col.name, convert_datetime(obj[col.name]))
        elif isinstance(col.type, Numeric):
            setattr(self, col.name, float(obj[col.name]))
        else:
            setattr(self, col.name, obj[col.name])


# db model base
# add to_dict parse json
Base = declarative_base()

Base.to_dict = to_dict
Base.merge = merge


class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    clicks = Column(Integer)
    createtime = Column(DateTime)
    mail = Column(String(200))
    money = Column(String(200))
    name = Column(String(200))
    nickname = Column(String(200))
    password = Column(String(200))
    photo = Column(String(200))
    qiaomoney = Column(Float)
    tel = Column(String(200))
    updatetime = Column(DateTime)
    pay = Column(Integer)
    reverse = Column(Integer)


class Admin(Base):
    __tablename__ = 'admin'
    id = Column(Integer, primary_key=True)
    name = Column(String(200))
    password = Column(String(200))


class HisCourse(Base):
    __tablename__ = 'historycourse'
    id = Column(Integer, primary_key=True)
    content = Column(String(200))
    lecturer = Column(String(200))
    url = Column(String(200))
    starttime = Column(DateTime)
    endtime = Column(DateTime)


class LiveCourse(Base):
    __tablename__ = 'livecourse'
    id = Column(Integer, primary_key=True)
    content = Column(String(200))
    lecturer = Column(String(200))
    starttime = Column(DateTime)
    endtime = Column(DateTime)


class MT4strategy(Base):
    __tablename__ = 'mt4strategy'
    id = Column(Integer, primary_key=True)
    uid = Column(Integer)
    mt4id = Column(String(200))
    createtime = Column(DateTime)


class MT4follow(Base):
    __tablename__ = 'mt4follow'
    id = Column(Integer, primary_key=True)
    uid = Column(Integer)
    mt4id = Column(String(200))
    smt4id = Column(String(200))
    createtime = Column(DateTime)


class MT4recommend(Base):
    __tablename__ = 'mt4recommend'
    id = Column(Integer, primary_key=True)
    uid = Column(Integer)
    uname = Column(String(200))
    mt4id = Column(String(200))


class Bank(Base):
    __tablename__ = 'bank'
    id = Column(Integer, primary_key=True)
    uid = Column(Integer)
    bankname = Column(String(200))
    branchbank = Column(String(200))
    name = Column(String(200))
    num = Column(String(200))
    uname = Column(String(200))


class Tixian(Base):
    __tablename__ = 'tx'
    id = Column(Integer, primary_key=True)
    uid = Column(Integer)
    bankname = Column(String(200))
    branchbank = Column(String(200))
    money = Column(Float)
    name = Column(String(200))
    uname = Column(String(200))
    status = Column(Integer)
    bank_num = Column(String(200))
    createtime = Column(DateTime)


class Msg(Base):
    __tablename__ = 'message'
    id = Column(Integer, primary_key=True)
    uid = Column(Integer)
    title = Column(String(200))
    content = Column(String(200))
    time = Column(String(200))
