export default (it) => {
    var out='<li class="mantra-item mx-2 mt-2" data-id="'+(it.id)+'"> <a class="nav-link nav-mantra" href="#!/mantra/'+(it.id)+'"> <span class="itemlist-icon"><i class="icon-headphones"></i></span> <span class="itemlist-title-row pt-1"> <span class="itemlist-title">'+(it.title)+' '+(it.subTitle)+'</span> <span class="itemlist-subtitle">';if(it.subText){out+=' '+(it.subText)+' ';}else{out+=' '+(it.teaserBody.substring(0,40))+' ';}out+='&nbsp;</span> </span> <span class="itemlist-after">&nbsp;</span> </a></li>';return out;
};
