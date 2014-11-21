var pomelo = window.pomelo;
var username;
var password;
var users;
var base = 1000;
var increase = 25;
//add message on board
function addMessage(from, target, text, time){
	if(text === null) return;
	
	var time = new Date();
	
	console.log(time);
	var messageElement = $(document.createElement("table"));
	messageElement.addClass("message");
	//text = util.toStaticHTML(text);
	var content='<tr><td class="date">' + time + '</td> <td class="nick">' + from + ' says to ' + target + ': </td> <td class="msg-text">' + text + '</td></tr>';
	messageElement.html(content);
	$("#chatHistory").append(messageElement);
}	

//init user list
function initUserList(data){
	users = data.users;
	for(var i= 0; i < users.length; i++){
		var slElement = $(document.createElement("option"));
		slElement.attr("value", users[i]);
		slElement.text(users[i]);
     // $("#usersList").append("<option value='" + users[i] + "''>" + users[i] + "</option>");
		$("#usersList").append(slElement);
	}
};
//add user in user list
function addUser(user){
	var slElement = $(document.createElement("option"));
	slElement.attr("value", user);
	slElement.text(user);
	$("#usersList").append(slElement);
};
//remove user from user list
function removeUser(user){
	$("#usersList option").each(
		function(){
			if($(this).val() === user) $(this).remove();
		}
	);
}
// user register
function userRegister(username, password, callback) {
	var route = 'gate.gateHandler.userRegister';
	pomelo.init({
		host: window.location.hostname,
		port: 3014,
		log: true
	}, function() {
		pomelo.request(route, {
			username: username,
			password: password
		}, function(data) {
			pomelo.disconnect();
			if(data.code === 500) {
				return;
			}
			callback(data.host, data.port);
		});
	});
};

// user login
function userLogin(username, password, callback) {
	var route = 'gate.gateHandler.userLogin';
	pomelo.init({
		host: window.location.hostname,
		port: 3014,
		log: true
	}, function() {
		pomelo.request(route, {
			username: username,
			password: password
		}, function(data) {
			pomelo.disconnect();
			if(data.code === 500) {
				return;
			}
			callback(data.host, data.port);
		});
	});
};

// addtopic
function addTopic(title) {
	var route = 'connector.topicHandler.addTopic';
		pomelo.request(route, {
			title: title
		}, function(data) {
			if(data.code === 500) {
				$('#tip').text('新建话题失败');
				return;
			}
			$('#tip').text('新建话题成功');
		});

};

function getTopics() {
	var route = 'connector.topicHandler.getTopics';
		pomelo.request(route, {}, function(data) {
			if(data.code === 500) {
				$('#tip').text('获取话题失败');
				return;
			}
			$('#tip').text('获取话题成功');
			alert(data.topics.length);
			data.topics.forEach( function(topic, index){
				$("#topics").append("<li>" + topic.title + "</li>");
			});
			
		});

};

$(document).ready(function() {
	//wait message from the server.
	pomelo.on('onChat', function(data) {
		addMessage(data.from, data.target, data.msg);
	});

	//update user list
	pomelo.on('onAdd', function(data) {
		var user = data.user;
		addUser(user);
	});

	//update user list
	pomelo.on('onLeave', function(data) {
		alert(data);
		var user = data.user;
		removeUser(user);
	});


	//handle disconect message, occours when the client is disconnect with servers
	pomelo.on('disconnect', function(reason) {
		
	});

	
	//deal with login button click.
	$("#login1").click(function() {
		username = $("#loginUser").attr("value");
		loginPassword = $("#loginPassword").attr("value");
		if(username.length > 20 || username.length == 0 || loginPassword.length > 20 || loginPassword.length == 0) {
			return false;
		}

		//query entry of connection
		userLogin(username, loginPassword, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "connector.entryHandler.enter";
				pomelo.request(route, {
					username: username,
					password: loginPassword
				}, function(data) {
					if(data.error) {
						return;
					}
					$('#tip').text('成功登录');
					initUserList(data);
					
				});
			});
		});
	});
	//deal with login button click.
	$("#register").click(function() {
		alert("register");
		username = $("#registerUser").attr("value");
		loginPassword = $("#registerPassword").attr("value");
		alert(username);
		if(username.length > 20 || username.length == 0 || loginPassword.length > 20 || loginPassword.length == 0) {
			return false;
		}

		//query entry of connection
		userRegister(username, loginPassword, function(host, port) {
			alert("host" + host + ":" +  port);
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "connector.entryHandler.enter";
				pomelo.request(route, {
					userId: username,
					password: loginPassword
				}, function(data) {
					if(data.error) {
						return;
					}
					$('#tip').text('登录');
					initUserList(data);
					
				});
			});
		});
	});

//deal with login button click.
	$("#addtopic").click(function() {
		alert("addtopic");
		var title = $("#title").attr("value");

		//query entry of connection
		addTopic(title);
	});

	$("#gettopics").click(function() {
		alert("gettopics");
		//query entry of connection
		getTopics();
	});

	$("#reply").click(function() {
		alert("reply");
		var replytitle = $("#replytitle").attr("value");
		var replycontent = $("#replycontent").attr("value");
		var route = 'connector.replyHandler.addReply';
		pomelo.request(route, {	
			content : replycontent,
			title : replytitle
		}, function(data) {
			if(data.err) {
				$('#tip').text('回复话题失败');
				return;
			}
			$('#tip').text('回复话题成功');	
		});
	});

	$("#getcontents").click(function() {
		var gettitle = $("#gettitle").attr("value");
		var route = 'connector.replyHandler.getReplys';
		pomelo.request(route, {	
			title : gettitle,
		}, function(data) {
			if(data.err) {
				$('#tip').text('回复话题失败');
				return;
			}
			$('#tip').text('回复话题成功');
			alert(data.replys.length);
			data.replys.forEach( function(reply, index){
				$("#replys").append("<li>" + reply.content + "</li>");
			});
			
		});
	});

	$("#sendmsg").click(function(){
		var target = $("#usersList").val();
		var msg = $("#chatcontent").attr("value");
		var route = "chat.chatHandler.send";
		pomelo.request(route,{
			content: msg,
			username: username,
			target: target
		}, function(data){
			if( target != username){
				addMessage(username, target, msg);
			}
		});
	});

});