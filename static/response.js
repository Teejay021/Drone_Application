  //Buttons for the camera Feed

  var globalLockedControls = true
  var arrowEnabled = true
  
  $(".theater-btn").click(function(){

    $(".stream-Overlay").toggleClass("theater");
    $(".cameraFeed").toggleClass("no-border-radius");
    $(".controls").toggleClass("fullWidth");
    

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
      
    movementSetting.LH_forward = $(".LH-forward").val().toLowerCase();
    movementSetting.LH_backward = $(".LH-backward").val().toLowerCase();
    movementSetting.RH_forward = $(".RH-forward").val().toLowerCase();
    
    

    toggleBlurEffect();
    toggleSettingsArea();
  
  });

  $('.reset-button').click(function() {

    $('.setting-form').trigger('reset'); // Trigger form reset

    //We need to get the current values of the movements
      

    movementSetting.RH_forward = "ArrowUp";
    movementSetting.RH_backward = "ArrowDown";
        
    movementSetting.LH_forward = "w";
    movementSetting.LH_backward = "s";

    movementSetting.speed = 10;
    

      

    });


  

    // Event listener for keydown event
  $(document).keydown(function(event){

    if(globalLockedControls == false){
      var movement = event.key.toLowerCase();
      sendData(movement);

      if (movement === movementSetting.RH_forward) {
        // Handle ArrowUp keydown event
        $("#right-Controller .circle4").css("transform", "translateY(-33px)");
      
        $("#right-Controller .arrowUp").attr("src", "static/images/test2.png");

      }
        
      else if (movement === movementSetting.RH_backward) {
          // Handle ArrowDown keydown event
        $("#right-Controller .circle4").css("transform", "translateY(33px)");
      
        $("#right-Controller .arrowDown").attr("src", "static/images/test2.png");
      }
      else if(movement === movementSetting.LH_forward){
        $("#left-Controller .circle4").css("transform", "translateY(-33px)");
        $("#left-Controller .arrowUp").attr("src","static/images/test2.png");
      }

      else if (movement === movementSetting.LH_backward){

        $("#left-Controller .circle4").css("transform", "translateY(33px)");
        $("#left-Controller .arrowDown").attr("src","static/images/test2.png");

      }
    }
    
  });

  $(document).keyup(function(event) {

    if (globalLockedControls == false){

      var movement = "keyup";
      sendData(movement);

      var previousMovement = event.key.toLowerCase();
    
      if (previousMovement === movementSetting.RH_forward) {
          // Handle ArrowUp and ArrowDown keyup event
          
    
        $("#right-Controller .circle4").css("transform", "translateY(0)");
        $("#right-Controller .arrowUp").attr("src","static/images/upArrow.png");
          
      }
    
      else if(previousMovement === movementSetting.RH_backward){
    
        $("#right-Controller .circle4").css("transform", "translateY(0)");
        $("#right-Controller .arrowDown").attr("src","static/images/downArrow.png");
    
      }

      else if(previousMovement === movementSetting.LH_forward){
        $("#left-Controller .circle4").css("transform", "translateY(0)");
        $("#left-Controller .arrowUp").attr("src","static/images/upArrow.png");
      }

      else if (previousMovement === movementSetting.LH_backward){

        $("#left-Controller .circle4").css("transform", "translateY(0)");
        $("#left-Controller .arrowDown").attr("src","static/images/downArrow.png");

      }
    }
  });
  

  //Moblie code for when user touches the movement keys


  $(document).ready(function() {

    
    // Define a function that encapsulates the behavior for touch controls.
    function handleController(controller, circleSlider, arrowUp, arrowDown) {
        let isDragging = false;   // Indicates if dragging is currently happening
        let startY = 0;          // Start position of the touch event

        // On touch start of the circle slider, record the starting Y-position
        $(circleSlider).on('touchstart', function(e) {
            if (e.originalEvent.targetTouches.length === 1) {
                startY = e.originalEvent.targetTouches[0].clientY;
                isDragging = true;
            }
        });

        // Handle the movement of the circle slider based on touch movements
        $(controller).on('touchmove', function(e) {
            if (!isDragging) return;  // If we aren't dragging, skip

            const currentY = e.originalEvent.targetTouches[0].clientY;
            const diffY = currentY - startY;

            // Define the boundaries of the controller
            const controllerTop = $(controller).offset().top;
            const controllerBottom = controllerTop + $(controller).height();
            const circleSliderTop = $(circleSlider).offset().top;
            const circleSliderHeight = $(circleSlider).height();

            // Allow for some margin beyond the exact boundary for a smoother UX
            const margin = 0.1 * circleSliderHeight; // Allowing 10% extra movement
            const maxTranslate = controllerBottom - circleSliderTop - circleSliderHeight + margin;
            const minTranslate = controllerTop - circleSliderTop - margin;

            // Calculate the new Y-position for the slider
            let newTranslateY = diffY;
            newTranslateY = Math.min(newTranslateY, maxTranslate);
            newTranslateY = Math.max(newTranslateY, minTranslate);

            // Apply the movement to the slider
            $(circleSlider).css('transform', `translateY(${newTranslateY}px)`);

            // Check the movement direction and update the arrow images accordingly

            if (newTranslateY > 0) {
              $(arrowDown).attr("src","static/images/white-downArrow.png"); /*New down arrow.png*/
              $(arrowUp).attr("src","static/images/upArrow.png");
            } 
            
            else {
              $(arrowDown).attr("src","static/images/downArrow.png"); 
              $(arrowUp).attr("src","static/images/white-upArrow.png"); /*New up arrow.png*/
          }
        });

        // Once the touch ends, reset the slider's position and the arrow images
        $(controller).on('touchend', function(e) {
            $(circleSlider).css('transform', 'translateY(0px)');
            $(arrowUp).attr("src","static/images/upArrow.png");
            $(arrowDown).attr("src","static/images/downArrow.png");
            isDragging = false;
        });
    }

    // Invoke the function for both left and right controllers
    handleController("#left-Controller", "#leftCircleSlider", ".arrowUp:eq(0)", ".arrowDown:eq(0)");
    handleController("#right-Controller", "#rightCircleSlider", ".arrowUp:eq(1)", ".arrowDown:eq(1)");

  });


  

  //Prevent user from scrolling when using the arrows as controls by activating/deacitvating the lock

  let isClosedLock = true;

  const opened_lock = "open-lock.png";
  const closed_lock = "close-lock.png";

  $(".lock-container").click(function(event){

    console.log("lock is working")

    event.preventDefault();

    globalLockedControls = !globalLockedControls

    arrowEnabled = !arrowEnabled

    
    if(isClosedLock){

      $(".lock").attr("src","static/images/"+opened_lock);
      disableScroll();
      
    }
    else{

      $(".lock").attr("src","static/images/"+closed_lock);
      enableScroll();

    }

    isClosedLock = !isClosedLock;
  });

  $(document).on("keydown",function(event){

    if((event.key == "ArrowUp" || event.key == "ArrowDown") && arrowEnabled == false){

        event.preventDefault()
    }
  });

  function disableScroll() {
    $('html, body').css('overflow', 'hidden');
};

function enableScroll() {
  $('html, body').css('overflow', 'auto');
};





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

