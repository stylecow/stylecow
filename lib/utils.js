(function (stylecow) {

	stylecow.utils = {
		addMsFilter: function (block, filter) {
			var declaration = block.getChild({
					type: 'Declaration',
					name: 'filter',
					vendor: 'ms'
				});

			if (!declaration) {
				return block.push(stylecow.parse('-ms-filter: ' + filter, 'Declaration', 'createMsFilter'));
			}

			if (declaration.is({string: '-ms-filter: none;'})) {
				return declaration
					.get({
						type: 'Keyword',
						name: 'none'
					})
					.replaceWith((new stylecow.String()).setName(filter));
			}

			var string = declaration.get('String');

			if (string.name) {
				string.name += ',' + filter;
			} else {
				string.name = filter;
			}
		}
	};

})(require('./index'));