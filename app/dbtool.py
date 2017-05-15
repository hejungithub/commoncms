#!/usr/bin/python
# -*- coding: utf-8 -*-

from sqlalchemy import create_engine, and_
from sqlalchemy.orm import sessionmaker
from app.model import Base, Admin, User, LiveCourse, \
    HisCourse, MT4strategy, MT4recommend, MT4follow, Bank, Tixian, Msg

from app.utils import logger
import datetime

"""
模型操作模块，负责数据存储层
"""


class DataDB:
    engine = create_engine("mysql+pymysql://root:@localhost:3306/qiao?charset=utf8",
                           encoding="utf-8", echo=False)
    DBSession = sessionmaker(bind=engine, )
    Base.metadata.create_all(bind=engine, )

    def __init__(self):
        pass

    def __call__(self, **kwargs):
        pass

    def get_admin(self, obj):
        ses = self.takeSes()
        try:
            ad = ses.query(Admin).filter(and_(Admin.name == obj['username'], Admin.password == obj['userpwd'])).one()

            ret = ad.to_dict()
            ses.close()
            return ret
        except Exception as err:
            logger.info(err)
            ses.close()
            return {}

    def nav_info(self):
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
        except Exception as err:
            logger.info(err)
            ses.rollback()
            ses.close()
            return {}

    def listtodict(self, ret):
        des = []
        for result in ret:
            des.append(result.to_dict())

        return des

    def list2todict(self, ret):
        des = []
        for result in ret:
            if isinstance(result, tuple):
                tmpret = {}
                for tmp in result:
                    tmpret.update(tmp.to_dict())
                des.append(tmpret)
            else:
                pass
        return des

    def takeSes(self):
        session = DataDB.DBSession()
        return session

    def getUser(self, uid):
        ses = self.takeSes()
        try:
            user = ses.query(User).filter(User.id == uid).one()
            retu = user.to_dict()
            bank = ses.query(Bank).filter(Bank.uid == uid).all()
            bk = self.listtodict(bank)
            if retu:
                retu['bank'] = bk
            ses.close()
            return retu

        except Exception as err:
            logger.info(err)
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
        except Exception as err:
            logger.info(err)
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
        except Exception as err:
            logger.info(err)
            ses.rollback()
            ses.close()
            return {}

    def search(self, pdict):
        ses = self.takeSes()
        try:
            if 'name' in pdict:
                query = ses.query(User).filter(User.name.like('%' + pdict['name'] + '%'))
            else:
                query = ses.query(User).filter(User.tel.like('%' + pdict['tel'] + '%'))

            ad = query.limit(10).offset(int(pdict['cur']) * 10).all()
            alls = query.all()
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

        except Exception as err:
            logger.info(err)
            ses.rollback()
            ses.close()
            return {}

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
                return ret

        except Exception as err:
            logger.info(err)
            ses.rollback()
            ses.close()
            return {}

    def allRecordMT4(self, page):
        tmppage = int(page)
        if tmppage > 0:
            tmppage -= 1

        ses = self.takeSes()
        try:
            query = ses.query(User, MT4strategy).filter(User.id == MT4strategy.uid)
            subquery = ses.query(MT4recommend.mt4id)

            rets = query.filter(MT4strategy.mt4id.notin_(subquery)) \
                .limit(10).offset(tmppage * 10).all()

            alls = query.filter(MT4strategy.mt4id.notin_(subquery)).all()

            if len(rets) == 0:
                raise BaseException
            else:
                allsize = len(alls)
                ret = {
                    'total': allsize,
                    'page': round(allsize / 10),
                    'cur': page,
                    'data': self.list2todict(rets),
                    'persize': 10
                }
                ses.commit()
                ses.close()
                return ret

        except Exception as err:
            logger.info(err)
            ses.rollback()
            ses.close()
            return {}

    def getMt4Strategy(self, uid):
        ses = self.takeSes()
        try:
            mt4follow = ses.query(MT4follow).filter(MT4follow.uid == uid).all()
            mt4stra = ses.query(MT4strategy).filter(MT4strategy.uid == uid).all()
            retstr = self.listtodict(mt4stra)
            retf = self.listtodict(mt4follow)
            retstr.extend(retf)
            ses.close()
            return retstr

        except Exception as err:
            logger.info(err)
            ses.close()
            return {}

    def addMT4recommend(self, obj):
        ses = self.takeSes()
        new_mt4 = MT4recommend()
        new_mt4.mt4id = obj['mt4id']
        new_mt4.uid = obj['uid']
        new_mt4.uname = obj['uname']
        try:
            # 添加到session:
            ses.add(new_mt4)
            ret = new_mt4.to_dict()
            ses.commit()
            ses.close()
            return ret

        except Exception as err:
            logger.info(err)
            ses.rollback()
            ses.close()
            return {}

    def allRecordMT4Recommend(self, page):
        tmppage = int(page)
        if tmppage > 0:
            tmppage -= 1

        ses = self.takeSes()
        try:
            query = ses.query(MT4recommend).filter(MT4recommend.id != -1)

            rets = query.limit(10).offset(tmppage * 10).all()

            alls = query.all()

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
                return ret

        except Exception as err:
            logger.info(err)
            ses.rollback()
            ses.close()
            return {}

    def addUserVal(self, pdict):
        ses = self.takeSes()
        try:
            usr = ses.query(User).filter(User.id == pdict['uid']).one()
            if pdict.get('valtype') == 'money':
                usr.money += float(pdict['val'])
            else:
                usr.qiaomoney += float(pdict['val'])
            ret = usr.to_dict()
            ses.commit()
            ses.close()
            return ret
        except Exception as err:
            logger.info(err)
            ses.rollback()
            ses.close()
            return {}

    def dotixian(self, obj):
        ses = self.takeSes()
        try:
            ad = ses.query(Tixian).filter(Tixian.id == int(obj)).one()
            ad.status = 2
            ret = ad.to_dict()

            ses.commit()
            ses.close()
            return ret
        except Exception as err:
            logger.info(err)
            ses.rollback()
            ses.close()
            return {}

    def dotixiancancel(self, obj):
        ses = self.takeSes()
        try:
            ad = ses.query(Tixian).filter(Tixian.id == obj).one()
            ad.status = 1
            ret = ad.to_dict()

            ses.commit()
            ses.close()
            return ret
        except Exception as err:
            logger.info(err)
            ses.rollback()
            ses.close()
            return {}

    def allMsgRecord(self, page):
        tmppage = int(page)
        if tmppage > 0:
            tmppage -= 1

        ses = self.takeSes()
        try:
            rets = ses.query(Msg.title, Msg.content, Msg.time).distinct(Msg.time).limit(10).offset(tmppage * 10).all()
            alls = ses.query(Msg.title, Msg.content, Msg.time).distinct(Msg.time).all()
            if len(rets) == 0:
                raise BaseException
            else:
                allsize = len(alls)
                ret = {
                    'total': allsize,
                    'page': round(allsize / 10),
                    'cur': page,
                    'data': rets,
                    'persize': 10
                }
                ses.commit()
                ses.close()
                return ret

        except Exception as err:
            logger.info(err)
            ses.rollback()
            ses.close()
            return {}

    def add_new_msg(self, pdict):
        ses = self.takeSes()
        try:
            usr = ses.query(User).all()
            nowtime = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            for itm in usr:
                new_msg = Msg(uid=itm.id, title=pdict['title'],
                              content=pdict['content'], time=nowtime)
                ses.add(new_msg)

            ses.commit()
            ses.close()

            return {'num': len(usr)}

        except Exception as err:
            logger.info(err)
            ses.rollback()
            ses.close()
            return {}
