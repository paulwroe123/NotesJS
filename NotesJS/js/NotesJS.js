(function($){
	
 	$.NotesJS = function(el,options){
        
        // Avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("NotesJS",base);
        
        //	Initialize
        base.init = function(){

        	//	Store extended options
            base.options = $.extend({},$.NotesJS.defaultOptions,options);
          	
            //	Create a note when target element
            //	is clicked/touched
            base.$el.on("click touch",function(event){
            	//	Create a note
            	base.createNote(event.target);
            });

        };
        
        //	Function to Delete/Remove a note
        //	from DOM.
        base.deleteNote = function(note){
          
        	//	Check if a confirmation box has been
        	//	opted for before deleting a note
          	if(base.options.confirmDelete){
            	
            	//	Confirm if note should be deleted/or not
            	//	Store user's response in variable
            	var areYouSure = confirm("Are you sure you want to delete this note?");
            	
            	//	Check response from confirmation box
            	if(areYouSure){
              		
              		//	Remove note from DOM
              		note.parent().remove(); 
            	}
          	}else{
          		//	Remove note from DOM
            	note.parent().remove();
          	}
        },

        //	Function to create a note - build
        //	html elements, assign classes, properties and
        //	add functionality.
        base.createNote = function(target){
         	
         	//	Create HTML required for a note
         	var note = $("<div class='NotesJS-note'></div>");    

         	//	Set CSS styling for note
          	note.css({
            	'position' : 'absolute',
            	'top' : '100px',
            	'left' : '100px',
            	"background-color" : base.options.color
          	});

          	//	Check options for whether user
          	//	has opted to insert the text contained
          	//	within the target element
          	if(base.options.insertTargetText){
            	//	Create note content, including target's text
            	note.append('<div class="NotesJS-note-text" contentEditable="true">'+$(target).text()+'</div>');
          	}else{
          		//	Create note text, including default text
            	note.append('<div class="NotesJS-note-text" contentEditable="true">'+base.options.defaultText+'</div>');
          	}

          	//	Wrap contents of note with resizable hook element
          	note.contents().wrap("<div class='NotesJS-resize'></div>");
      		
      		//	Append draggable hook element to note
          	note.append("<div class='NotesJS-drag'></div>"); 
      		
      		//	Append delete element
          	note.append("<div class='NotesJS-delete'></div>");

          	//	Show/Hide delete button
          	//	when note is hovered/hoever out
          	note.hover(function(){
            	//	Show delete button
            	$(this).find(".NotesJS-delete").css({"visibility" : "visible"});
          	},function(){
          		//	Hide delete button
           		$(this).find(".NotesJS-delete").css({"visibility" : "hidden"});
          	});

          	//	Delete note when dele button clicked/touched
          	note.find(".NotesJS-delete").on("click touch", function(){
            	//	Delete note
            	base.deleteNote($(this));
          	});

          	//	Add resizable functionality to note
          	note.find(".NotesJS-resize").resizable({
            	
            	//	When note is being resized...	
            	resize : function(){  
              		
              		//	Adjust width of note when resizing
              		$(this).parent().css({
                		"width" : $(this).width()
              		});

              		//	Adjust height of note when resizing
              		$(this).parent().css({
                		"height" : $(this).height()
               		});

            	},
          	});  

          	//	Set initial value for 'z-index'
          	var z_index = 100;
          	
          	//	Add draggable functionality to note
          	note.draggable({
            	
            	//	Set handle for dragging
            	handle : note.find(".NotesJS-drag"),
            	
            	//	Set containment area to body element
            	containment : $("body"),
            	
            	//	When dragging starts...
            	start : function(){
            		//	Set 'z-index' to appear above all other notes
              		$(this).css({'z-index' : z_index++});
            	}
          	});

          	//	Append newly created note to body
          	$("body").append(note);
        };
        
        // Run initializer
        base.init();
    };
    
    //	Declare default options
    $.NotesJS.defaultOptions = {
      
     	//	Colour of a note
     	color : '#feed56',
      	
      	//	Option to use target's text inside note
     	insertTargetText : false,

     	//	Default text for notes
      	defaultText : "Hello, NotesJS is awesome!",
      	
      	//	Ask to confirm before deleting note
      	confirmDelete : false
    };
    
    $.fn.NotesJS = function(options){
        return this.each(function(){
          (new $.NotesJS(this,options));
        });
    };
    
})(jQuery);