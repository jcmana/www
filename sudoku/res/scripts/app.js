function Storage(sudoku)
{
	var self = this;
	
	/* MEMBERS */
	self.__sudoku = null;

	/* METHODDS */
	self.save = function()
	{
		var serializedBoard = [];

		for (row = 0; row < 9; ++row)
		{
			serializedBoard[row] = [];

			for (col = 0; col < 9; ++col)
			{
				var serializedField = {};

				var field = self.__sudoku.board[row][col];

				if (field != undefined)
				{
					serializedField.number = field.getNumber();
					serializedField.hint_a = field.getHintA();
					serializedField.hint_b = field.getHintB();
				}

				serializedBoard[row][col] = serializedField;
			}
		}

		localStorage.setItem("board", JSON.stringify(serializedBoard));
	};

	self.load = function()
	{
		var serializedBoard = JSON.parse(localStorage.getItem("board"));

		for (row = 0; row < 9; ++row)
		{
			for (col = 0; col < 9; ++col)
			{
				var field = self.__sudoku.board[row][col];
				if (field == undefined)
				{
					//console.error("Sudoku board not initialized correctly.");
					continue;
				}

				field.setNumber(serializedBoard[row][col].number);
				field.setHintA(serializedBoard[row][col].hint_a);
				field.setHintB(serializedBoard[row][col].hint_b);
			}
		}
	};

	self.clear = function()
	{
		localStorage.removeItem("board");
	};

	self.onUnload = function(e)
	{
		self.save();
	};

	self.__initialize = function()
	{
		self.__sudoku = sudoku;

		// Automatically save progress on page unload
		$(window).on("unload", self.onUnload);

		// Automatically load previous progress
		self.load();

		// debug
		$("#save").on("click", self.save);
		$("#load").on("click", self.load);
	};

	/* CONSTRUCTOR */
	self.__initialize();
}

function Sudoku(el)
{
	var self = this;

	/* MEMBERS */
	self.__el = null;
	self.board = null;

	/* METHODDS */
	self.clear = function()
	{
		for (row = 0; row < 9; ++row)
		{
			for (col = 0; col < 9; ++col)
			{
				var field = self.board[row][col];
				if (field == undefined)
				{
					console.error("Sudoku board was not initialized correctly.");
					continue;
				}

				field.clear();
			}
		}
	};

	self.__initialize = function()
	{
		self.board = [];
		self.__el = el;
		self.__initializeBoard();

		// Event handlers
		$(window).on("unload", self.onUnload);
	};

	self.__initializeBoard = function()
	{
		for (row = 0; row < 9; ++row)
		{
			self.board[row] = [];

			for (col = 0; col < 9; ++col)
			{
				var field_id = String(row) + String(col);
				var field_el = $("#sudoku #field_" + field_id);

				if (field_el.length == 0)
				{
					//console.error("Couldn't find field with ID " + field_id);
					continue;
				}

				self.board[row][col] = new Field(field_el);
			}
		}
	};

	/* CONSTRUCTOR */
	self.__initialize();
}

function Field(el)
{
	var self = this;

	/* METHODDS */
	self.clear = function()
	{
		self.setNumber("");
		self.setHintA("");
		self.setHintB("");
	}

	self.getNumber = function()
	{
		return $("input.number", self.__el).val();
	};
	self.getHintA = function()
	{
		return $("input.hint_a", self.__el).val();
	};
 	self.getHintB = function()
	{
		return $("input.hint_b", self.__el).val();
	};

	self.setNumber = function(val)
	{
		$("input.number", self.__el).val(val);
	};
	self.setHintA = function(val)
	{
		$("input.hint_a", self.__el).val(val);
	};
	self.setHintB = function(val)
	{
		$("input.hint_b", self.__el).val(val);
	};

	self.onKeydown = function(e)
	{
		console.log(e.target.parentNode.id);
	};

	self.__initialize = function()
	{
		self.__el = el;
		
		/* EVENT HANDLERS */
		self.__el.on("keydown", self.onKeydown);
	}

	/* CONSTRUCTOR */
	self.__initialize();
}


$(function()
{
	var sudoku = new Sudoku();
	var storage = new Storage(sudoku);

	$("#reset").on("click", function(e)
	{
		sudoku.clear();
		storage.clear();
		//location.reload();
	});

	$("#toggleHintA").on("click", function(e)
	{
		var elements = $("table#sudoku input.hint_a");
		var visibility = elements.css("visibility");
		if (visibility === "visible")
		{
			elements.css({"visibility": "hidden"});
			$(this).addClass("deactivated");
		}
		else
		{
			elements.css({"visibility": "visible"});
			$(this).removeClass("deactivated");
		}
	});

	$("#toggleHintB").on("click", function(e)
	{
		var elements = $("table#sudoku input.hint_b");
		var visibility = elements.css("visibility");
		if (visibility === "visible")
		{
			elements.css({"visibility": "hidden"});
			$(this).addClass("deactivated");
		}
		else
		{
			elements.css({"visibility": "visible"});
			$(this).removeClass("deactivated");
		}
	});
});