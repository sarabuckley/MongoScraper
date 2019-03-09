// Scrape Button
$(document).on("click", "#scrapeButton", function () {

  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function (data) {
    alert(data + " new articles scraped!");
    location.reload();
  })
});

// List Saved Articles 
$(document).on("click", "#savedButton", function () {
  console.log("#saved");
  $.ajax({
    method: "GET",
    url: "/saved"
  }).then(function (data) {
    location.href = "/saved";
    console.log(data);
  })
});

// Save Article Button
$(document).on("click", "#save", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/save/" + thisId,
  }).then(function (data) {
    console.log(data);
  })
});

// First retrieve any existing Notes
$('#myModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);                // Button that triggered the modal
  console.log("button: " + JSON.stringify(button));   // Extract info from data-* attributes
  var thisId = button.data("id");
  console.log("thisId: " + thisId);

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the modal
    .then(function (data) {
      if (!data.note) {
        console.log("No notes!");
      } else {
        console.log("data: " + JSON.stringify(data));
        console.log("body: " + JSON.stringify(data.note.body));
        var notes = JSON.stringify(data.note.body);
        $("#modalNote").val(data.note.body);
      }
    });

    // If you click the saveNote button in the Modal
  $('#saveNote').click(function () {
  //console.log("savenote: " + JSON.stringify(modalNote));
  //var thisId = $("#modalNote").attr("data-id");
  var thisNote = $("#modalNote").val();
  console.log("saveNote thisId: " + thisId);
  console.log("saveNote thisNote: " + thisNote);
  //$('#myModal').modal('hide');

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      body: thisNote
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log("after AJAX articles note " + data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the note
  $("#modalNote").val("");
});
});


// Delete from Saved Button
$(document).on("click", "#deleteNotes", function () {
  var thisId = $(this).attr("data-id");
  console.log("delete: " + thisId)
  $.ajax({
    method: "POST",
    url: "/delete/" + thisId,
  }).then(function (data) {
    console.log(data);
  })
});

function isEmpty(obj) {
  console.log("isEmpty function");
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  console.log("True - is empty")
  return true;
}