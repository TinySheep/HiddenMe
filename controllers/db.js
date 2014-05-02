//Global variable
var post;
/*
findAllPosts = function(){
	return post.find(function(err, posts){
		if(err)
			console.error(err);
		else{
			console.log("All posts: "+ posts);
			return posts;		
		}
	});
}

findOnePost = function(){
	post.find(function(err, onePost){
		if(err)
			console.error(err);
		else {
			console.log("One post: " + onePost);
			return onePost;
		}
	})
}
*/

//Save a post 
exports.savePost = function(mongoose){
	
	//Set up the schema and model
	var Schema = mongoose.Schema;
	var postSchema = new Schema({
		body: {type: String},
		//user: {type: Schema.ObjectId, default: null},
		nickname: {type: String, default: 'Anonymous'},
		comments: [{body: String, date: Date}],
		date: {type: Date, default: Date.now}
	});
	post = mongoose.model('post', postSchema);
		
	return function(req, res){
		
		var data = req.body;
		var nickname = data['nickname'] ? data['nickname'] : 'Anonymous';
		var newPost = new post({
			body: data['body'],
			user: data['user'],
			nickname: nickname,
		});
		newPost.save(function(err){
			if(err){ 
				console.error(err);
				res.send(500);
			}
			else{
				console.log('Saved');
				res.send(200);
			}
		});

	}

}


//Generate a random post
exports.getRandomPosts = function(mongoose){
	return function(req, res){
		post.find(function(err, posts){
			if(err)
				console.error(err);
			else{

				var len = posts.length;
				var index = Math.floor(Math.random()* len);
				console.log(index);
				console.log(posts[index]);
				res.send(posts[index]);

			}
		});
	}
}


//Get a list of posts
exports.getLatestPosts = function(mongoose){
	return function(req, res){
		post.find(function(err, posts){
			if(err)
				console.error(err);//On error
			else{
				posts.sort(function(a, b){
					//compare function
					return b.date - a.date;
				});
				console.log("sorted: "+ posts);
				res.send(posts);
			}
		})
	}
}