const express = require('express');
const mongoose = require('mongoose');
const { log } = require('./utils/log');
const { Novel } = require('./db/schema');
const app = express();

mongoose.connect('mongodb://127.0.0.1/reader', { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (!err) {
        log('Connecting the database successfully...', 'blue')
    } else {
        log('Fail to connect the database ...', 'red')
    }
})

app.listen(8888, function (err) {
    if (!err) {
        log('Reader server is running...', 'blue');
    } else {
        log('There are some mistakes in listening...', 'red')
    }
})

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
})

app.get('/', function (req, res) {
    res.send('Novel server')
})

// 获取小说的章节信息，小说id、章节id
app.get('/chapterInfo', function (req, res) {
    const { novelId, chapterId } = req.query;
    let result = {};

    Novel.findOne({ novelId }, null, function (err, data) {
        if (!err && data) {
            // TODO: 参数校验，边界校验
            const chapterList = data.chapterList;

            result.novelId = Number(novelId);
            result.novelTitle = data.novelTitle;
            result.startChapterId = data.startChapterId;
            result.endChapterId = data.endChapterId;
            result = Object.assign({}, result, chapterList[chapterId - 1]);
            res.send(result);
        } else {
            // 找不到返回空对象
            res.send(result)
        }
    })
})

// 获取小说的章节列表，小说id
app.get('/chapterList', function (req, res) {
    const { novelId } = req.query;
    let result = {};

    Novel.findOne({ novelId }, null, function (err, data) {
        if (!err && data) {
            // TODO: 参数校验，边界校验
            const chapterTitleList = data.chapterList.map((item) => {
                return {
                    chapterTitle: item.chapterTitle,
                    chapterId: item.chapterId
                }
            });

            result.chapterList = chapterTitleList;
            result.novelId = Number(novelId);
            result.novelTitle = data.novelTitle;
            res.send(result);
        } else {
            res.send(result)
        }
    })
})