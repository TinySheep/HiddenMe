$('button#random').click(function(){
	$.ajax({
		type: 'post',
		url: 'randomposts'
	}).done(function(data){
		$("#randonmost").html("");
		$("#randomPost").html("<p id="+data['_id']+">Post: "+data['body']+"<br>Date: "+data['date']+"<br>Author: "+data['nickname']+"</p>");
	});
});


$('button#latest').click(function(){
	$.ajax({
		type: 'post',
		url: '/latestPosts'
	}).done(function(data){
		$("#latestPost").html("");
		for(var i in data){
			$("#latestPost").append("<p id="+data[i]['_id']+">Post: "+data[i]['body']+"<br>Date: "+data[i]['date']+"<br>Author: "+data[i]['nickname']+"</p><hr>");	
		}
	})
})