ich.addTemplate('formal_wizard_steps', '{{#sectionList}}<li data-target="#step{{index}}" class="{{state}}" ><span class="badge">{{index}}</span>Step {{index}}<span class="chevron"></span></li>{{/sectionList}}');

Formal.renderers['wizard'] = function() {
	this.$element = null;
	this.update = function(){
		this.$element.find('ul').html(Formal.render('formal_wizard_steps',this.owner));
		$('#submit,#wizard-next').hide();
		$('.step-pane').removeClass('active');
		$('#step' + (this.owner.currentSection + 1)).addClass('active');
		if((this.owner.currentSection + 1) != this.owner.section_count){
			$('#wizard-next').show();
		}else{
			$('#submit').show();
		}
		// reset the wizard position to the left
		this.$element.find('ul').first().attr('style','margin-left: 0');

		// check if the steps are wider than the container div
		var totalWidth = 0;
		this.$element.find('ul > li').each(function () {
			totalWidth += $(this).outerWidth();
		});
		var containerWidth = 0;
		if (this.$element.find('.actions').length) {
			containerWidth = this.$element.width() - this.$element.find('.actions').first().outerWidth();
		} else {
			containerWidth = this.$element.width();
		}
		if (totalWidth > containerWidth) {
		
			// set the position so that the last step is on the right
			var newMargin = totalWidth - containerWidth;
			this.$element.find('ul').first().attr('style','margin-left: -' + newMargin + 'px');
			
			// set the position so that the active step is in a good
			// position if it has been moved out of view
			if (this.$element.find('li.' + this.owner.sectionList[this.owner.currentSection].state ).first().position().left < 200) {
				newMargin += this.$element.find('li.' + this.owner.sectionList[this.owner.currentSection].state ).first().position().left - 200;
				if (newMargin < 1) {
					this.$element.find('ul').first().attr('style','margin-left: 0');
				} else {
					this.$element.find('ul').first().attr( 'style' , 'margin-left: -' + newMargin + 'px');
				}
			}
		}
	};
	this.next = function(){
		this.owner.valid = true;
		this.owner.iterateItems(this.owner.sections[this.owner.currentSection].children,this.owner.validateItem);
		if(this.owner.valid){
			if(this.owner.currentSection < (this.owner.section_count - 1)){
				this.owner.sectionList[this.owner.currentSection].state = 'complete';
				this.owner.currentSection++;
				this.owner.clearErrors();
				this.owner.sectionList[this.owner.currentSection].state = 'active';
			}
		}else{
			this.owner.sectionList[this.owner.currentSection].state = 'error';
		}
		this.update();
	};
	this.previous = function(){
		if(this.owner.currentSection > 0){
			this.owner.sectionList[this.owner.currentSection].state = 'disabled';
			this.owner.currentSection--;
			this.owner.sectionList[this.owner.currentSection].state = 'active';
		}
		this.update();
	};
	this.sectionClick = function(e){
		var clickedSection = parseInt($(e.currentTarget).data('target').replace('#step', ''), 10) - 1;
		if(clickedSection < this.owner.currentSection) {
			for(var i = clickedSection; i <= this.owner.currentSection;  i++){
				this.owner.sectionList[i].state = 'disabled';
			}
			this.owner.currentSection = clickedSection;
			this.owner.sectionList[this.owner.currentSection].state = 'active';
		}
		this.update();
	};
	this.initialize = function() {
		this.owner.sectionList[0].state = 'active';
		this.owner.currentSection = 0;
		if((this.owner.currentSection + 1) == this.owner.section_count){
			$('#wizard-next').hide();
		}else{
			$('#submit').hide();
		}
		this.$element = this.owner.parentobj.find('.wizard');
		this.$element.find('ul').html(Formal.render('formal_wizard_steps',this.owner));
		$('#step1').addClass('active');
		$('body').on('click','.wizard li',$.proxy(this.sectionClick,this));
		$('body').on('click','#wizard-next',$.proxy(this.next,this));
		$('body').on('click','#wizard-previous',$.proxy(this.previous,this));
	};
};