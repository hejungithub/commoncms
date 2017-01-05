from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

"""
实体表对象，定义模型与表的映射关系
增加转化json对象处理
"""


def to_dict(self):
    return {
        c.name: getattr(self, c.name, None) for c in self.__table__.columns
        }


# db model base
# add to_dict parse json
Base = declarative_base()

Base.to_dict = to_dict


class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    name = Column(String(20))


class School(Base):
    __tablename__ = 'sch'

    id = Column(Integer, primary_key=True)
    name = Column(String(20))
