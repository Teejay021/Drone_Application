  //Buttons for the camera Feed
  
  $(".theater-btn").click(function(){

    $(".stream-Overlay").toggleClass("theater");
    $(".cameraFeed").toggleClass("no-border-radius");

  });


  $(".fullscreen-btn").click(function() {
    if (document.fullscreenElement == null) {
      $(".stream-Overlay")[0].requestFullscreen(); // Get the DOM element from the jQuery collection
      

    } else {
      document.exitFullscreen();
      
    }
  });

  $(document).on("fullscreenchange", function() {
    $(".stream-Overlay").removeClass("fullscreen");
  });

  $(".capture-photo").click(function(event) {
    event.preventDefault();

    console.log("ok");

    $.ajax({
        type: "POST",
        url: "/capture_photo",
        success: function(response) {
            if (response.image) {
                $('#capturedImage').attr('src', 'data:image/jpeg;base64,' + response.image);
            } else {
                console.error('Failed to capture image:', response.error);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error capturing picture:", error);
        }
    });
  });

  
  
  
  
  const movementSetting = {
    //LH = left hand side motor,  RH = right hand side motor
    RH_forward : 'ArrowUp',

    RH_backward: 'ArrowDown',

    LH_forward : 'w',

    LH_backward: 's',

    speed: 10


  }
  
  


 

  $('.submit-button').click(function(event){

    event.preventDefault();

    console.log("Hello");
  
    movementSetting.speed = $('.speed').val();
  
   var gholi = $('.speed').val();

   console.log(gholi);
      
    movementSetting.LH_forward = $(".LH-forward").val();
    movementSetting.LH_backward = $(".LH-backward").val();
    movementSetting.RH_forward = $(".RH-forward").val();
    console.log(movementSetting.RH_forward);
    movementSetting.RH_backward = $(".RH-backward").val();
    
    

    toggleBlurEffect();
    toggleSettingsArea();
  
  });

  $('.reset-button').click(function() {

    $('.setting-form').trigger('reset'); // Trigger form reset

    //We need to get the current values of the movements
      

    movementSetting.RH_forward = "ArrowUp";
    movementSetting.RH_backward = "ArrowDown";
        
    movementSetting.LH_forward = "W";
    movementSetting.LH_backward = "S";

    movementSetting.speed = 10;
    

      

    });


  

    // Event listener for keydown event
  $(document).keydown(function(event){

    var movement = event.key;
    sendData(movement);

    if (event.key === movementSetting.RH_forward) {
      // Handle ArrowUp keydown event
      $("#right-Controller .circle4").css("transform", "translateY(-33px)");
    
      $("#right-Controller .arrowUp").attr("src", "static/images/test2.png");

    }
      
    else if (event.key === movementSetting.RH_backward) {
        // Handle ArrowDown keydown event
      $("#right-Controller .circle4").css("transform", "translateY(33px)");
    
      $("#right-Controller .arrowDown").attr("src", "static/images/test2.png");
    }
    else if(event.key === movementSetting.LH_forward){
      $("#left-Controller .circle4").css("transform", "translateY(-33px)");
      $("#left-Controller .arrowUp").attr("src","static/images/test2.png");
    }

    else if (event.key === movementSetting.LH_backward){

      $("#left-Controller .circle4").css("transform", "translateY(33px)");
      $("#left-Controller .arrowDown").attr("src","static/images/test2.png");

    }
    
  });

  $(document).keyup(function(event) {

    var movement = "keyup";
    sendData(movement);
  
    if (event.key === movementSetting.RH_forward) {
        // Handle ArrowUp and ArrowDown keyup event
        
  
      $("#right-Controller .circle4").css("transform", "translateY(0)");
      $("#right-Controller .arrowUp").attr("src","static/images/upArrow.png");
        
    }
  
    else if(event.key === movementSetting.RH_backward){
  
      $("#right-Controller .circle4").css("transform", "translateY(0)");
      $("#right-Controller .arrowDown").attr("src","static/images/downArrow.png");
  
    }

    else if(event.key === movementSetting.LH_forward){
      $("#left-Controller .circle4").css("transform", "translateY(0)");
      $("#left-Controller .arrowUp").attr("src","static/images/upArrow.png");
    }

    else if (event.key === movementSetting.LH_backward){

      $("#left-Controller .circle4").css("transform", "translateY(0)");
      $("#left-Controller .arrowDown").attr("src","static/images/downArrow.png");

    }
  });


  const open_lock = "open-lock.png";
  const closed_lock = "lock.png";

  let isOpenLock = true;

  $(".lock-container").click(function(event){

    event.preventDefault();
    
    if(isOpenLock){
      $(".lock").attr("src","static/images/"+closed_lock);

    }
    else{
      $(".lock").attr("src","static/images/"+open_lock);

    }

    isOpenLock = !isOpenLock;
  })





// // Event listener for 'w' keydown event
// $(document).keydown(function(event) {
//   if (event.key === "w") {
//     $(".second-gear-shift").css("transform", "translateY(-33px)");
    

    
//   }else if (event.key === "s") {
//     // Handle ArrowDown keydown event
//     $(".second-gear-shift").css("transform", "translateY(33px)");
    
//   }
// });

// // Event listener for 's' keydown event
// $(document).keyup(function(event){
//   if (event.key === "s" || event.key === "w") {
//     $(".second-gear-shift").css("transform", "translateY(0)");
    

//   }
// });

// var blurClick = document.getElementById("blurTrigger");

// $(blurClick).click(function(){

//   $(".parent-div").toggleClass("blur-effect");

//   $(".setting-area").toggleClass("active");



  

// });

// Function to toggle the blur effect on the parent divs
function toggleBlurEffect() {
  $(".parent-div").toggleClass("blur-effect"); // Toggle the blur-effect class on the stream overlay div
}

// Function to toggle the settings area
function toggleSettingsArea() {
  $(".setting-area").toggle(); // Toggle the active class to show/hide the settings area
  // $(".setting-area").toggleClass("setting-display");
}

// Event listener for the button click to activate the blur effect and show/hide the settings area
$("#blurTrigger").click(function(event) {
  event.preventDefault(); // Prevent default link behavior (prevents scrolling to the top)

  toggleBlurEffect(); // Activate the blur effect on the stream overlay div
  toggleSettingsArea(); // Show/hide the settings area
});

// $(".cameraFeed, .fullscreen-button").hover(function(){

//   $(".fullscreen-button").toggleClass("hide");
// });




function sendData(movement) {
  const data = {
    'movement': movement
  };

  fetch('/process_movement', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // Pass the data object here, not just movement
  })
  .then(response => response.json())
  .then(data => {
    console.log(data); // Process the received data
  })
  .catch(error => {
    console.error('Error:', error);
  });
}




