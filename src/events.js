const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  // the routes are defined here
  router.post('/event', (req, res, next) => {    
    var date = new Date();    
    db.query(
      'INSERT INTO bets (NUMBER, VALUE, DATE, LOTERY_CODE, VENDOR_CODE, USERNAME, TYPE) VALUES (?,?,?,?,?,?, ?)',
      [req.body.number, req.body.value, new Date(date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + ' GMT+0500'), req.body.loteryCode, req.body.vendorCode, req.body.userName, req.body.type],
      (error) => {
        if (error) {
          console.error(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json({status: 'ok'});
        }
      }
    );
  });

  router.get('/event', function (req, res, next) {
    db.query(
      'SELECT code, name, dayOfWeek, dayOfWeekException FROM lotery',
      [owner, 10*(req.params.page || 0)],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  });

  return router;
}

module.exports = createRouter;