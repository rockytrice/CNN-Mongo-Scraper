
// Grab the scra as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the  information on the page
      $(".card").append("<div class='card-header' data-id='" + data[i]._id + "'>"  + "<a class='article-link' href='" + data[i].link + "'>" + data[i].title + "</a>" +"</div>" + "<br />" + "<div class='card-body'>" + data[i].summary + "</div>" + "<br />");
    }
  });

// $(document).on("click","#new-articles", function(){
//     console.log("clicked");
//     // $.ajax({
//     //     method: "GET",
//     //     url: "/articles/" + thisId
//     //   })
// })
