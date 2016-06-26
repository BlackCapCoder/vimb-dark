var xSpeed = 0
  , ySpeed = 0.5
  , jDown  = false
  , kDown  = false;

document.onkeydown = function (e) {
  e = e || window.event;

  if (document.activeElement.tagName == "INPUT") return;

  var chr = e.keycode || e.which;
  var str = String.fromCharCode (chr);

  if (str == 'J') {
    jDown = true;
    scroll ();
    return false;
  }

  if (str == 'K') {
    kDown = true;
    scroll ();
    return false;
  }
}

document.onkeyup = function (e) {
  e = e || window.event;

  var chr = e.keycode || e.which;
  var str = String.fromCharCode(chr);

  if (str == 'J') return jDown = false;
  if (str == 'K') return kDown = false;
}

document.onkeypress = function (e) {
  e = e || window.event;

  var chr = e.keycode || e.which;
  var str = String.fromCharCode(chr);

  if (e.ctrlKey && str == "n") return toggleBlacklist();

  if (document.activeElement.tagName == "INPUT") return;

  if (chr == 32) { // space
    if ((getDocHeight() - window.innerHeight) <= window.scrollY) return nextPage ();

    ySpeed = e.shiftKey? 2: -1;
    scroll();
    return false;
  }

  if (chr == 8) { // backspace
    if (e.shiftKey) return window.history.forward() && false;
    window.history.back();
    return false;
  }
}

/* Scrolling */
var epox = 0.01;
var intervalId = -1;
function scroll () {
  if (intervalId == -1) intervalId = setInterval(scrollStep, 15);
}

function scrollDown () { ySpeed = Math.max(ySpeed - 0.05, 0); }
function scrollUp   () { ySpeed = Math.min(ySpeed + 0.05, 1); }

function scrollStep () {
  if (jDown) scrollDown ();
  if (kDown) scrollUp   ();

  document.body.scrollTop += (0.5-ySpeed) * 50;
  ySpeed = ySpeed * 0.9 + 0.5 * 0.1

  if (ySpeed < 0.5) {
    if (ySpeed > 0.5-epox) ySpeed = 0.5;
  } else {
    if (ySpeed < 0.5+epox) ySpeed = 0.5;
  }

  if (ySpeed == 0.5) {
    clearInterval(intervalId);
    intervalId = -1;
  }
}

/* ===== Css Injection ===== */
function injectStyle(id, code) {
  if (document.getElementById(id)) return;

  var head   = document.getElementsByTagName('head')[0];
  var link   = document.createElement('style');

  link.id    = id;
  link.rel   = 'stylesheet';
  link.type  = 'text/css';
  //link.media = 'all';
  link.innerHTML = code;

  head.appendChild (link);
}

function setStyles () {
  var url = window.location;

  for (var i = 0; i < customStyles.length; i++) {
    var style = customStyles[i];

    for (var q = 0; q < style.domain.length; q++) {
      if (style.domain[q].exec(url) == null) continue;
      injectStyle('customStyle', customStyles[i].css);
      console.log("injected a custom style")
      break;
    }
  }

  if (isBlacklisted()) return;
  injectStyle('terminalVision', cssDark);
}
function removeStyles () {
  document.getElementById('terminalVision').remove();
}

var injected = false;
var injector = setInterval( function () {
  if (document.getElementsByTagName('head')[0] == undefined) return;
  clearInterval (injector);
  if (!injected) setStyles ();
  injected = true;
  console.log("injected");
},100)

// ===== Blacklist ===== //
function toggleBlacklist () {
  if (isBlacklisted()) {
    document.cookie = "blacklisted=false";
    setStyles();
    return;
  }

  document.cookie = "blacklisted=true";
  removeStyles();
}

function isBlacklisted () {
  var x = getCookie('blacklisted');
  return !(x == undefined || x == "" || x == "false");
}

function getCookie (name) {
  var cs = document.cookie.split(';');
  name += "=";

  for (var i = 0; i < cs.length; i++) {
    var c = cs[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name)==0) return c.substring(name.length, c.length);
  }
}

// ===== Next page ===== //
function nextPage () {
  var links = document.getElementsByTagName('a');

  for (var i = links.length-1; i>=0; i--) {
    var txt = links[i].text.toLowerCase().trim();
    if (["next", "next »", "»", ">"].indexOf(txt) == -1) continue;

    links[i].click();
    return false;
  }
}

function getDocHeight() {
  var d = document;

  return Math.max(
      d.body.scrollHeight, d.documentElement.scrollHeight,
      d.body.offsetHeight, d.documentElement.offsetHeight,
      d.body.clientHeight, d.documentElement.clientHeight
      );
}

// ===== CSS ===== //
var cssDark = "html {"
            + "  background: rgb(237, 237, 237) !important;"
            + "  min-height: 100% !important;"
            + "  text-shadow: 0 0 0 !important;"
            + "  -webkit-filter: invert(100%) hue-rotate(180deg) brightness(110%) contrast(90%) grayscale(20%) sepia(10%) !important;"
            + "}"
            + "img, iframe, video, *:not(object):not(body)>embed, object, *[style*=\"background:url\"]:empty, "
            + "*[style*=\"background-image:url\"]:empty, *[style*=\"background: url\"]:empty, *[style*=\"background-image: url\"]:empty {"
            + "  -webkit-filter: brightness(90%) invert(100%) hue-rotate(180deg) !important;"
            + "} input {"
            + "  color: white;"
            + "}";

var customStyles = [ { domain: [/(https?:\/\/)?(www\.)?youtube\.com\/.*/]
                     , css: "body{ background: #0D0D0D !important;}#footer-container{ border-top: 1px solid #1a1a1a !important; /* This is kind of black*/ background-color: #0D0D0D !important;}#footer-main{ border-bottom: 1px solid #0D0D0D !important;}#appbar-guide-menu{ background-color: #0D0D0D !important; border-right: 1px solid #1a1a1a !important;}.guide-item{ color: #F1F1F1 !important;}.guide-section-separator{ border-bottom: 1px solid #1a1a1a !important;}#content{ background-color: #0D0D0D !important;}.branded-page-module-title a { color: #8D8D8D !important;}#watch7-sidebar .watch-sidebar-separation-line{ border-bottom: 1px solid #F1F1F1 !important;}/*VIDEO PAGE SPECIFIC STUFF HERE */#watch7-sidebar-contents{ background-color: #0D0D0D !important;}.video-list .video-list-item .title{ color: #8D8D8D !important;}.yt-card { background-color: #131313 !important;}.yt-ui-ellipsis{ background-color: #0D0D0D !important;}.branded-page-box, .section-list li .item-section .branded-page-box{ border-bottom: 1px solid #1a1a1a !important;}.compact-shelf .yt-uix-button-shelf-slider-pager{ background-color: #0D0D0D !important;}#eow-title{ color: #FFFFFF !important;}.feed-header { border-bottom: 1px solid #1a1a1a !important;}/* this is the topbar*/#masthead-appbar { border-bottom: 1px solid #1a1a1a !important;}#masthead-positioner{ background-color: #0D0D0D !important;}#masthead-positioner:hover #appbar-guide-button{ background-color: #0D0D0D !important; border: 1px solid #0D0D0D !important;}#yt-masthead-container{ background-color: #0D0D0D !important; border-bottom: 1px solid #1a1a1a !important;}#masthead-search-terms { background-color: #8D8D8D !important;}#masthead-search-terms input { color: #F1F1F1 !important; background-color: #161616 !important;}.masthead-search-terms-border { border-color: #333 !important; }#search-btn{ background-color: #161616 !important; border: 0px !important;}/* done with the topbar */#watch-description{ color: #8D8D8D !important;}.not-watch8 #watch7-user-header .yt-user-name, #watch7-user-header .yt-user-info a { color: #8D8D8D !important;}#appbar-nav{ background-color: #0D0D0D !important;}.epic-nav-item-heading{ color: #8D8D8D !important;}.yJa{ background-color: #0D0D0D !important;}#watch-appbar-playlist .playlist-videos-list{ background-color: #0D0D0D !important;}#watch-appbar-playlist .playlist-videos-list .yt-ui-ellipsis{ background-color: inherit !important;}.search-header{ border-bottom: 1px solid #1a1a1a !important;}.yt-lockup .yt-lockup-meta a, .yt-lockup .yt-lockup-description a { color: #167AC6 !important;}.yt-badge-item{ background-color: #167AC6 !important; /*<----------------------------new video badge, next to a title in a list*/}#appbar-guide-menu, .guide-flyout{ background: none repeat scroll 0% 0% #0D0D0D !important; /*---- the \"More\" section of the subscribers list*/}.guide-flyout{ border: 1px solid #1a1a1a !important;}.yt-gb-shelf-main-content{ border: 1px solid #1a1a1a !important; box-shadow: 0px 1px 2px #1a1a1a !important;}.yt-uix-expander-ellipsis{ background-color: #0D0D0D !important;}.yt-lockup-playlist-item { border-bottom: 1px solid #1a1a1a !important;}#c4-header-bg-container{ border-bottom: 1px solid #1a1a1a !important;}.yt-card .yt-uix-button-expander{ border-top: 1px solid #1a1a1a !important;}#watch8-action-buttons{ border-top: none !important;}.yt-ui-menu-content{ background: none repeat scroll 0% 0% #0D0D0D !important; border: 1px solid #1a1a1a !important;}.yt-card .yt-uix-tabs{ border-bottom: 1px solid #1a1a1a !important;}.branded-page-v2-subnav-container{ border-bottom: 1px solid #1a1a1a !important;}.feed-item-container.legacy-style .feed-item-main{ border-bottom: 1px solid #1a1a1a !important;}.pl-video{ border-bottom: 1px solid #1a1a1a !important;}.yt-card{ box-shadow: none !important;}/*it seems this is not a valid css and causes errors*//*.yJa{*//* background-color: none;*//*}*/#watch7-sidebar .watch-sidebar-head{ color: #8D8D8D !important;}.nbc{ /* when you hover on a channel name */ background-color: #0D0D0D;}.branded-page-module-title { color: #8D8D8D !important; /* greyish kind of white, good for titles */}/*Playlist page start */#pl-header .pl-header-title{ color: #8D8D8D !important;}.channel-header .branded-page-header-title .branded-page-header-title-link{ color: #FFFFFF !important;}.pl-video-title-link{ color: #8D8D8D !important;}/*Playlist page end */.branded-page-related-channels h3 a, .branded-page-related-channels h3{ color: #8D8D8D !important;}#action-panel-details a{ color: #167AC6 !important;}.yt-ui-menu-item{ color: #CC181E !important;}#vm-pagination{ background: none;}.view-all-playlists #non-appbar-vm-video-actions-bar .vm-video-actions-inner{ background-color: #0D0D0D !important;}#non-appbar-vm-video-actions-bar .vm-video-actions-inner{ border-bottom: 1px solid #1a1a1a !important;}.watch-card-list td{ border-bottom: 1px solid #1a1a1a !important;}.watch-card, .watch-card .yt-uix-tabs-selected,.branded-page-v2-secondary-col .branded-page-related-channels-see-more a{ color: #8D8D8D !important;}#watch7-sidebar .watch-sidebar-separation-line{ border-color: #1a1a1a !important;}#footer-links-primary a{ color: #8D8D8D !important;}/* subscription_manager page*/.subscription-manager-title{ color: #8D8D8D !important;}.subscription-table-header{ border-top: 1px solid #1a1a1a !important;}#subscription-manager-container .subscription-item,#subscription-manager-container .collection-item,#subscription-manager-container .empty-message { border-top: 1px solid #1a1a1a !important;}.feed-channel-header-title{ color: #8D8D8D !important;}.yt-gb-compact-shelf{ border: 1px solid #1a1a1a !important; box-shadow: 0px 1px 2px #1a1a1a !important;}#video-wall-container-v2{ /*the border beneath the right hand side ad on videopage*/ border: none !important;}/* from alex, must fix the subscribe button */.yt-lockup-title a { color: #ABABAB !important;}.yt-uix-button-content { color: #d4d4d4 !important;}.yt-uix-button-default{ border-color: #575757 !important; background: #424242 !important;}/* from alex, must fix the subscribe button */.yt-uix-button-subscribe-unbranded,.yt-uix-subscription-button,.yt-uix-button-subscribed-unbranded{ border-color: #CCC !important; background: #E62117 !important;}.yt-uix-button-subscribe-unbranded:hover,.yt-uix-subscription-button:hover,.yt-uix-button-subscribed-unbranded:hover{ border-color: #CCC !important; background: #B31217 !important;}#yt-masthead-user #sb-button-notify{ background-color: #0D0D0D !important; /*or inherit */}/*searches related to something*/.search-shelf h3, .search-refinements h3{ color: #F1F1F1 !important;}.search-refinements{ border-color: #1a1a1a !important;}.yt-alert-message{ color: #d4d4d4 !important;}.yt-dialog-show-content .yt-dialog-content, .yt-dialog-show-loading .yt-dialog-loading,.yt-dialog-show-working .yt-dialog-working, .yt-dialog-show-working .yt-dialog-content { color: #cc181e !important;}.watch-card-list tr:first-child td { border-top: 1px solid #1a1a1a !important;}.search-header .num-results, .search-header .num-results strong,.search-header .yt-uix-button-content, .watch-card a, .watch-card-meta li{ color: #ABABAB !important;}/* The NEWSTYLE weird looking comments section*/.all-comments, .all-comments a, .comments .channel-owner .comment-header .user-name{ background: #0D0D0D !important;}.comment-text-content{ color: #8d8d8d !important;}/* Kudos to Sephyr the following line ;) */.comment-renderer-text-content{ color: #8d8d8d !important;}.box{ color: #FFFFFF !important; text-shadow: 0 1px 1px #333 !important; background-color: #8d8d8d !important; border-color: #1a1a1a !important;}.comments .paginator, .comments .paginator:hover{ background: #424242 none !important; border: 1px solid #1a1a1a !important; color: #FFFFFF !important;}.comment-source{ color: #8d8d8d !important;}.callout-inner, .callout-outer{ border: none !important;}/* End NEWSTYLE weird looking comments section*//* Upload pages */.metadata-editor-container .video-settings-form{ background: none repeat scroll 0% 0% #0D0D0D !important;}#main-content .upload-item{ border-color: #1a1a1a !important;}.metadata-editor-container .subnav{ border-bottom: 1px solid #1a1a1a !important;}.yt-uix-form-input-textarea, .yt-chip { border: 1px solid #1a1a1a !important;}.yt-chip { border: 1px solid #1a1a1a !important; box-shadow: 0px 1px 0px #1a1a1a !important;}.advanced-tab-option, .metadata-container h3, .thumb-placeholder, .sharing-networks-label{ color: #8d8d8d !important;}.sharing-balloon{ border: 1px solid #1a1a1a !important;}.sharing-balloon::after, .sharing-balloon::before{ border-right: 11px solid #1a1a1a !important;}/* END Upload pages*//* theather mode player */.watch-stage-mode #placeholder-player{ background-color : #000000 !important;}/* carousels navigation*/.browse-list-item-container:hover .compact-shelf .yt-uix-button-shelf-slider-pager,.compact-shelf:hover .yt-uix-button-shelf-slider-pager{ border: 1px solid #1a1a1a !important;}/* account/settings pages*/#creator-sidebar .creator-sidebar-section a,#creator-sidebar h3,#creator-sidebar h3 a, #creator-sidebar .creator-sidebar-branding h1,.live-welcome-features p, .live-welcome-feature-heading h3,#creator-subheader h2, #creator-sidebar .creator-sidebar-section a:hover{ color: #ABABAB !important;}/* END account/settings pages*/.appbar-guide-notification-text-content{ z-index: 999 !important;}/* Live stream comments area */.live-chat-widget .comments-textarea{ background-color: #8D8D8D !important; box-shadow: inset 0 1px 2px #333 !important; color: #F1F1F1 !important; text-shadow: 0 1px 1px #333 !important;}.live-chat-widget .comment, .live-chat-widget, #watch7-sidebar{ background-color: #0D0D0D !important;}.live-chat-widget.has-padded-container #comments-scroller{ border-bottom: 1px solid #E2E2E2 !important; /* does not work, no ideea why*/}.live-chat-widget .comment .author a{ color: #167AC6 !important;}.live-chat-widget .comment-text{ color: #F1F1F1 !important;}.live-comments-emoji-picker-tab-row{ background-color: #0D0D0D !important;}/* Live stream comments area *//* viewer discretion page*/#verify h2, #verify-details{ color: #F1F1F1 !important;}/* View all comments page */#watch-response{ background-color: #0D0D0D !important;}#watch-response-header-content p a{ color: #167AC6 !important;}#watch-response-content{ border: 1px solid #1a1a1a !important;}/*Viewing history */#browse-items-primary .item-section>li>.yt-lockup-tile { border-bottom: 1px solid #1a1a1a !important;}/* Similar searches */.search-exploratory-line{ border-top: 1px solid #1a1a1a !important;}.search-exploratory-line h3{ color: #ABABAB !important;}/* New comments format */.comment-simplebox { background-color: #0D0D0D !important;}.comment-simplebox-renderer {border-bottom: 1px solid #1a1a1a !important;}.comment-simplebox-renderer-collapsed-content { border: 1px solid #1a1a1a !important; border-top: 1px solid #1a1a1a !important;}.comment-simplebox-arrow .arrow-inner{border: none !important;}.comment-simplebox-arrow .arrow-outer{border: 6px solid #1a1a1a !important;}.sprite-like-dislike{ background-color: #161616 !important;}iframe{display:none;}.logo{-webkit-filter: brightness(70%) !important;}"
                     }
                   ];





// blackcap
