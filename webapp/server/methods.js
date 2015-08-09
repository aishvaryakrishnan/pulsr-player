Meteor.methods({
	setCurrentSong: function (roomID) {
		console.log(roomID);
		var newCurrentSong = Songs.findOne({room_id: roomID}, {sort: {like_score: -1}});
		Rooms.update(roomID, {"$set": {current_song_id: newCurrentSong._id}});
	},
});