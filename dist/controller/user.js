'use strict';

var db = require('../core/db');
var httpMsg = require('../core/httpMsg');
var settings = require('../settings');
var util = require('util');
var jwt = require('jsonwebtoken');

exports.login = function (req, resp) {
    try {

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

                    resp.writeHead(200, { "Content-Type": "application/json" });
                    if (data && callback.length > 0) {

                        var user = callback[0];
                        if (user.Username === req.body.Username) {
                            var token = jwt.sign({
                                Username: user.Username,
                                FullName: user.Fullname
                            }, settings.secert, {
                                expiresIn: 86400 // expires in 24 hours
                            });

                            resp.write(JSON.stringify({
                                success: true,
                                Fullname: user.Fullname,
                                token: token }));
                        }
                    }

                    resp.end();
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
//# sourceMappingURL=user.js.map