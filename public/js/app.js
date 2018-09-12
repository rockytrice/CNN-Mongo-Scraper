// Grab the scra as a json
$.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the  information on the page
        $(".card").append("<div class='card-header' data-id='" + data[i]._id + "'>" + "<a class='article-link' href='" + data[i].link + "'>" + data[i].title + "</a>" + "</div>" + "<br />" + "<div class='card-body'>" + data[i].summary + "</div>" + "<button type='button' class='btn btn-primary id='save-article'>Save Article</button>" + "<br />");
    }
});

// $(document).on("click","#new-articles", function(){
//     console.log("clicked");
//     // $.ajax({
//     //     method: "GET",
//     //     url: "/articles/" + thisId
//     //   })
// })



// When user clicks the delete button for a note
$(document).on("click", ".delete", function () {
    // Save the p tag that encloses the button
    var selected = $(this).parent();
    // Make an AJAX GET request to delete the specific note
    // this uses the data-id of the p-tag, which is linked to the specific note
    $.ajax({
        type: "GET",
        url: "/delete/" + selected.attr("data-id"),

        // On successful call
        success: function (response) {
            // Remove the p-tag from the DOM
            selected.remove();
            // Clear the note and title inputs
            $("#note").val("");
            $("#title").val("");
            // Make sure the #action-button is submit (in case it's update)
            $("#action-button").html("<button id='make-new'>Submit</button>");
        }
    });
});

// When the #clear-all button is pressed
$(document).on("click", "#clear-all", function () {
    // Make an AJAX GET request to delete the articles from the db
    // console.log("clicked");
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/clearall",
        // On a successful call, clear the #results section
        success: function (response) {
            $(".card").empty();
        }
    });
});

$(document).on("click", "#new-scrape", function () {
    console.log("clicked");
    $.ajax({
            method: "GET",
            url: "/scrape"
        })
        .then(function (data) {
            window.location.reload();
        })
        .catch(function (err) {
            res.json(err);
        })
});
$(document).on("click", ".btn btn-primary", function () {
    console.log("clicked");
    var savedArticle = $(this).data();
    savedArticle.saved = true;
    $.ajax({
        method: 'POST',
        url: "/articles/:id" + savedArticle.id,
        data: savedArticle
    }).then(function(data) {
        console.log(data);
    });
    $(this).parents('.card').remove();
});