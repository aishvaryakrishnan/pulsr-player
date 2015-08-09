numberWithCommas = function(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

Template.room.onCreated(function() {

	var instance = this;

	instance.currentlyPlayingSong = new ReactiveVar("");

	var yt = new YTPlayer("player", {
		height: '390',
		width: '640'
	});

	this.autorun(function() {
		var data = Template.currentData(self.view);
		if (data) {
			var songID = data.room.current_song_id;
			if (songID && songID != instance.currentlyPlayingSong.get()) {
				var yt_id = Songs.findOne(songID).video_id;
				console.log(yt_id);
				if (yt.ready()) {
					var startSeconds = (new Date().getTime() - data.room.current_song_started.getTime()) / 1000;
					yt.player.loadVideoById(yt_id, startSeconds);
					yt.player.addEventListener('onStateChange', function(e) {
						if (e.data == YT.PlayerState.ENDED) {
							Songs.remove(songID);
							Meteor.call('setCurrentSong', instance.data.room._id);
						}
					});
					instance.currentlyPlayingSong.set(songID);
				}
			}
		}
	});
});

Template.room.helpers({
	searchResults: function () {
		return searchResults.get();
	},
	votingSongs: function () {
		return Songs.find({played: false});
	},
});

Template.searchResult.events({
	'click .listItem': function(event, instance) {
		event.preventDefault();
		Meteor.call("addSong", instance.data,
				instance.parentTemplate(1).data.room._id);
	}
});

Template.room.events({
	"click #startButton": function(event, instance) {
		Meteor.call('setCurrentSong', instance.data.room._id);
	},
	'click .searchButton': function() {
		window.searchSongs();
	},
	'keypress .searchBar': function(event) {
		if (event.keyCode == 13) {
			window.searchSongs();
		}
	},
});

Template.songItem.events({
	'click .upvote': function (event, instance) {
		var data = instance.data;
		if (data.users_who_liked.indexOf(Meteor.userId()) > -1) {
			Meteor.call("unupvote", data._id);
		} else {
			Meteor.call("upvote", data._id);
		}
	},
	'click .downvote': function (event, instance) {
		var data = instance.data;
		if (data.users_who_disliked.indexOf(Meteor.userId()) > -1) {
			Meteor.call("undownvote", data._id);
		} else {
			Meteor.call("downvote", data._id);
		}
	},
});
