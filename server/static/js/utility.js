$(document).ready(function(){
  $(".toggle").click(function(){
    console.log("CLICK CLACK");
    $(this).find(".hide-comment").fadeToggle();
  });
});