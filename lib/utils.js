(function (stylecow) {
	stylecow.utils = {
		forEach: function (items, callback, self) {
			if (!items) {
				return;
			}

			self = self || this;

			for (var k in items) {
				if (items.hasOwnProperty(k)) {
					callback.call(self, items[k], k);
				}
			}
		},

		needFix: function (minSupport, disablePlugin) {
			if (!disablePlugin || !minSupport) {
				return true;
			}

			for (var browser in disablePlugin) {
				if (minSupport[browser] === false) {
					continue;
				}

				if (disablePlugin[browser] === false || minSupport[browser] < disablePlugin[browser]) {
					return true;
				}
			}

			return false;
		},

		arrayUnique: function (array) {
			var i, k, a = [];

			for (i = array.length - 1; i >= 0; i--) {
				k = a.indexOf(array[i]);

				if (k === -1) {
					a.unshift(array[i]);
				}
			}

			return a;
		}
	};

})(require('./index'));
