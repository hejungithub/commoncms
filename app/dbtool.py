#!/usr/bin/python
# -*- coding: utf-8 -*-

from sqlalchemy import create_engine, and_
from sqlalchemy.orm import sessionmaker
from app.model import Base, Admin, User, LiveCourse, \
    HisCourse, MT4strategy, MT4follow, Bank, Tixian, Msg

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

    def takeSes(self):
        session = DataDB.DBSession()
        return session

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

    def zhifu(self, uid):
        ses = self.takeSes()
        try:
            user = ses.query(User).filter(User.id == uid).one()
            if user.pay == 0:
                user.pay = 1
            else:
                user.pay = 0

            ret = user.to_dict()
            ses.merge(user)
            ses.commit()
            ses.close()
            return ret

        except Exception as err:
            logger.info(err)
            ses.close()
            return {}

    def fan(self, obj):
        data = []
        ses = self.takeSes()
        try:
            usr = ses.query(User).filter(User.id == obj['uid']).one()
            if usr:
                usr.reverse = obj['state']
                ses.merge(usr)
                ses.commit()

            rets = ses.query(User, MT4follow).filter(and_(User.id == obj['uid'], MT4follow.uid == obj['uid'])).all()
            if rets:
                data = self.list2todict(rets),

            return data

        except Exception as err:
            logger.info(err)
            ses.close()
            return data

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

    def getLive(self, cid):
        ses = self.takeSes()
        try:
            course = ses.query(LiveCourse).filter(LiveCourse.id == cid).one()
            retu = course.to_dict()
            ses.close()
            return retu

        except Exception as err:
            logger.info(err)
            ses.close()
            return {}

    def saveLive(self, obj):
        ses = self.takeSes()
        try:
            result = ses.query(LiveCourse).filter(LiveCourse.id == obj['id']).one_or_none()
            if result:
                course = LiveCourse()
                course.merge(obj)
                ses.merge(course)
                ses.commit()
                ses.close()

                return course.to_dict()

        except Exception as err:
            logger.info(err)
            ses.rollback()
            ses.close()
            return {}

    def addLive(self, obj):
        ses = self.takeSes()
        try:
            live = LiveCourse()
            if obj:
                live.merge(obj)
                ret = live.to_dict()
                ses.add(live)
                ses.commit()
                ses.close()
                return ret
            else:
                ses.close()
                return {}

        except Exception as err:
            logger.info(err)
            ses.rollback()
            ses.close()
            return {}

    def getHis(self, cid):
        ses = self.takeSes()
        try:
            course = ses.query(HisCourse).filter(HisCourse.id == cid).one()
            retu = course.to_dict()
            ses.close()
            return retu

        except Exception as err:
            logger.info(err)
            ses.close()
            return {}

    def saveHis(self, obj):
        ses = self.takeSes()
        try:
            result = ses.query(HisCourse).filter(HisCourse.id == obj['id']).one_or_none()
            if result:
                course = HisCourse()
                course.merge(obj)
                ses.merge(course)
                ses.commit()
                ses.close()

                return course.to_dict()

        except Exception as err:
            logger.info(err)
            ses.rollback()
            ses.close()
            return {}

    def addHis(self, obj):
        ses = self.takeSes()
        try:
            his = HisCourse()
            if obj:
                his.merge(obj)
                ret = his.to_dict()
                ses.add(his)
                ses.commit()
                ses.close()
                return ret
            else:
                ses.close()
                return {}

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
                ses.close()
                return {}

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

    def delLive(self, liveid):
        ses = self.takeSes()
        try:
            rets = ses.query(LiveCourse).filter(LiveCourse.id == liveid).one()
            if rets:
                ses.delete(rets)
                ses.commit()
                ses.close()
            else:
                ses.close()
                return {}

        except Exception as err:
            logger.info(err)
            ses.rollback()
            ses.close()
            return {}

    def delHis(self, hisid):
        ses = self.takeSes()
        try:
            rets = ses.query(HisCourse).filter(HisCourse.id == hisid).one()
            if rets:
                ses.delete(rets)
                ses.commit()
                ses.close()
            else:
                ses.close()
                return {}

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
