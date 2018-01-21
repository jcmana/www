function BookmarkHolder(element, source)
{
	/* MEMBERS */
	var self = this;

	self.__source = source;
	self.__element = element;
	self.__bookmark_json = null;
	self.__bookmark_list = [];

	/* METHODS */	

	// Loads bookmars definition from JSON file
	self.__from_json = function(json)
	{
		// Initialize Bookmar two-dimensional array
		self.__bookmark_list = [];

		// Create list of Bookmark hodlder objects
		for (var row in self.__bookmark_json)
		{
			// Initialize row array
			self.__bookmark_list[row] = [];

			for (var col in self.__bookmark_json[row])
			{
				var bookmark_json = self.__bookmark_json[row][col];
	
				// Create Bookmark object
				var bookmark = new Bookmark(bookmark_json.name, bookmark_json.href, bookmark_json.icon);
	
				// Store new Bookmark object
				self.__bookmark_list[row][col] = bookmark;
			}
		}

		// Create all Bookmark elements
		for (var row in self.__bookmark_list)
		{
			// Prepare table row for list of Bookmarks
			var bookmark_table_row = $("<tr></tr>");
			var bookmark_table_col = null;

			for (col in self.__bookmark_list[row])
			{
				// Prepare table column for Bookmark element
				bookmark_table_col = $("<td></td>");

				// Create Bookmark element
				self.__bookmark_list[row][col].create_element(bookmark_table_col);

				// Append table col to the row
				bookmark_table_row.append(bookmark_table_col);
			}

			// Append table row to the table
			self.__element.append(bookmark_table_row);
		}
	}


	/* INITIALIZATION */

	// Load bookmarks source JSON file
	$.getJSON(self.__source, function(json)
	{
		// Store bookmarks JSON definition
		self.__bookmark_json = json;

		// Create all bookmarks from loaded JSON
		self.__from_json(self.__bookmark_json);
	});
}

function Bookmark(name, href, icon)
{
	/* MEMBERS */
	var self = this;

	self.__name = name;
	self.__href = href;
	self.__icon = icon;

	self.__element = null;
	self.__element_event_click = null;
	self.__element_event_mouseover = null;
	self.__element_event_mouseout = null;

	/* METHODS */

	// Create and write new HTML element
	self.create_element = function(parent)
	{
		// Create element content
		self.__element = $("<a class=\"bookmark\" href=\"" + self.__href + "\"></a>");
		self.__element.append("<img class=\"bookmark\" src=\"icons/" + self.__icon + "\">");
		self.__element.append("<span class=\"bookmark\">" + self.__name + "</a>");

		// Add event handlers
		self.__element_event_click = self.__element.on("click", self.__handler_click);
    	self.__element_onmouseover = self.__element.on("mouseover", self.__handler_mouseover);
		self.__element_onmouseout = self.__element.on("mouseout", self.__handler_mouseout);

		parent.append(self.__element);
	}

	// Destroy HTML element
	self.destroy_element = function()
	{
		self.__element.remove();
	}

	// Handler for 'click' event
	self.__handler_click= function(event)
	{
		
	}

	// Handler for 'mouseover' event
	self.__handler_mouseover = function(event)
	{
		$(".bookmark").css({"opacity":1.0});
		$(".bookmark", this).css({"opacity":0.6});
	}

	// Handler for 'mosueout' event 
	self.__handler_mouseout = function(event)
	{
		$(".bookmark", this).css({"opacity":1.0});
	}

	/* INITIALIZATION */
}

$(document).ready(function()
{
	var bookmarkHolder = new BookmarkHolder($("div#content"), "bookmarks.json");
});