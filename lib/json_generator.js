var pathFn = require('path');
var fs = require('fs');

module.exports = function(locals){
    var config = this.config;
    var searchConfig = config.search;
    var searchfield = searchConfig.field;
    var content = searchConfig.content;

    var posts, pages;

    if(searchfield.trim() != ''){
        searchfield = searchfield.trim();
        if(searchfield == 'post'){
            posts = locals.posts.sort('-date');
        }else if(searchfield == 'page'){
            pages = locals.pages;
        }else{
            posts = locals.posts.sort('-date');
            pages = locals.pages;
        }
    }else{
        posts = locals.posts.sort('-date');
    }

    var res = new Array() 
    var index = 0
    
    if(posts){     
        posts.each(function(post) {
            if (post.indexing != undefined && !post.indexing) return;
            var temp_post = new Object() 
            temp_post.title = post.title || 'No Title'
            if (post.path) { 
                temp_post.url = config.root + post.path 
            } 
            if (content != false) { 
                // 检查 post.cover 是否存在，并生成封面图片的 HTML 代码
                if (post.cover) {
                    temp_post.content = `<img src="${post.cover}" alt="${post.title || 'Cover Image'}">`;
                } else {
                    temp_post.content = ''; // 如果没有封面图片，content 为空
                }
            } 
            if (post.tags && post.tags.length > 0) { 
                var tags = [];
                post.tags.forEach(function (tag) {
                    tags.push(tag.name);
                }); 
                temp_post.tags = tags 
            } 
            if (post.categories && post.categories.length > 0) { 
                var categories = [];
                post.categories.forEach(function (cate) {
                    categories.push(cate.name);
                }); 
                temp_post.categories = categories 
            } 
            res[index] = temp_post;  
            index += 1; 
	    }); 
    } 
    if(pages){ 
        pages.each(function(page){
            if (page.indexing != undefined && !page.indexing) return;
            var temp_page = new Object() 
            temp_post.title = post.title || 'No Title'
            if (page.path) { 
                temp_page.url = config.root + page.path 
            } 
            if (content != false && page._content) { 
                temp_page.content = page._content 
            } 
            if (page.tags && page.tags.length > 0) { 
                var tags = new Array() 
                var tag_index = 0 
                page.tags.each(function (tag) {
                    tags[tag_index] = tag.name; 
                }); 
                temp_page.tags = tags 
            } 
            if (page.categories && page.categories.length > 0) {
                temp_page.categories = []
                (page.categories.each || page.categories.forEach)(function (item) {
                    temp_page.categories.push(item);
                });
            } 
            res[index] = temp_page;  
            index += 1; 
        }); 
    } 


    var json = JSON.stringify(res);

    return {
        path: searchConfig.path,
        data: json
    };
};