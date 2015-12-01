$(document).on('DOMContentLoaded', function() {
  for(var i = 1; i <= 80; i++) {
    $('#notes-table').append("<tr><td>" + String(i) + "</td><td></td><td></td></tr>")    
  }
});

