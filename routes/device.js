const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const commonService = require('../services/commonService');
const User = require("../model/user");


router.post('/create', checkAuth ,function(req, res) {
    var data = req.body;
    data.userId = req.userData.userId;
    commonService.createDevice(data).then(userId => {
      res.status(200).send(userId);
    }).catch(err => {
        res.status(400).send(err);
    });
  });

router.put("/edit", checkAuth ,(req, res) => {
    var data = req.body;
    commonService.editDevice(data).then(deviceUpdateInfo => {
      res.status(200).send(deviceUpdateInfo);
    }).catch(err => {
        res.status(400).send(err);
    });
})

router.get("/read", checkAuth,(req, res) => {    
    commonService.getDevices(req.userData.userId).then(devices => {
      res.status(200).send(devices);
    }).catch(err => {
        res.status(400).send(err);
    });
})

router.delete("/delete", checkAuth,(req, res) => {
    commonService.removeDevice(req.body.deviceId, req.userData.userId).then(devices => {
        res.status(200).send(devices);
    }).catch(err => {
        res.status(400).send(err);
    });
})

router.patch("/currentState", checkAuth,(req, res) => {
    var data = req.body;
    commonService.editDevice(data).then(deviceUpdateInfo => {
      res.status(200).send(deviceUpdateInfo);
    }).catch(err => {
        res.status(400).send(err);
    });
})

router.patch("/share", checkAuth, (req, res) => {
    var data = req.body;
    commonService.shareDevice(data).then(deviceShareInfo => {
      res.status(200).send(deviceShareInfo);
    }).catch(err => {
        res.status(400).send(err);
    });
})

module.exports = router;