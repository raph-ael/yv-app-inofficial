export default (it) => {
    var out='<li class="mx-2 mt-2"> <a class="nav-link list-asana" href="#!/asana/'+(it.id)+'"> <span style="background-image: url('+(it.teaserImage)+');" class="itemlist-media bg-cover"></span> <span class="itemlist-title-row"> <span class="itemlist-title">'+(it.title)+'</span> <span class="itemlist-subtitle">'+(it.sanskrit)+'</span> </span> <span class="itemlist-after">&nbsp;</span> </a></li>';return out;
};
