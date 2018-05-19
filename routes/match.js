var express = require('express');
var router = express.Router();
var request = require('request');

var testUserToken = 'EAACEdEose0cBANPlm2bPsQkhxZAUBjfb3NYQYnQCvAwo0k8Sl6BL2uMqVwaOFARHTIUh0N38kwRNevrz5O9rUVvK9Bax4JGiPneh0CCu64TWrvxHwGYBhok1TFcG80GtbXILOml60lYbDxxSC8ReQ23hiML195kCOVrPICe4RiVRQlm54bPEzIfYkVLMx9ZAcg4U0blAZDZD';

function getAllUsers() {
	return undefined;
}

function Queue() {
	this.data = [];
}
  
Queue.prototype.add = function(record) {
	this.data.unshift(record);
}
  
Queue.prototype.remove = function() {
	this.data.pop();  
}

Queue.prototype.empty = function() {
	return this.data.length == 0;
}
    
Queue.prototype.first = function() {
	return this.data[0];  
}
    
Queue.prototype.last = function() {  
	return this.data[this.data.length - 1];
}
 
Queue.prototype.size = function() {
	return this.data.length;
}

function getFriends(user) {
	//var userToken = ? find user token here
	var friends = getUserFields(user, 'friends');
	// find friends ids in database
	return undefined;
}

// k is a maximum distance in relationship between fixed user and others
function getKUsers(user, k) {
	const q = new Queue;
	q.add(user);

	var dict = {};

	while (!q.empty()) {
		var elem = q.first;
		depth = dict[elem];
		if (depth && depth == k) {
			var arr = [];
			for (var elem in dict) {
				if (elem == k - 1) {
					arr.push(elem);
				}
			}
			return arr;
		}
		q.remove();

		var friends = getFriends(users);
		for (var friend in friends) {
			if (!dict[friend]) {
				q.add(friend);
				dict[friend] = dict[elem] + 1;
			}
		}
	}
}

function findOptimalUser(userToPair) {
	var users = getUsers();
	var maximum = 0;
	var maximumUser = undefined;
	for (var user in users) {
		var heuroVal = compareUsers(user, userToPair);
		if (heuroVal > maximum) {
			maximum = heuroVal;
			maximumUser = user;
		}
	}

	return maximumUser;
}

function compareUsers(user1, user2) {
	var similarity = 0
	for (var key in user1) {
		var weight = Math.floor(Math.random() * 5 + 1);
		try {
			var arr1 = user1[key].data.sort();
			var arr2 = user2[key].data.sort();
		}catch(exception) {
			if (user1[key].data == user2[key].data) {
				similarity += weight;
			}
			continue;
		}

		// if not array
		var l = 0;
		var r = 0;
		var count = 0;
		for (; l < arr1.length && r < arr2.length;) {
			if (arr1[l] == arr2[r]) {
				count++;
				l++; r++;
			}
			else if (arr1[l] < arr2[r]) {
				l++;
			}
			else if (arr1[l] > arr2[r]) {
				r++;
			}
		}

		similarity = similarity + (count * weight);
	}

	return similarity;
}

function getUserFields(userToken, field, next) {
	return new Promise((res, rej) => {
		request({
			url: 'https://graph.facebook.com/v3.0/me?fields=' + field,
			//'address,age_range,birthday,favorite_athletes,favorite_teams,gender,hometown,inspirational_people,languages'
			qs: {
				access_token: userToken
			},
			method: 'GET'
		}, function(error, response, body) {
			if (error) {
				console.log('Error sending messages: ', error);
				rej(error);
			} else if (response.body.error) {
				console.log('Error: ', response.body.error);
				rej(error);
			}
			res(body);
		});
	})
	
}

/* GET /match. */
router.get('/', function(req, res, next) {
	(async function() {
		var address = await getUserFields(testUserToken, 'address');
		var age_range = await getUserFields(testUserToken, 'age_range');
		var birthday = await getUserFields(testUserToken, 'birthday');
		var education = await getUserFields(testUserToken, 'education');
		var favorite_athletes = await getUserFields(testUserToken, 'favorite_athletes');
		var favorite_teams = await getUserFields(testUserToken, 'favorite_teams');
		var gender = await getUserFields(testUserToken, 'gender');
		var hometown = await getUserFields(testUserToken, 'hometown');
		var languages = await getUserFields(testUserToken, 'languages');
		var link = await getUserFields(testUserToken, 'link');
		var location = await getUserFields(testUserToken, 'location');
		var quotes = await getUserFields(testUserToken, 'quotes');
		var sports = await getUserFields(testUserToken, 'sports');
		var books = await getUserFields(testUserToken, 'books');
		var friends = await getUserFields(testUserToken, 'friends');
		var events = await getUserFields(testUserToken, 'events');
		var games = await getUserFields(testUserToken, 'games');
		var likes = await getUserFields(testUserToken, 'likes');
		var movies = await getUserFields(testUserToken, 'movies');
		var music = await getUserFields(testUserToken, 'music');
		var television = await getUserFields(testUserToken, 'television');
        
        var user = await getUserFields(testUserToken, 'address,age_range,birthday,education,favorite_athletes,favorite_teams,gender,hometown,languages,link,location,quotes,sports,books,friends,events,games,likes,movies,music,television');
		user = JSON.parse(user);
		
		var result = compareUsers(user, user);
		console.log("result is: " + result);
	})();
});

module.exports = router;
