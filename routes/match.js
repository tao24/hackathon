var request = require('request');
var db = require('../models/database');

var fields = 'address,age_range,birthday,education,favorite_athletes,favorite_teams.limit(200),gender,hometown,languages,link,location,quotes,sports,books.limit(200),friends,events,games,likes.limit(200),movies.limit(200),music.limit(200),television';

function getAllUsers(next) {
	db.getWaitingUsers(next);
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

function getFriends(user) { // user by psid
	var db = new Database();
	var userToken = db.getUserToken(user);
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

function compare_ages(a, b)
{
    l = Math.max(a.min, b.min);
    r = Math.min(a.max, b.max);
    
    return r > l ;
}

function get_data(x)
{
    if(x != undefined && x.hasOwnProperty('data'))
        return x.data;
    
    return x;
        
}

function compareUsers(user1, user2) {
	var similarity = 0
    var similarities = {}
	for (var key in user1) {
		var weight = Math.floor(Math.random() * 5 + 1);
	
        if(get_data(user1[key]) instanceof Array && get_data(user2[key]) instanceof Array) {
			var arr1 = get_data(user1[key]).sort(function (a, b){return a.name < b.name});
			var arr2 = get_data(user2[key]).sort(function (a, b){return a.name < b.name});
            
            var matching = []

            var l = 0;
            var r = 0;
            var count = 0;
            for (; l < arr1.length && r < arr2.length;) {
                if (arr1[l].name == arr2[r].name) {
                    count++;
                
                    matching.push(arr2[r].name);
                    l++; r++;
                }
                else if (arr1[l].name < arr2[r].name) {
                    l++;
                }
                else if (arr1[l].name > arr2[r].name) {
                    r++;
                }
            }
        
            if(matching.length > 0)
                similarities[key] = matching;

            similarity = similarity + (count * weight);
        }
          	
        if (user1[key] == undefined || user2[key] == undefined)
            continue;
        else if (key === "age_range"  && compare_ages(user1[key], user2[key])) {
            similarity += weight;
            similarities[key] = ["similar age range"];
        }
        else if(key === "birthday" && String(user1[key]).substring(String(user1[key]).lastIndexOf("/") + 1) == 
                String(user2[key]).substring(String(user2[key]).lastIndexOf("/") + 1)) {
            similarity += weight;
            similarities[key] = [String(user1[key]).substring(String(user1[key]).lastIndexOf("/") + 1)];
        }
        else if(user1[key].hasOwnProperty('name'))
            if (user1[key].name == user2[key].name) {
                similarity += weight;
                similarities[key] = [user2[key].name];
            }
            else
                if (user1[key] == user2[key]) {
                    similarity += weight;
                    similarities[key] = [user2[key]];
                }

         
    }
   
	return {
		similarity: similarity, 
		similarities: JSON.stringify(similarities)
	};
}

// function compareUsers(user1, user2) {
// 	var similarity = 0
//     var similarities = {}
// 	for (var key in user1) {
// 		var weight = Math.floor(Math.random() * 5 + 1);
// 		try {
//             console.log(key)
// 			var arr1 = user1[key].data.sort(function (a, b){return a.name < b.name});
// 			var arr2 = user2[key].data.sort(function (a, b){return a.name < b.name});
//            // console.log(user2[key].paging);             
// 		}catch(exception) {
//             //console.log(key)
//            // console.log(exception)
//             if(user2[key] == undefined)
//                 continue;
            
//             if(user1[key] instanceof Array && user2[key] instanceof Array) {
//                 var arr1 = user1[key].sort(function (a, b){return a.name < b.name});
//                 var arr2 = user2[key].sort(function (a, b){return a.name < b.name});
//             }
//             else if (key === "age_range")
//                 console.log("age");
//             else if(key === "birthday")
//                 console.log("bday");
//             else if(user1[key].hasOwnProperty('name'))
//                 if (user1[key].name == user2[key].name) {
//                     similarity += weight;
//                     similarities[key] = [user2[key].name];
//                 }
//             else
//                 if (user1[key] == user2[key]) {
//                     similarity += weight;
//                     similarities[key] = [user2[key]];
//                 }
//             /*
// 			if (user1[key].name == user2[key].name) {
// 				similarity += weight;
//                 similarities[key] = [user2[key]];
// 			}*/
            
//             if(!(user1[key] instanceof Array && user2[key] instanceof Array))
//                 continue;
// 		}
        
//         var matching = []

// 		var l = 0;
// 		var r = 0;
// 		var count = 0;
// 		for (; l < arr1.length && r < arr2.length;) {
//             //console.log(arr1[l])
// 			if (arr1[l].name == arr2[r].name) {
// 				count++;
			
//                 matching.push(arr2[r].name);
//                 l++; r++;
// 			}
// 			else if (arr1[l].name < arr2[r].name) {
// 				l++;
// 			}
// 			else if (arr1[l].name > arr2[r].name) {
// 				r++;
// 			}
// 		}
        
//         if(matching.length > 0)
//             similarities[key] = matching

// 		similarity = similarity + (count * weight);
// 	}
   
// 	return {
// 		similarity: similarity, 
// 		similarities: similarities
// 	};
// }

function getUserFields(userToken, field, psid) {
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
			} else if (response.body.error) {
				console.log('Error: ', response.body.error);
			}
			r = JSON.parse(body);
			r['psid'] = psid;
			res(r);
		});
	});
}

function pairUser(user_psid, next) {
	db.getUserToken(user_psid, user_token => {
		getUserFields(user_token, fields).then(user_data => {
			getAllUsers(users => {
				if(users.length == 0) {
					next(-1, {});
				} else {
					max = -1;
					maxSimiliarities = {};
					maxUser = -1;
					var promises = users.map(user => getUserFields(user.token, fields, user.psid));
					Promise.all(promises).then(userdatas => {
						for(var userdata of userdatas) {
							var sim = compareUsers(userdata, user_data);
							if(sim.similarity > max) {
								max = sim.similarity;
								maxSimiliarities = sim.similarities;
								maxUser = userdata.psid;
							}
						}
						next(maxUser, maxSimiliarities);
					});
				}
			});
		});
	});
}


module.exports = pairUser;
