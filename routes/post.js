/* 
 * GET post comment page
 */

exports.addPost = function(User) {
	return function(req, res){
		console.log("test: "+User);
		res.render("post", {user : User});
	}
};
