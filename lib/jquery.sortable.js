/*
 * HTML5 Sortable jQuery Plugin
 * http://farhadi.ir/projects/html5sortable
 * 
 * Copyright 2012, Ali Farhadi
 * Released under the MIT license.
 */
if (Meteor.isClient) {
    (function($) {
    var dragging, placeholders = $();
    $.fn.sortable = function(options) {
    	var method = String(options);
    	options = $.extend({
    		connectWith: false
    	}, options);
    	return this.each(function() {
    		if (/^enable|disable|destroy$/.test(method)) {
    			var items = $(this).children($(this).data('items')).attr('draggable', method == 'enable');
    			if (method == 'destroy') {
    				items.add(this).removeData('connectWith items')
    					.off('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s');
    			}
    			return;
    		}
    		var isHandle, index, items = $(this).children(options.items);
    		var placeholder = $('<div class="list-card placeholder">');
    		items.find(options.handle).mousedown(function() {
    			isHandle = true;
    		}).mouseup(function() {
    			isHandle = false;
    		});
    		$(this).data('items', options.items)
    		placeholders = placeholders.add(placeholder);
    		if (options.connectWith) {
    			$(options.connectWith).add(this).data('connectWith', options.connectWith);
    		}
    		items.attr('draggable', 'true').on('dragstart.h5s', function(e) {
    			e.stopPropagation();
    			if (options.handle && !isHandle) {
    				return false;
    			}
    			isHandle = false;
    			var dt = e.originalEvent.dataTransfer;
    			placeholders.height($(this).height());
    			dt.effectAllowed = 'move';
    			dt.setData('Text', 'dummy');
    			index = (dragging = $(this)).addClass('ui-sortable-helper').index();
    		}).on('dragend.h5s', function(e) {
    			if (!dragging) {
    				return;
    			}
    			dragging.removeClass('ui-sortable-helper').show();
    			placeholders.detach();
    			if (index != dragging.index()) {
    				dragging.parent().trigger('sortupdate', {item: dragging});
    			}
    			dragging = null;
    		}).not('a[href], img').on('selectstart.h5s', function() {
    			this.dragDrop && this.dragDrop();
    			return false;
    		}).end().add([this, placeholder]).on('dragover.h5s dragenter.h5s drop.h5s', function(e) {
    			if (!items.is(dragging) && options.connectWith !== $(dragging).parent().data('connectWith')) {
    				return true;
    			}
    			if (e.type == 'drop') {
    				e.stopPropagation();
    				var dragElem = dragging;
                    if ($(this).find(options.connectWith)[0]) {
    				    placeholders.filter(':visible').after(dragging.hide());
    				    dragging.trigger('dragend.h5s');
                    }
    				options.drop.call(this, dragElem);
    				return false;
    			}
    			e.preventDefault();
    			e.originalEvent.dataTransfer.dropEffect = 'move';
    			if (items.is(this)) {
    				if (options.forcePlaceholderSize) {
    					placeholder.height(dragging.outerHeight());
    				}
    				dragging.hide();
    				$(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
    				placeholders.not(placeholder).detach();
    			} else if (!placeholders.is(this) && !$(this).children(options.items).length) {
    				placeholders.detach();
    				$(this).append(placeholder);
    			}
    			return false;
    		});
    	});
    };
    })(jQuery);
}
