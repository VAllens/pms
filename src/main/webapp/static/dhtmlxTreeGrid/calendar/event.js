/* Copyright (c) 2006 Yahoo! Inc. All rights reserved. */
YAHOO.util.CustomEvent=function(type,oScope){
	this.type=type;this.scope=oScope||window;this.subscribers=[];if(YAHOO.util["Event"]){YAHOO.util.Event.regCE(this);}
};

YAHOO.util.CustomEvent.prototype={
	subscribe:function(fn,obj,bOverride){this.subscribers.push(new YAHOO.util.Subscriber(fn,obj,bOverride));},unsubscribe:function(fn,obj){var found=false;for(var i=0;i<this.subscribers.length;++i){var s=this.subscribers[i];if(s&&s.contains(fn,obj)){this._delete(i);found=true;}}
	return found;},fire:function(){for(var i=0;i<this.subscribers.length;++i){var s=this.subscribers[i];if(s){var scope=(s.override)?s.obj:this.scope;s.fn.call(scope,this.type,arguments,s.obj);}}},unsubscribeAll:function(){for(var i=0;i<this.subscribers.length;++i){this._delete(i);}},_delete:function(index){var s=this.subscribers[index];if(s){delete s.fn;delete s.obj;}
	delete this.subscribers[index];}
};

YAHOO.util.Subscriber=function(fn,obj,bOverride){this.fn=fn;this.obj=obj||null;this.override=(bOverride);};

YAHOO.util.Subscriber.prototype.contains=function(fn,obj){return(this.fn==fn&&this.obj==obj);};

if(!YAHOO.util.Event){YAHOO.util.Event=function(){var loadComplete=false;var listeners=[];var delayedListeners=[];var unloadListeners=[];var customEvents=[];var legacyEvents=[];var legacyHandlers=[];return{EL:0,TYPE:1,FN:2,WFN:3,SCOPE:3,ADJ_SCOPE:4,isSafari:(navigator.userAgent.match(/safari/gi)),isIE:(!this.isSafari&&navigator.userAgent.match(/msie/gi)),addListener:function(el,sType,fn,oScope,bOverride){if(this._isValidCollection(el)){var ok=true;for(var i=0;i<el.length;++i){ok=(this.on(el[i],sType,fn,oScope,bOverride)&&ok);}
return ok;}else if(typeof el=="string"){if(loadComplete){el=this.getEl(el);}else{delayedListeners[delayedListeners.length]=[el,sType,fn,oScope,bOverride];return true;}}
if(!el){return false;}
if("unload"==sType&&oScope!==this){unloadListeners[unloadListeners.length]=[el,sType,fn,oScope,bOverride];return true;}
var scope=(bOverride)?oScope:el;var wrappedFn=function(e){return fn.call(scope,YAHOO.util.Event.getEvent(e),oScope);};var li=[el,sType,fn,wrappedFn,scope];var index=listeners.length;listeners[index]=li;if(this.useLegacyEvent(el,sType)){var legacyIndex=this.getLegacyIndex(el,sType);if(legacyIndex==-1){legacyIndex=legacyEvents.length;legacyEvents[legacyIndex]=[el,sType,el["on"+sType]];legacyHandlers[legacyIndex]=[];el["on"+sType]=function(e){YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(e),legacyIndex);};}
legacyHandlers[legacyIndex].push(index);}else if(el.addEventListener){el.addEventListener(sType,wrappedFn,false);}else if(el.attachEvent){el.attachEvent("on"+sType,wrappedFn);}
return true;},fireLegacyEvent:function(e,legacyIndex){var ok=true;var le=legacyHandlers[legacyIndex];for(i=0;i<le.length;++i){var index=le[i];if(index){var li=listeners[index];var scope=li[this.ADJ_SCOPE];var ret=li[this.WFN].call(scope,e);ok=(ok&&ret);}}
return ok;},getLegacyIndex:function(el,sType){for(var i=0;i<legacyEvents.length;++i){var le=legacyEvents[i];if(le&&le[0]==el&&le[1]==sType){return i;}}
return-1;},useLegacyEvent:function(el,sType){return((!el.addEventListener&&!el.attachEvent)||(sType=="click"&&this.isSafari));},removeListener:function(el,sType,fn){if(typeof el=="string"){el=this.getEl(el);}else if(this._isValidCollection(el)){var ok=true;for(var i=0;i<el.length;++i){ok=(this.removeListener(el[i],sType,fn)&&ok);}
return ok;}
var cacheItem=null;var index=this._getCacheIndex(el,sType,fn);if(index>=0){cacheItem=listeners[index];}
if(!el||!cacheItem){return false;}
if(el.removeEventListener){el.removeEventListener(sType,cacheItem[this.WFN],false);}else if(el.detachEvent){el.detachEvent("on"+sType,cacheItem[this.WFN]);}
delete listeners[index][this.WFN];delete listeners[index][this.FN];delete listeners[index];return true;},getTarget:function(ev,resolveTextNode){var t=ev.target||ev.srcElement;if(resolveTextNode&&t&&"#text"==t.nodeName){return t.parentNode;}else{return t;}},getPageX:function(ev){var x=ev.pageX;if(!x&&0!==x){x=ev.clientX||0;if(this.isIE){x+=this._getScrollLeft();}}
return x;},getPageY:function(ev){var y=ev.pageY;if(!y&&0!==y){y=ev.clientY||0;if(this.isIE){y+=this._getScrollTop();}}
return y;},getRelatedTarget:function(ev){var t=ev.relatedTarget;if(!t){if(ev.type=="mouseout"){t=ev.toElement;}else if(ev.type=="mouseover"){t=ev.fromElement;}}
return t;},getTime:function(ev){if(!ev.time){var t=new Date().getTime();try{ev.time=t;}catch(e){return t;}}
return ev.time;},stopEvent:function(ev){this.stopPropagation(ev);this.preventDefault(ev);},stopPropagation:function(ev){if(ev.stopPropagation){ev.stopPropagation();}else{ev.cancelBubble=true;}},preventDefault:function(ev){if(ev.preventDefault){ev.preventDefault();}else{ev.returnValue=false;}},getEvent:function(e){var ev=e||window.event;if(!ev){var c=this.getEvent.caller;while(c){ev=c.arguments[0];if(ev&&Event==ev.constructor){break;}
c=c.caller;}}
return ev;},getCharCode:function(ev){return ev.charCode||(ev.type=="keypress")?ev.keyCode:0;},_getCacheIndex:function(el,sType,fn){for(var i=0;i<listeners.length;++i){var li=listeners[i];if(li&&li[this.FN]==fn&&li[this.EL]==el&&li[this.TYPE]==sType){return i;}}
return-1;},_isValidCollection:function(o){return(o&&o.length&&typeof o!="string"&&!o.tagName&&!o.alert&&typeof o[0]!="undefined");},elCache:{},getEl:function(id){return document.getElementById(id);},clearCache:function(){for(i in this.elCache){delete this.elCache[i];}},regCE:function(ce){customEvents.push(ce);},_load:function(e){loadComplete=true;},_tryPreloadAttach:function(){var tryAgain=!loadComplete;for(var i=0;i<delayedListeners.length;++i){var d=delayedListeners[i];if(d){var el=this.getEl(d[this.EL]);if(el){this.on(el,d[this.TYPE],d[this.FN],d[this.SCOPE],d[this.ADJ_SCOPE]);delete delayedListeners[i];}}}
if(tryAgain){setTimeout("YAHOO.util.Event._tryPreloadAttach()",50);}},_unload:function(e,me){for(var i=0;i<unloadListeners.length;++i){var l=unloadListeners[i];if(l){var scope=(l[this.ADJ_SCOPE])?l[this.SCOPE]:window;l[this.FN].call(scope,this.getEvent(e),l[this.SCOPE]);}}
if(listeners&&listeners.length>0){for(i=0;i<listeners.length;++i){l=listeners[i];if(l){this.removeListener(l[this.EL],l[this.TYPE],l[this.FN]);}}
this.clearCache();}
for(i=0;i<customEvents.length;++i){customEvents[i].unsubscribeAll();delete customEvents[i];}
for(i=0;i<legacyEvents.length;++i){delete legacyEvents[i][0];delete legacyEvents[i];}},_getScrollLeft:function(){return this._getScroll()[1];},_getScrollTop:function(){return this._getScroll()[0];},_getScroll:function(){var dd=document.documentElement;db=document.body;if(dd&&dd.scrollTop){return[dd.scrollTop,dd.scrollLeft];}else if(db){return[db.scrollTop,db.scrollLeft];}else{return[0,0];}}};}();YAHOO.util.Event.on=YAHOO.util.Event.addListener;if(document&&document.body){YAHOO.util.Event._load();}else{YAHOO.util.Event.on(window,"load",YAHOO.util.Event._load,YAHOO.util.Event,true);}
YAHOO.util.Event.on(window,"unload",YAHOO.util.Event._unload,YAHOO.util.Event,true);YAHOO.util.Event._tryPreloadAttach();}