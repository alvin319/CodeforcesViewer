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

function addButton(current) {
	return '<a class="grey darken-1 white-text btn waves-effect waves-green" href="' + current + '">' + 'Click Here' + '</a>';
}

function addDisabledButton() {
	return '<a class="grey darken-1 white-text btn disabled">' + 'N/A' + '</a>';
}

function addTD(current) {
	return '<td>' + current + '</td>';
}

function addTableHeader() {
	$('#table-data').append('<tr>');
}

function addTableFooter() {
	$('#table-data').append('</tr>');
}

function addTableColumn(data) {
	$('#table-data').append(addTD(data));
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
	var problemHeader = 'http://codeforces.com/problemset/problem/'
	var gymHeader = 'http://codeforces.com/gym/'

	var data = response.result;
	for (var i = 0; i < data.length; i++) {
		if(data[i].verdict === 'OK') {
			var contestID = data[i].problem.contestId;
			var contestIndex = data[i].problem.index;
			var problemName = contestID + contestIndex + " " + data[i].problem.name;
			var creationTime = data[i].creationTimeSeconds;
			var language = data[i].programmingLanguage;
			var problemTag = formatTags(data[i].problem.tags);
			var contestURL = problemHeader + contestID + '/' + contestIndex;
			var submissionURL = 'http://codeforces.com/contest/' + contestID + '/submission/' + data[i].id;
			var performanceTime = data[i].timeConsumedMillis + 'ms';

			var dateObject = new Date(0);
			dateObject.setUTCSeconds(creationTime);
			var date = (dateObject.getMonth() + 1) + '/' + dateObject.getDate() + '/' + dateObject.getFullYear();

			addTableHeader();
			addTableColumn(date);
			addTableColumn(problemName);
			addTableColumn(problemTag);
			addTableColumn(language);
			addTableColumn(performanceTime);
			if(data[i].contestId >= 100000) /* Gym */ {
				var gymURL = gymHeader + contestID;
				addTableColumn(addButton(gymURL));
				addTableColumn(addDisabledButton());
			} else {
				addTableColumn(addButton(contestURL));
				addTableColumn(addButton(submissionURL));
			}
			addTableFooter();
		}
	}
	$('#table').show();
}
