// BUDGET CONTROLLER
var budgetController = (function () {

	var Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}

	var Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}

	var calculateTotal = function (type) {
		var sum = 0;
		data.allItems[type].forEach(function (current) {
			sum = sum + current.value;
		});
		data.totals[type] = sum;
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	}

	return {
		addItem: function (type, des, val) {
			var newItem, ID;

			// Create new ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			data.allItems[type].push(newItem);

			return newItem;
		},

		calculateBudget: function () {
			// calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;

			// calculate the percentage of income that we spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},

		getBudget: function () {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
		},

		testing: function () {
			console.log(data);
		}
	};

})();

// UI CONTROLLER
var UIController = (function () {

	var DOMstrings = {
		inputType: '.add__type',  // +/-
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
	}

	return {
		getinput: function () {
			return {
				type: document.querySelector(DOMstrings.inputType).value,
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},
		addListItem: function (obj, type) {
			var html;
			// create html string with placeholder text
			if (type === 'inc') {
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			// replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			// insert the html into the dom
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},
		clearFields: function () {
			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function (current, index, array) {
				current.value = "";
			});

			fieldsArr[0].focus();
		},
		getDOMstrings: function () {
			return DOMstrings;
		}
	};

})();

// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

	var setupEventListeners = function () {
		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function (e) {
			if (e.keyCode === 13 || e.which === 13) {
				ctrlAddItem();
			}
		});
	};

	var updateBudget = function () {
		// calculate the budget
		budgetCtrl.calculateBudget();
		// return the budget
		var budget = budgetCtrl.getBudget();
		// display the budget on the UI
	}

	var ctrlAddItem = function () {
		var input, newItem;
		// get the filed input data
		input = UICtrl.getinput();

		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			// add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);
			// add the item to UI
			UICtrl.addListItem(newItem, input.type);
			// clear the fields
			UICtrl.clearFields();
			// calculate the budget
			updateBudget();
			// display the budget on the UI
		}
	}

	return {
		init: function () {
			console.log("Init~");
			setupEventListeners();
		}
	}

})(budgetController, UIController);

controller.init();