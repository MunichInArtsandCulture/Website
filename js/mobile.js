window.onload = function(){
	var getNavi = document.getElementById('navigation');

	var mobile = document.createElement("span");
	mobile.setAttribute("id","mobile-navigation");
	getNavi.parentNode.insertBefore(mobile,getNavi);

	document.getElementById('mobile-navigation').onclick = function(){
		var a = getNavi.getAttribute('style');
		if(a){
			getNavi.removeAttribute('style');
			document.getElementById('mobile-navigation').style.backgroundImage=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23363636' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 5l14 0M5 19l14 0M5 12h14'%3E%3Canimate fill='freeze' attributeName='d' dur='0.4s' values='M5 5l14 14M5 19l14 -14M12 12h0;M5 5l14 0M5 19l14 0M5 12h14'/%3E%3C/path%3E%3C/svg%3E")`;
		} else {
			getNavi.style.display='block';
			document.getElementById('mobile-navigation').style.backgroundImage=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23363636' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 5l7 7l7 -7M12 12h0M5 19l7 -7l7 7'%3E%3Canimate fill='freeze' attributeName='d' dur='0.4s' values='M5 5l7 0l7 0M5 12h14M5 19l7 0l7 0;M5 5l7 7l7 -7M12 12h0M5 19l7 -7l7 7'/%3E%3C/path%3E%3C/svg%3E")`;
		}
	};
	var getElm = getNavi.getElementsByTagName("LI");
	for(var i=0;i<getElm.length;i++){
		if(getElm[i].children.length>1){
			var smenu = document.createElement("span");
			smenu.setAttribute("class","mobile-submenu");
			smenu.setAttribute("OnClick","submenu("+i+")");
			getElm[i].appendChild(smenu);
		};
	};
	submenu = function (i){
		var sub = getElm[i].children[1];
		var b = sub.getAttribute('style');
		if(b){
			sub.removeAttribute('style');
			getElm[i].lastChild.style.backgroundImage='url(images/mobile/mobile-expand.png)';
		} else {
			sub.style.display='block';
			getElm[i].lastChild.style.backgroundImage='url(images/mobile/mobile-collapse.png)';
		}
	};
};
