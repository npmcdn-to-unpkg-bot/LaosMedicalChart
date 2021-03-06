var express = require('express');
var router = express.Router();
var util = require('util');

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host : '127.0.0.1',
  database : 'laos',
  user : 'guest',
  password : '1234'
});

router.route('/').get(function (req, res){
  res.render('test', {data:"default modify"});
});

router.route('/chart').get(function(req, res){
  res.render('chart_index',{mode:'chart'} );
});

router.route('/chart/:pid').get(function(req, res){
  var query = "SELECT pid, pname, DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(birth , '%Y') as age, sex, systolicBP, diastolicBP, temperature, pulse," +
  " bst, spo2, height, weight FROM patient " +
  "WHERE pid = "+ req.params.pid + ";";
  //console.log(query);
  pool.query(query, function (err, rows, fields){
    console.log(JSON.stringify(rows));
    res.render('chart', {mode:'chart', patient:rows[0], cid:req.params.pid});
  });
});

router.route('/chart/:pid/:cid').post(function(req, res){
  //console.log(req.body);
  var query =""+
  "UPDATE chart SET pid = " + req.params.pid;
  if(req.body.medical) query += util.format(", medical_chart = '%s'",  req.body.medical);
  if(req.body.prescription) query += util.format(", prescription = '%s'", req.body.prescription);
  if(req.body.lab) query += util.format(", lab = '%s'", req.body.lab);
  query += " WHERE cid =" + req.params.cid;
  console.log(query);
  pool.query(query, function(err, rows, fields){
    if(err) {
      console.log(query);
      console.log(err);
    }
    res.type('text/plain');
    res.send(JSON.stringify(rows));
  });
});

router.route('/patient/:id').get(function(req, res){
  var query =
  "SELECT pid, pname, DATE_FORMAT(birth, '%Y-%m-%d') as birth , phone, sex, address, systolicBP, diastolicBP, temperature, pulse," +
  " bst, spo2, height, weight "+
  "FROM patient " +
  "WHERE pid = "+ req.params.id + ";";
  console.log(query);
  pool.query(query, function (err, rows, fields){
    res.render('modifyPatient', {data: rows[0]}); //params
  }); //query
}); //route

router.route('/patient/:id').post(function(req, res){
  var query =
  "UPDATE patient SET pid = " + req.params.id;
  if(req.body.pname) query += util.format(", pname = '%s'",  req.body.pname);
  if(req.body.birth) query += util.format(", birth = '%s'", req.body.birth);
  if(req.body.sex) query += util.format(", sex = '%s'", req.body.sex);
  if(req.body.phone) query += util.format(", phone = '%s'", req.body.phone);
  if(req.body.address) query += util.format(", address = '%s'", req.body.address);
  if(req.body.sBP) query += util.format(", systolicBP = '%s'", req.body.sBP);
  if(req.body.dBP) query += util.format(", diastolicBP = '%s'", req.body.dBP);
  if(req.body.temperature) query += util.format(", temperature = '%s'", req.body.temperature);
  if(req.body.pulse) query += util.format(", pulse = '%s'", req.body.pulse);
  if(req.body.bst) query += util.format(", bst = '%s'", req.body.bst);
  if(req.body.spo2) query += util.format(", spo2 = '%s'", req.body.spo2);
  if(req.body.height) query += util.format(", height = '%s'", req.body.height);
  if(req.body.weight) query += util.format(", weight = '%s'", req.body.weight);
  query += " WHERE pid =" + req.params.id;
  console.log(query);
  pool.query(query, function (err, rows, fields){
    if(err) console.log(err);
    console.log(rows);
    res.redirect('/modify/patient/'+req.params.id); //params
  }); //query
});

module.exports = router;
