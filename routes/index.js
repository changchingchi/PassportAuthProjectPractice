var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET home page. */
router.get('/', function(req, res) {
	console.log("+++++++:" +req.isAuthenticated());
	console.log("+++++++:"+ req.user);
  res.render('index', { 
  	isAuthenticated: req.isAuthenticated(),
  	user: req.user });
});

router.get('/login', function(req, res){
	res.render('login');
});
router.get('/chat', function(req,res){
	res.render('chat');
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/chat',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

router.get('/logout',function(req,res){
	console.log('user logout called');
	 //this is passport function. passport will delete userID inside session.
	 req.logout();
	 res.redirect('/');
});

function ensureAuthenticated(req,res,next){
	if(req.isAuthenticated()){
		next();
	}else{
		// res.redirect('/login');
		res.send(403);
	}
};
//use passport http to handle api access.
router.get('/api', 
  passport.authenticate('basic', { session: false }),
  function(req, res) {
    res.json(req.user);
  });

router.get('/api/data', ensureAuthenticated ,function(req,res){
	res.json([
			{value:'123'},
			{value:'json'},
			{value:'test'}
		]);
});



module.exports = router;
