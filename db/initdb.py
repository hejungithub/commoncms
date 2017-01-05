#!/usr/bin/python
# -*- coding: utf-8 -*-

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import exc as sa_exc
from db.model import Base
from db.model import User

"""
模型操作模块，负责数据存储层
"""


class InitDB:
    engine = create_engine("mysql+pymysql://root:@localhost:3306/test?charset=utf8",
                           encoding="utf-8", echo=True)
    DBSession = sessionmaker(bind=engine, )
    Base.metadata.create_all(bind=engine, )

    def __init__(self):
        pass

    def __call__(self, **kwargs):
        pass

    def listtodict(self, ret):
        des = []
        for result in ret:
            des.append(result.to_dict())

        return des

    def takeSes(self):
        session = InitDB.DBSession()
        return session

    def alluser(self, pdict):
        ses = self.takeSes()
        try:
            users = ses.query(User).limit(10).offset(int(pdict['cur']) * 10).all()
            alls = ses.query(User).all()
            if len(users) == 0:
                raise BaseException
            else:
                allsize = len(alls)
                ret = {
                    'total': allsize,
                    'page': round(allsize / 10),
                    'cur': int(pdict['cur']),
                    'data': self.listtodict(users)
                }
                ses.commit()
                ses.close()
                return ret

        except:
            ses.rollback()
            ses.close()
            return {}

    def getUser(self, uid):
        ses = self.takeSes()
        try:
            user = ses.query(User).filter(User.id == uid).one()
            ret = user.to_dict()
            ses.close()
            return ret

        except sa_exc.NoResultFound:
            ses.close()
            return {}

    def addUser(self, name):
        ses = self.takeSes()
        new_user = User(name=name)

        try:
            # 添加到session:
            ses.add(new_user)

            result = ses.query(User).filter(User.id == 1).all()

            if len(result) == 0:
                raise BaseException
            else:
                ret = new_user.to_dict()
                ses.commit()
                ses.close()
                return ret
        except:
            ses.rollback()
            ses.close()
            return {}
