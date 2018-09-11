
// Grab the scra as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the  information on the page
      $(".card-body").append("<h5 class=card-title'" + data[i]._id + "'>" + data[i].title + "<h/5>");
    }
  });

// $(document).on("click","#new-articles", function(){
//     console.log("clicked");
//     // $.ajax({
//     //     method: "GET",
//     //     url: "/articles/" + thisId
//     //   })
// })
