const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  // the routes are defined here
  
  router.get('/graphicsByUser', function (req, res, next) {
    let datei = new Date().toLocaleDateString('en-US', {
      month: '2-digit',day: '2-digit',year: 'numeric'})      
    var date = new Date(datei);    
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    var dateParam = y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);    
    db.query(
      'select count(*) as saved, username from bets where type not in ("Cuña", "Combinado") and DATE_FORMAT(date, "%Y-%m-%d")= ? group by username',
      [dateParam, 10*(req.params.page || 0)],
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