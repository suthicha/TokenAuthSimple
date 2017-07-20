'use strict';

var util = require('util');
var jwt = require('jsonwebtoken');

var db = require('../core/db');
var httpMsg = require('../core/httpMsg');
var settings = require('../settings');

exports.login = function (req, resp) {

    try {
        if (!req.body) throw new Error("Input not valid");
        var data = {
            Username: req.body.Username,
            UPassword: req.body.Password
        };

        if (data) {
            var sql = util.format("SELECT Username, Fullname FROM Users WHERE Username='%s' AND UPassword='%s'", data.Username, data.UPassword);
            db.executeSql(sql, function (callback, err) {
                if (err) {
                    httpMsg.show500(req, resp, err);
                } else {
                    if (data && callback.length > 0) {
                        var user = callback[0];
                        if (user.Username === req.body.Username) {
                            var token = jwt.sign({
                                Username: user.Username,
                                FullName: user.Fullname
                            }, settings.secert, {
                                expiresIn: 86400 // expires in 24 hours
                            });

                            resp.writeHead(200, { "Content-Type": "application/json" });
                            resp.write(JSON.stringify({
                                success: true,
                                Fullname: user.Fullname,
                                token: token }));
                            resp.end();
                        } else {
                            httpMsg.sendAuthFail(req, resp, "Username not match.");
                        }
                    } else {
                        httpMsg.sendAuthFail(req, resp, "Find not found Username: " + data.Username);
                    }
                }
            });
        } else {
            throw new Error("Input not valid");
        }
    } catch (ex) {
        httpMsg.show500(req, resp, ex);
    }
};

exports.getList = function (req, resp) {

    db.executeSql('select * from users', function (data, err) {
        if (err) {
            httpMsg.show500(req, resp, err);
        } else {
            httpMsg.sendJson(req, resp, data);
        }
    });
};

exports.get = function (req, resp, id) {
    try {

        if (!id) throw new Error("Input not valid");

        var userId = parseInt(id);
        db.executeSql('select * from users where trxid=' + userId, function (data, err) {
            if (err) {
                httpMsg.show500(req, resp, err);
            } else {
                httpMsg.sendJson(req, resp, data);
            }
        });
    } catch (ex) {
        httpMsg.show500(req, resp, ex);
    }

    ;
};

exports.add = function (req, resp) {

    try {
        if (!req.body) throw new Error("Input not valid");
        var data = req.body;

        if (data) {
            var sql = "INSERT INTO Users (Username, UPassword, Fullname) values ";
            sql += util.format("('%s', '%s', '%s')", data.Username, data.UPassword, data.Fullname);
            db.executeSql(sql, function (data, err) {
                if (err) {
                    httpMsg.show500(req, resp, err);
                } else {
                    httpMsg.show200(req, resp);
                }
            });
        } else {
            throw new Error("Input not valid");
        }
    } catch (ex) {
        httpMsg.show500(req, resp, ex);
    }
};

exports.update = function (req, resp) {

    try {
        if (!req.body) throw new Error("Input not valid");
        var data = req.body;

        if (data) {
            if (!data.TrxId) throw new Error("UserId not provide");
            var sql = "UPDATE Users SET";

            if (data.UPassword) {
                sql += " UPassword = '" + data.UPassword + "',";
            }

            if (data.Fullname) {
                sql += " Fullname = '" + data.Fullname + "',";
            }

            sql = sql.slice(0, -1);
            sql += " WHERE TrxId=" + data.TrxId;
            console.log(sql);
            db.executeSql(sql, function (data, err) {
                if (err) {
                    httpMsg.show500(req, resp, err);
                } else {
                    httpMsg.show200(req, resp);
                }
            });
        } else {
            throw new Error("Input not valid");
        }
    } catch (ex) {
        httpMsg.show500(req, resp, ex);
    }
};

exports.delete = function (req, resp) {
    try {
        if (!req.body) throw new Error("Input not valid");
        var data = req.body;

        if (data) {
            if (!data.TrxId) throw new Error("UserId not provide");
            var sql = "DELETE USERS WHERE TrxId=" + data.TrxId;

            db.executeSql(sql, function (data, err) {
                if (err) {
                    httpMsg.show500(req, resp, err);
                } else {
                    httpMsg.show200(req, resp);
                }
            });
        } else {
            throw new Error("Input not valid");
        }
    } catch (ex) {
        httpMsg.show500(req, resp, ex);
    }
};
//# sourceMappingURL=user.js.map