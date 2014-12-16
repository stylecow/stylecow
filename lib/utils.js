(function (stylecow) {

	stylecow.utils = {
		addMsFilter: function (block, filter) {
			var declaration = block.children({type: 'Declaration', name: '-ms-filter'}).pop();
			var string;

			if (!declaration) {
				string = new stylecow.String();
				declaration = new stylecow.Declaration();
				declaration.name = '-ms-filter';
				declaration.push(new stylecow.Value());
				declaration[0].push(string);
				block.push(declaration);
			} else if (declaration.is({ string: '-ms-filter: none;' })) {
				string = stylecow.String();
				declaration.empty();
				declaration.push(new stylecow.Value());
				declaration[0].push(string);
			} else {
				string = declaration.search({ type: 'String' });
			}

			if (string.name) {
				string.name += ',' + filter;
			} else {
				string.name = filter;
			}

		}
	};

})(require('./index'));