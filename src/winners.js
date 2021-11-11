const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  
  router.get('/winners/:number/:date/:loteryCode', function (req, res, next) {      
    db.query(
      'SELECT number, l.name, vendor_code, b.value, b.type, b.DATE, b.USERNAME FROM bets b INNER JOIN lotery l on b.lotery_code = l.code where (number = ? or substr(?,1,3) = number or substr(?,2,4) = number OR substr(?,3,4) = number) AND DATE_FORMAT(date, "%Y-%m-%d")= ? AND b.lotery_code = ?',
      [req.params.number, req.params.number, req.params.number, req.params.number, req.params.date, req.params.loteryCode],
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