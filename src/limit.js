const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  router.post('/limit', (req, res, next) => {              
    var date = new Date();    
    db.query(
      'INSERT INTO covered (NUMBER, VALUE, DATE, LOTERY_CODE) VALUES (?,?,?,?)',
      [req.body.number, req.body.value, new Date(date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + ' GMT+0500'), req.body.loteryCode],
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


  router.get('/limit/:value/:date/:limit/:today', function (req, res, next) {                   
    var datei = new Date().toLocaleDateString();
    var date = new Date(datei);
    console.log(date);
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    var dateParam = y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);    
    db.query(
      'SELECT * FROM (SELECT b.NUMBER , b.lotery_code, l.NAME,SUM(VALUE) AS SUMA, (SELECT COALESCE(SUM(c.VALUE),0) FROM covered c WHERE b.number = c.number and b.LOTERY_CODE = c.LOTERY_CODE AND DATE_FORMAT(c.date,"%Y-%m-%d")=?) as COVERED FROM bets b INNER JOIN lotery l on b.lotery_code = l.code WHERE DATE_FORMAT(b.date, "%Y-%m-%d")= ? AND b.type not in ("Cuña", "Combinado") GROUP BY LOTERY_CODE, NAME, b.number) AS TAB WHERE SUMA >= ? AND LENGTH(NUMBER)= ? ',
      [dateParam,req.params.date, req.params.value, req.params.limit],
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