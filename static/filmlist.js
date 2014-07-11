$(document).ready(function(){
	if(window.name){
		gotoPage(parseInt(window.name),15);
		return;
	}
	gotoPage(1,15);
});
var category = "";
var pagesize = 15;
function gotoPage(npage){
	$.getJSON("../json_filmlist?pagesize="+pagesize+"&npage="+npage+"&category="+category, function(data){
	  	showDataList(data,npage);
	  	window.name = npage;
	});
}
function gotoCategory(categ){
	category = categ;
	gotoPage(1);
}
function showListHead(){
	$("#film-list-container").empty();
	var text = '<li class="ui-list-item ui-list-item-head">';
		text += '<div class="ui-list-item-title">电影题目</div>';
		text += '<div class="ui-list-item-category">分类</div>';
		//text += '<div class="ui-list-item-language">语言</div>';
		text += '<div class="ui-list-item-language">清晰度</div>';
		text += '<div class="ui-list-item-language">格式</div>';
		text += '<div class="ui-list-item-score">IMDB 评分</div>';
		text += '</li>';
	$("#film-list-container").append($(text));
}
function showDataList(data,npage){
	showListHead();
	$.each(data.list, function(i,item){
    	var itemView = '<li class="ui-list-item">';
	    itemView += '<div class="ui-list-item-icon"><i class="ui-pdicon"></i></div>';
	    itemView += '<div class="ui-list-item-title fn-break">';
	    itemView += '    <a href="'+item.pagelink+'" target="_blank" class="fn-highlight">'+item.title+'</a>';
	    itemView += '</div>';
	    itemView += '<div class="ui-list-item-category">&nbsp;'+item.category+'&nbsp;</div>';
	    itemView += '<div class="ui-list-item-language">&nbsp;'+item.screen+'&nbsp;</div>';
	    itemView += '<div class="ui-list-item-language">&nbsp;'+item.format+'&nbsp;</div>';
	    itemView += '<div class="ui-list-item-score">&nbsp;'+item.imdbscore+'&nbsp;</div>';
		itemView += '</li>';

		$("#film-list-container").append($(itemView));
    });
	var pagecount = data.total % pagesize > 0 ? data.total/pagesize+1 : data.total/pagesize;
    updatePager(npage,parseInt(pagecount));
}

function updatePager(current, total){
	var pagerHtml = '<span class="ui-paging-info">';
	pagerHtml += '共'+total+'页';
	pagerHtml += '</span>';
	if (current < 5) {
		var max = Math.min(10, total);
		
		pagerHtml += showPagerItem(1,max,current,total);
	}
	else{
		var max = Math.min(total,current+3);
		pagerHtml += showPagerItem(current-3,max,current,total);
	}
	$("#film-list-pager").html(pagerHtml);
}
function showPagerItem(min,max,current,total){
	var pagerHtml = "";
	if (min > 1) {
		pagerHtml += '<a href="javascript:void(0)" class="ui-paging-item" onclick="gotoPage('+1+')">'+1+'</a>';
		pagerHtml += '<span class="ui-paging-item ui-paging-current">...</span>';
	};
	for(var i=min; i<=max; i++){
		if(current == i){
			pagerHtml += '<span class="ui-paging-item ui-paging-current">'+i+'</span>';
		}
		else{
			pagerHtml += '<a href="javascript:void(0)" class="ui-paging-item" onclick="gotoPage('+i+')">'+i+'</a>';
		}
	}
	if (total > max) {
		pagerHtml += '<span class="ui-paging-item ui-paging-current">...</span>';
		pagerHtml += '<a href="javascript:void(0)" class="ui-paging-item" onclick="gotoPage('+total+')">'+total+'</a>';
	};
	return pagerHtml;
}
