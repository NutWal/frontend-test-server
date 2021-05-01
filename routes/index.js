var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/start', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  console.log("START command received")
  console.log("starting scanning...")

  res.json({message: "started"})
});


router.get('/stop', function(req, res, next) {
  console.log("STOP command received")
  console.log("stopping scanning...")

  res.json({message: "stopped"})
});

module.exports = router;
