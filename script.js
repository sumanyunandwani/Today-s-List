/*
	Using Modular Pattern and Classes concept
*/ 
var myModule = (function()
{
	var newItem = [];			//Contains all the items.
	var o = 0;					//Show the status i.e. All, Pending, Completed, Deleted.
	
	//Item Class 

	var Item = function(text)
	{
		this.mainValue=text;					//Item's value is in this variable.
		this.setStatus = function(status)		//To change the status of the item.
		{
			this.status = status;				//Status : 0-Pending, 1-Completed, 2-Deleted, 3-Removed Permanently.
		}
		this.setHtmlValue = function()						//Setting the html value on the basis of status.
		{
			switch(this.status)
			{
				case 0:
					this.htmlValue="&emsp;&emsp;"+this.mainValue;
					break;
				case 1:
					this.htmlValue="&emsp;&emsp;<del>"+this.mainValue+"</del>";
					break;
				case 2:
					this.htmlValue="&emsp;&emsp;"+this.mainValue;
					break;
			}
		}
	}
	
	//Method to input Items

	var inputItems = function()
	{
		var neww = $("#items").val();	
		
		if( neww == "")						//Alert if the Item is empty!
		{
			window.alert("Empty Input! Kindly enter a valid input.");
		}
		else
		{
			
			if(exists(neww))				//Alert if the Item already exists!
			{
				//Calling the class with the help of constructor.
				//Adding the object to the newItem Array.
				newItem.push(new Item(neww));				
				
				//Setting the status of the Object and its html Value

				newItem[newItem.length-1].setStatus(0);
				newItem[newItem.length-1].setHtmlValue();
				
				//Displaying All the items w.r.t status.

				displayAll(o);
			}
			else
			{
				window.alert("Same Item already present in the CheckList! Multiple entries are not allowed!");
			}
		}
		$("#items").val("");
	}

	//Function to check for duplicate items.

	function exists(n)
	{
		for(var i=0;i<newItem.length;i++)
		{
			if(newItem[i].mainValue == n && newItem[i].status<2)  //Traversing all the Items.
				return false;
		}
		return true;
	}

	//Function updating the number of elements on the screen

	function status(o)
	{
		$("#statusOfItems").html("");
		$("#statusOfItems").prepend("<p class='status'></p>");
		
		var count = 0;		//Initializing Counter
		
		switch(o)			//Conditions on the basis of status, "o" , i.e. 0-All, 1-Completed, 2-Remianing, 3-Deleted.
		{	
			case 0:
				count = newItem.length;
				for(var i=0;i<newItem.length;i++)
					if(newItem[i].status >= 2)
						count--;
				break;
			case 1:
				for(var i=0;i<newItem.length;i++)
					if(newItem[i].status == 1)
						count++;
				break;
			case 2:
				for(var i=0;i<newItem.length;i++)
					if(newItem[i].status == 0)
						count++;
				break;
			case 3:
				count = isDeleted();
				break;
		}
		$("p").prepend(count + " item(s).");
	}

	//Function returning the number of items deleted.
	
	function isDeleted()
	{
		var count = 0;
		for(var i=0;i<newItem.length;i++)
			if(newItem[i].status == 2)
				count++;
		return count;
	}
	
	//Function displaying 4 Buttons - Remaining, Completed, All, Clear Completed and one Link to undo the deletion.
		
	function buttonDisplay(o)
	{
		status(o);		//Function updating the number of elements on the screen
		
		if(isDeleted()>0)	//Checking if Deleted Button should be disabled.
			$("#Notes").html("You can Undo by clicking <a href='javascript:myModule.displayAll(3)'><u>here!</u></a>");
		else
			$("#Notes").html("");
		
		$("#buttonID").html("");
		
		//Making three buttons : Pending, Completed, All.

		$("#buttonID").prepend("<button id='pending' onclick='myModule.displayAll(2)'>Pending</button>");
		
		$("#buttonID").prepend("<button id='completed' onclick='myModule.displayAll(1)'>Completed</button>");
		
		$("#buttonID").prepend("<button id='alll' onclick='myModule.displayAll(0)'>All</button>");

		//Adding styling to the buttons.

		$("#pending").addClass("button1");
		$("#completed").addClass("button1");
		$("#alll").addClass("button1");
		
		
		switch(o)		//Condition to show pressed effect on the basis of status , "o". 0-All, 1-Completed, 2-Remianing, 3-Deleted.
		{
			case 0:
				$("#alll").addClass("button3");
				break;
			case 1:
				$("#completed").addClass("button3");
				break;
			case 2:
				$("#pending").addClass("button3");
				break;
			case 3:
				$("#Notes").html("You can Undo by clicking on the Undo Button on the right side of each Item!");
				$("#Notes").append("<br>To Go back, press <a href = 'javascript:myModule.displayAll(0)'><b>here!</b></a> ");
				break;
		}
		
		if(canClear()) 		//Checking if there is any item Completed.
			$("#buttonID").prepend("<button class='button2' onclick='myModule.clearAllCompleted()'>Clear Completed</button>");
		else
			$("#buttonID").prepend("<button class='disabled'>Clear Completed</button>");		//Making the button disabled if can't clear. 
	}

	//Function to check if Clear All Button Can work or not.

	function canClear()
	{
		for(var i=0;i<newItem.length;i++)
		{
			if(newItem[i].status == 1)		//Traversing all Items' status.
				return true;
		}
		return false;
	}

	//Function to set the html syntax for Completed Items.

	function displayCompleted(i)
	{
		$("#"+i).prepend("<img src='images/checked.png' class='check1' onclick='myModule.selectItem("+i+")'>");
		$("#"+i).append("<img src='images/cross.png' align='right' class='cross' onclick='myModule.removeItem("+i+")'>");
	}

	//Function to set html syntax for Pending Items.
	function displayPending(i)
	{
		$("#"+i).prepend("<img src='images/check.png' class='check1' onclick='myModule.selectItem("+i+")'>");
		$("#"+i).append("<img src='images/cross.png' align='right' class='cross' onclick='myModule.removeItem("+i+")'>");
	}

	//Method to Display Items with respect to the status i.e. All, Completed, Pending, Deleted.

	function displayAll(n)
	{
		o = n;						//Changin the status (0,1,2,3)
		
		$("#itemsListing").html("");	
		$("#itemsListing").prepend("<h4 class = 'items'></h4>");
		
		//Displaying on the basis of status,i.e., 0-All, 1-Completed, 2-Remaining, 3-Deleted.
		
		switch(n)
		{
			case 0:
				for(var i=0;i<newItem.length;i++)
				{
					if(newItem[i].status < 2)
					{
						$("h4").prepend("<div class='itemsBox' id="+i+">"+newItem[i].htmlValue+"</div><br>");
						if(newItem[i].status == 0)
							displayPending(i);
						else
							displayCompleted(i);
					}
				}
				break;
			case 1:
				for(var i=0;i<newItem.length;i++)
				{
					if(newItem[i].status == 1)
					{
						$("h4").prepend("<div class='itemsBox' id="+i+">"+newItem[i].htmlValue+"</div><br>");
						displayCompleted(i);		
					}
				}
				break;
			case 2:
				for(var i=0;i<newItem.length;i++)
				{
					if(newItem[i].status == 0)
					{
						$("h4").prepend("<div class='itemsBox' id="+i+">"+newItem[i].htmlValue+"</div><br>");
						displayPending(i);		
					}
				}
				break;
			case 3:
				for(var i=0;i<newItem.length;i++)
				{
					if (newItem[i].status == 2) 
					{
						$("h4").prepend("<div id="+i+">"+newItem[i].htmlValue+"</div><br>");
						$("#"+i).append("<img src='images/undo.png' align='right' class='undo' onclick='myModule.undoItems("+i+")'>")
					}		
				}
				if(isDeleted()==0)
				{
					displayAll(0);
					n=0;
					o=0;
				}
				break;
		}	
		
		//Function displaying 4 Buttons - Remaining, Completed, All, Clear Completed on the basis of the mode.
		buttonDisplay(n);
	}

	//Method to Identify if the Item is completed or not.

	var selectItem = function(n)
	{
		if(newItem[n].status == 0)			//Item is Completed
		{
			newItem[n].setStatus(1);
			newItem[n].setHtmlValue();			//Changing the status to Completed.
		}
		else
		{						
			newItem[n].setStatus(0);
			newItem[n].setHtmlValue();			//Changing the status to Pending.
		}
		
		//Function displaying 4 Buttons - Remaining, Completed, All, Clear Completed on the basis of the mode.
		
		displayAll(o);
	}

	//If a user dosen't want a item in the list

	var removeItem = function(n)
	{	
		
		newItem[n].setStatus(2);			//Changing the status to Deleted.
		newItem[n].setHtmlValue();
		//Function displaying 4 Buttons - Remaining, Completed, All, Clear Completed on the basis of the mode.
		
		displayAll(o);	
	}

	//Method to remove all completed Items.

	var clearAllCompleted = function()
	{
		if(confirm("Are you sure to CLEAR All Completed Tasks?"))
		{
			for(var i=0;i<newItem.length;i++)
			{
				while(newItem[i].status == 1)
				{
					removeItem(i);		//Changing the status of the items!
				}
			}
		}
	}

	//Method to bring back a Item which is deleted.

	var undoItems = function(n)
	{
		if(confirm("Are you sure to Undo the selected Item(s)?"))
		{
			if(exists(newItem[n].mainValue) == true)	//Checking if the item is not already present. Alert is generated if it is already present.
			{
				newItem[n].setStatus(0);
				newItem[n].setHtmlValue();
			}
			else
			{
				window.alert("Same item is present in the Original Check List!");
				newItem[n].setStatus(3);
			}
			displayAll(o);
		}
	}

	//myModule return an object.

	return {
				displayAll: displayAll,
				inputItems: inputItems,
				selectItem: selectItem,
				clearAllCompleted: clearAllCompleted,
				removeItem: removeItem,
				undoItems: undoItems
			};
}());

//Function working when enter key is pressed.

$(document).keypress(function(e) 
{
    if(e.which == 13)       //Key Code of "Enter" is 13.
    {
        myModule.inputItems();		//Calling the first element of the myModule element.
    }
});
