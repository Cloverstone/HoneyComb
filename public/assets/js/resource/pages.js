
pagesView = Backbone.View.extend({
	events: {
		'click .fa-plus': 'add'
	},
	add: function() {
		$().berry({legend: 'Page Options', model: new pageModel(), fields: ['Title']}).on('completed', function(){
			if(this.closeAction === 'save'){
				myPages.add(this.options.model);
				contentManager.show( new editPageView( { model: this.options.model } ) );
				myrouter.navigate('#/page/'+this.options.model.id, {trigger: false});
			}
		} );
	},
	template: 'pages_view' ,
	onShow: function() {
		_.each(myPages.models,function(model) {
			var temp = new pageView({'model':model});
		});
	},
	render: function() {
		this.setElement(ich[this.template]( myPages ));
	},
});
pageView = Backbone.View.extend({
	events: {
		'click .btn-danger': 'destroy',
		'click .btn-success': 'viewPage',
		'click': 'editPage'
	},
	editPage: function(e) {
		e.stopPropagation();
		myrouter.navigate('#/page/'+this.model.id, {trigger: true});
	},
	viewPage: function(e) {
		e.stopPropagation();
//		myrouter.navigate('page/'+this.model.id, {trigger: true});
		window.location.href = '/pages/'+this.model.attributes.slug;
	},
	template: 'page_view',
	target: '#page-list',
	initialize: function() {
		this.autoElement();
	}
});
editPageView = Backbone.View.extend({
	events:{
		'click #save-page': 'save',
		'click #title': 'modify'
	},
	modify: function() {
		$().berry({legend: 'Page Options', model: this.model, fields: ['Title']}).on('saved',$.proxy(function(){
			this.$el.find('#title').html(this.model.attributes.title);
		},this) );
	},
	template: 'pages_edit' ,
	onShow: function() {
		cb = new cobler({target: '#itemcontainer', axis: 'y', types: ['content']});
		cb.load(this.model.attributes.json);
	},
	render: function() {
		this.setElement(ich[this.template](this.model.attributes));
	},
	save:function() {
		message({title: 'Success!', text: 'Successfully updated the form', timeout: 3000, color: "#5F895F", icon: "fa fa-user" });
	//		this.model.set({content: JSON.stringify(cb.toJSON())});
		this.model.save({json: cb.toJSON(), content: cb.toHTML()}, {patch:true});
	},
	remove: function() {
    Backbone.View.prototype.remove.call(this);
  }
});

pageModel = Backbone.Model.extend({
	schema: {
		Title: {},
		Color: {},
		Icon: {},
		Tags: {type: 'tags'}
	},
	idAttribute: '_id',
	urlRoot: '/pages'
});
pagesCollection = Backbone.Collection.extend({
//		localStorage: new Backbone.LocalStorage('forms'), // Unique name within your app.
		model: pageModel,
		url: '/pages',
});