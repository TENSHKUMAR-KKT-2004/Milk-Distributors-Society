function openNav() {
    document.getElementById("mobile-sidebar").style.right = "0";
    var element = document.getElementById("overlay");
    element.classList.add("overlay");
   
  }
  
  function closeNav() {
    document.getElementById("mobile-sidebar").style.right = "-75%";
   var element = document.getElementById("overlay");
    element.classList.remove("overlay");
  }
  