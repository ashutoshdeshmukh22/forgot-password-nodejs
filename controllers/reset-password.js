/* send reset password link in email */
router.post('/reset-password-email', function (req, res, next) {
  var email = req.body.email;

  //console.log(sendEmail(email, fullUrl));

  connection.query(
    'SELECT * FROM users WHERE email ="' + email + '"',
    function (err, result) {
      if (err) throw err;

      var type = '';
      var msg = '';

      console.log(result[0]);

      if (result[0].email.length > 0) {
        var token = randtoken.generate(20);

        var sent = sendEmail(email, token);

        if (sent != '0') {
          var data = {
            token: token,
          };

          connection.query(
            'UPDATE users SET ? WHERE email ="' + email + '"',
            data,
            function (err, result) {
              if (err) throw err;
            }
          );

          type = 'success';
          msg = 'The reset password link has been sent to your email address';
        } else {
          type = 'error';
          msg = 'Something goes to wrong. Please try again';
        }
      } else {
        console.log('2');
        type = 'error';
        msg = 'The Email is not registered with us';
      }

      req.flash(type, msg);
      res.redirect('/');
    }
  );
});
