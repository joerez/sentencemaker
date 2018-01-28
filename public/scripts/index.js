$(document).ready(() => {

    var socket = io.connect('');

    socket.emit('loadBoxes');
    socket.on('loadBoxes', (data) => {
      data.boxes.forEach((box) => {
        let newBox = $('.parabox.draggable.prototype').clone(true);
        newBox.children('.paratext').text(box.text);
        newBox.removeClass('prototype');
        newBox.attr('id', box._id);
        newBox.appendTo('.fridge');
        console.log(box);
        newBox.css('left', box.pos.left);
        newBox.css('top', box.pos.top);
        makeDrag(newBox);
      })
    })


    $('#subButton').on("click", function() {
      $('#inputone').val(" ");
    })



    //Making different things draggable
    let wordAdderBox = $(".wordAdder.draggable");
    makeDrag(wordAdderBox);

    let wordDeleter = $(".trash.draggable.droppable");
    makeDrag(wordDeleter);


/***Jquery UI things ***/

    $( function() {
      $( "#resizable" ).resizable();
    } );



    $( function() {
      $( "#sortable" ).sortable();
    } );

    $( function() {
      $( ".droppable" ).droppable({
        drop: function( event, ui ) {
        $( ui.draggable ).addClass( "prototype" );
        $( ui.draggable ).submit(function() {
          $( ui.draggable ).document.location.href = '/' + ui.draggable._id + '?_method=DELETE';
        })
      }
      });
    } );

/*** END of Jquery UI things ***/

    function makeDrag(box){
      $( function() {
        $(box).draggable({
          // When the user starts dragging, make sure the z-index for this
     // helper is higher than all other draggables.
     start: function ( e, ui ) {
         $( ".ui-draggable" ).not( ui.helper.css( "z-index", "1" ) )
         .css( "z-index", "0" );
       },
     drag: function (e, ui ) { //On Drag
          socket.emit('updateBoxPos', {id : e.target.id, pos : {top : $(this).css('top'), left : $(this).css('left')}});
       },

          scroll: true,
        });
      });
    }

    makeDrag(".iffy");

    $("#reveal").on("click", function() {
      $("#come").removeClass('hidden').addClass('animated fadeInDown');
    });

    $( ".parabox").mousedown(function() {
      $(this).addClass('shadowit');
      $(this).addClass('scale');
      socket.emit('mouseDownBox', {id : $(this).attr('id')});
    });

    $( ".parabox").mouseup(function() {
      $(this).removeClass('shadowit');
      $(this).removeClass('scale');
      socket.emit('mouseUpBox', {id : $(this).attr('id'),
                                 pos : {
                                        top : $(this).css('top'),
                                        left : $(this).css('left')
                                       }
                                 });
    });



    scaleIt("#wordaddbox");


    //This function makes Selectors pretty when moving.
    function scaleIt(box) {

      $(box).mousedown(function() {
        $(this).addClass('shadowit');
        $(this).addClass('scale');

      });

      $(box).mouseup(function() {
        $(this).removeClass('shadowit');
        $(this).removeClass('scale');

      });
    }

//Trash can scaling on drag
    $("#trashcan").mousedown(function() {
      $(this).addClass('scale');

    });

    $("#trashcan").mouseup(function() {
      $(this).removeClass('scale');

    });




    //Prevent lineIt form from refreshing page
    $(".lineIt").on("submit", function (e) {
      e.preventDefault();
      let pText = $('#inputone').val();
      console.log(pText);
      let newBox = $('.parabox.animated.pulse.draggable.prototype').clone(true);
      socket.emit('newBox', {text : pText, pos : {left : newBox.css('left'), top : newBox.css('top')}})
    });
    //
    // $('#subButton').click(() =>
    //
    //   //socket.emit('newBox', )
    // })

  /*  $(document).on('keydown', function(e){
        if(e.which == 68){
          $(".wordAdder").addClass('deleteit');
        });
        */

    socket.on('newBox', (data) => {
      let newBox = $('.parabox.animated.pulse.draggable.prototype').clone(true);
      newBox.children('.paratext').text(data.box.text);
      newBox.removeClass('prototype');
      newBox.attr('id', data.box._id);
      newBox.appendTo('.section2');
      makeDrag(newBox);
    })

    socket.on('mouseDownBox', (data) => {
      $('#' + data.id).addClass('shadowit scale');
    })

    socket.on('mouseUpBox', (data) => {
      $('#' + data.id).removeClass('shadowit scale');
    })

    socket.on('updateBoxPos', (data) => {
      $('#' + data.id).css('left', data.pos.left);
      $('#' + data.id).css('top', data.pos.top);
    })

    $("#addWordBtn").on("click", function() {
      $(".wordAdder").toggleClass("prototype");
    })

    $("#delWordBtn").on("click", function() {
      $("#trashcan").toggleClass("prototype");
    })


})
