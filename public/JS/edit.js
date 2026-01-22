
  
console.log("edit.js loaded");
$(function () { 
 
  $("#editButton").on("click",(function () {
    console.log("edit pressed");
    $("#hiddenForm").removeClass("hidden");
    // Read existing post content
    var fileName = $("#fileName").text().trim();
    var title = $("#Title").text().trim();
    var text = $("#Text").text().trim();

    // Populate form fields
    $("#nameOfFile").val(fileName);
    $("#nameOfTitle").val(title);
    $("#fullBody").val(text);

    // Show the hidden form
    $("#hiddenForm").css("visibility", "visible");
    // or better UX:
    // $("#hiddenForm").slideDown();
  }));
});