(function(f,$){
	f.register({ type: 'select',
		create: function() {
			return f.render('berry_select', f.processOpts(this));
		},
		setup: function() {
			this.$el = this.self.find('select');
			if(this.onchange !== undefined){
				this.$el.change(this.onchange);
			}
			this.$el.change($.proxy(function(){this.trigger('change');}, this));
		},
		getValue: function() {
			return this.$el.children('option:selected').attr('value');
		},
		displayAs: function() {
			for(var i in this.options) {
				if(this.options[i].value == this.lastSaved) {
					return this.options[i].label;
				}
			}
		}
	});
})(Berry,jQuery);