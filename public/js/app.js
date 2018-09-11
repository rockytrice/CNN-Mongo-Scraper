function getResults() {
// Grab the scra as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the  information on the page
      $(".article container").append("<div class= card-header data-id='" + "<a class='article-link' href='" + data[i].link  + "'>" + data[i].title + "</a>" + "<br />" + "<div class = card-body" + "<p class = card-text" + data[i].summary + "</div>" + "</div>");
    }
  });
}
getResults();

