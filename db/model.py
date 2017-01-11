from sqlalchemy import Column, Integer, String, DateTime, Numeric
from sqlalchemy.ext.declarative import declarative_base

"""
实体表对象，定义模型与表的映射关系
增加转化json对象处理
"""

def convert_datetime(value):
    if value:
        return value.strftime("%Y-%m-%d %H:%M:%S")
    else:
        return ""

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

# db model base
# add to_dict parse json
Base = declarative_base()

Base.to_dict = to_dict


class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    name = Column(String(200))
    password = Column(String(200))
    tel = Column(String(200))
    nickname = Column(String(200))
    clicks = Column(Integer)
    money = Column(String(200))
    qiaomoney = Column(String(200))
    photo = Column(String(200))
    mail = Column(String(200))
    createtime = Column(DateTime)
    updatetime = Column(DateTime)

class School(Base):
    __tablename__ = 'sch'

    id = Column(Integer, primary_key=True)
    name = Column(String(200))
