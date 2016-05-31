String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

$(document).ready(function() {
	var codeforces_url = 'http://codeforces.com/api/user.status?handle=';
	var parse_reponse = '&jsonp=parseResponse';
	$('#table').hide();
	$('#error').hide();

	$("#user_name").keypress(function(e) {
	    if (e.keyCode == 13) {
	        e.preventDefault();
	        $("#submit-button").click();
	    }
	});

	$('#submit-button').click(function(e) {
		e.preventDefault();
		$('#table-data').html('');
		var user_name = $('#user_name').val();

		$.ajax({
		url: codeforces_url + user_name + parse_reponse,
		dataType: 'JSONP',
		jsonp: false,
		error: function(xhr, textStatus, errorThrown) {
			if(textStatus == 'error') {
				$('#table').hide();
				$('#error').show();
			} else {
				$('#error').hide();
			}
		}
		});
	});	
});

function addButtonHREF(current) {
	return '<a class="waves-effect waves-light btn" href="' + current + '">' + 'Click Here' + '</a>';
}

function addTD(current) {
	return '<td>' + current + '</td>';
}

function formatTags(array) {
	var formattedString = "";
	if(array.length == 0) {
		return "No tags";
	}
	for (var i = 0; i < array.length; i++) {
		if(i == 0) {
			formattedString += array[i].capitalize();
		} else {
			formattedString += ", " + array[i].capitalize();
		}
	}
	return formattedString;
}

function parseResponse(response) {
	var problemURL = 'http://codeforces.com/problemset/problem/'
	var data = response.result;
	for (var i = 0; i < data.length; i++) {
		if(data[i].verdict === 'OK') {
			var contestID = data[i].problem.contestId;
			var contestIndex = data[i].problem.index;
			var problemName = contestID + contestIndex + " " + data[i].problem.name;
			var creationTime = data[i].creationTimeSeconds;
			var language = data[i].programmingLanguage;
			var problemTag = data[i].problem.tags;
			problemTag = formatTags(problemTag);
			var contestURL = problemURL + contestID + '/' + contestIndex;

			var dateObject = new Date(0);
			dateObject.setUTCSeconds(creationTime);
			var date = (dateObject.getMonth() + 1) + '/' + dateObject.getDate() + '/' + dateObject.getFullYear();

			$('#table-data').append('<tr>');
			$('#table-data').append(addTD(date));
			$('#table-data').append(addTD(problemName));
			$('#table-data').append(addTD(problemTag));
			$('#table-data').append(addTD(language));
			$('#table-data').append(addTD(addButtonHREF(contestURL)));
			$('#table-data').append('</tr>');
		}
	}
	$('#table').show();
}
