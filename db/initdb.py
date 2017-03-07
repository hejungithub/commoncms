#!/usr/bin/python
# -*- coding: utf-8 -*-

from sqlalchemy import create_engine, and_, or_
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import exc as sa_exc
from db.model import Base, Admin, User, LiveCourse, HisCourse
import json
"""
模型操作模块，负责数据存储层
"""


class InitDB:
    engine = create_engine("mysql+pymysql://root:@localhost:3306/qiao?charset=utf8",
                           encoding="utf-8", echo=True)
    DBSession = sessionmaker(bind=engine, )
    Base.metadata.create_all(bind=engine, )

    def __init__(self):
        pass

    def __call__(self, **kwargs):
        pass

    def getadmin(self, obj):
        ses = self.takeSes()
        try:
            ad = ses.query(Admin).filter(
                and_(Admin.name == obj['username'],
                     Admin.password == obj['userpwd'])).one()

            ret = ad.to_dict()
            ses.close()
            return ret
        except sa_exc.NoResultFound:
            ses.close()
            return {}

    def navinfo(self):
        ses = self.takeSes()
        try:
            alls = ses.query(User).all()
            lives = ses.query(LiveCourse).all()
            hiss = ses.query(HisCourse).all()
            ret = {
                'users': len(alls),
                'lives': len(lives),
                'hiss': len(hiss)
            }
            ses.commit()
            ses.close()
            return ret
        except:
            ses.rollback()
            ses.close()
            return {}

    def listtodict(self, ret):
        des = []
        for result in ret:
            des.append(result.to_dict())

        return des

    def takeSes(self):
        session = InitDB.DBSession()
        return session

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

    def changeadmin(self, obj):
        ses = self.takeSes()
        try:
            ad = ses.query(Admin).filter(Admin.name == obj['name']).one()
            ad.password = obj['password']
            ret = ad.to_dict()

            ses.commit()
            ses.close()
            return ret
        except sa_exc.NoResultFound:
            ses.rollback()
            ses.close()
            return {}

    def search(self, pdict):
        ses = self.takeSes()
        try:
            ad = ses.query(User).filter(User.name.like('%' + pdict['name'] + '%')) \
                .limit(10).offset(int(pdict['cur']) * 10).all()

            alls = ses.query(User).filter(User.name.like('%' + pdict['name'] + '%')).all()
            if len(ad) == 0:
                raise BaseException
            else:
                allsize = len(alls)
                ret = {
                    'total': allsize,
                    'page': round(allsize / 10),
                    'cur': int(pdict['cur']),
                    'data': self.listtodict(ad),
                    'persize': 10
                }
                ses.commit()
                ses.close()
                return ret

        except:
            ses.rollback()
            ses.close()
            return {}

    '''

    '''
    def allRecord(self, page, entity):
        tmppage = int(page)
        if tmppage > 0:
            tmppage -= 1

        ses = self.takeSes()
        try:
            rets = ses.query(entity).limit(10).offset(tmppage * 10).all()
            alls = ses.query(entity).all()
            if len(rets) == 0:
                raise BaseException
            else:
                allsize = len(alls)
                ret = {
                    'total': allsize,
                    'page': round(allsize / 10),
                    'cur': page,
                    'data': self.listtodict(rets),
                    'persize': 10
                }
                ses.commit()
                ses.close()
                return json.dumps(ret)

        except:
            ses.rollback()
            ses.close()
            return {}
