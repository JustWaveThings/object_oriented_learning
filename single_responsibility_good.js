// event constructor
function Event(name) {
	this._handlers = [];
	this.name = name;
}
// add handlers to array
Event.prototype.addHandler = function (handler) {
	this._handlers.push(handler);
};

// remove handlers from array
Event.prototype.removeHandler = function (handler) {
	for (var i = 0; i < handlers.length; i++) {
		if (this._handlers[i] == handler) {
			this._handlers.splice(i, 1);
			break;
		}
	}
};

// fire all  handlers in array
Event.prototype.fire = function (eventArgs) {
	this._handlers.forEach(function (h) {
		h(eventArgs);
	});
};

// iffe that holds events in array, publish and subscribe  - I do not understand the [0] at the end of the getEvent function
var eventAggregator = (function () {
	var events = [];

	// gets the event from the events array // private?
	/* 	function getEventJQ(eventName) {
		return $.grep(events, function (event) {
			return event.name === eventName;
		})[0];
  } */
	//same but written in vanillaJS
	function getEvent(eventName) {
		return events.filter(function (eventName) {
			return eventName.indexOf(eventName) != -1;
		});
	}

	// public methods of iffe
	return {
		// publish event
		publish: function (eventName, eventArgs) {
			var event = getEvent(eventName);

			// if event doesnt exist, then create new event and push it to event array, then fire the event if it existed or was new.
			if (!event) {
				event = new Event(eventName);
				events.push(event);
			}
			event.fire(eventArgs);
		},

		// same as publish, but a handler is added to the event if it doesn't exist, or if it does, still add a handler to the event
		subscribe: function (eventName, handler) {
			var event = getEvent(eventName);

			if (!event) {
				event = new Event(eventName);
				events.push(event);
			}
			event.addHandler(handler);
		},
	};
})();

// ^^^^I wonder if this could be made more modular if they broke out the if(event) block into it's own method, of if this is an example of some duplication ok?

function Cart() {
	var items = [];
	this.addItem = function (item) {
		items.push(item);
		eventAggregator.publish('itemAdded', item);
	};
}

var cartView = (function () {
	eventAggregator.subscribe('itemAdded', function (eventArgs) {
		var newItem = (document.createElement('li').textContent =
			eventArgs
				.getDescription()
				.setAttribute('id-cart', eventArgs.getId())
				.appendChild('#cart'));
	});
})();

var cartController = (function (cart) {
	eventAggregator.subscribe('productSelected', function (eventArgs) {
		cart.addItem(eventArgs.product);
	});
})(new Cart());

function Product(id, description) {
	this.getId = function () {
		return id;
	};
	this.getDescription = function () {
		return description;
	};
}

var products = [
	new Product(1, 'Star Wars Lego Ship'),
	new Product(2, 'Barbie Doll'),
	new Product(3, 'Remote Control Airplane'),
];

var productView = (function () {
	function onProductSelected() {
		var productId = this.setAttribute('id');
		/* 	var productJQ = $.grep(products, function (x) {
			return x.getId() == productId;
		})[0]; */
		var product = products.filter(function (x) {
			return x.getId() === productId;
		});
		var product = eventAggregator.publish('productSelected', {
			product: product,
		});
	}

	products.forEach(function (product) {
		var newItem = document
			.createElement('li')
			.textContent(product.getDescription())
			.setAttribute('id', product.getId())
			.addEventListener('dblclick', (e) => {
				onProductSelected(e);
			})
			.appendChild('#products');
	});
})();
