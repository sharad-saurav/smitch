'use strict'
var mongoose = require('mongoose');
// require('../model/device');
// require('../model/user');
// const User = mongoose.model('User');
const User = require("../model/user");
const Device = require("../model/device");
const redis = require('redis');
// const Device = mongoose.model('Device');
const ObjectId = mongoose.Types.ObjectId;
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);

client.on('connect', function(){
    console.log('Connected to Redis...');
});


function createDevice(userData){
    return new Promise(function (resolve, reject) {
        var device = new Device({"name": userData.name, "devType": userData.devType, "currentState": userData.currentState});
        device.save().then(data =>{
            User.updateOne({"_id":userData.userId}, {$push: {devices: data._id}}).then(userId =>{
                resolve(userId); 
            }).catch(err =>{
                reject(err);
            })
        }).catch(err =>{
            reject(err);
        })
    })
};

function editDevice(data){
    return new Promise(function (resolve, reject) {
        Device.updateOne({ "_id":data.deviceId }, { $set: { name: data.name, devType: data.devType, currentState: data.currentState}}).then(deviceUpdate =>{
            resolve(deviceUpdate); 
        }).catch(err =>{
            console.log('err-----',err);
            reject(err);
        })
    })
};

function getDevices(id){
    return new Promise(function (resolve, reject) {
        console.log("id----",id);
        client.hmget('userDeviceMap',id.toString(), (err, data) =>{
            if(err) {
                console.log('err',err);
                reject(err);
            } else {
                if(data !== null && data[0] !== null){
                    console.log('data---------',data);
                    resolve(JSON.parse(data));
                } else {
                    User.findOne({ "_id" : id }).populate('devices').exec().then(userData =>{
                        console.log(userData);
                        client.hmset('userDeviceMap',id.toString(), JSON.stringify(userData.devices));
                        client.expire(id, 10)
                        resolve(userData.devices);
                    }).catch(err =>{
                        console.log('err-----2',err);
                        reject(err);
                    })
                }
            }
        })
    })
};

function removeDevice(deviceId , userId){
    return new Promise(function (resolve, reject) {
        User.updateOne({ _id: userId }, { "$pull": { "devices":  deviceId  }}, { safe: true }).then(userData =>{
            console.log(userData);
            resolve(userData);
        }).catch(err =>{
            console.log('err-----',err);
            reject(err);
        })
    })
};

function changeState(data){
    return new Promise(function (resolve, reject) {
        Device.updateOne({"_id":data.deviceId }, { $set: { currentState: data.currentState}}).then(deviceUpdate =>{
            resolve(deviceUpdate); 
        }).catch(err =>{
            console.log('err-----',err);
            reject(err);
        })
    })
}

function shareDevice(data){
    return new Promise(function (resolve, reject) {
        User.updateOne({ "email":data.email }, { $push: { devices: data.deviceId}}).then(userUpdate =>{
            resolve(userUpdate); 
        }).catch(err =>{
            console.log('err-----',err);
            reject(err);
        })
    })
}



var toExport = {
    createDevice,
    editDevice,
    getDevices,
    removeDevice,
    changeState,
    shareDevice
};
module.exports = toExport;