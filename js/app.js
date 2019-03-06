'use strict'

let server = new EventEmitter2();

var contentList;  

// (function loadcontentList(){

// 	var xhr = new XMLHttpRequest();
// 	xhr.open('GET', 'docs/content.json',true);
// 	xhr.setRequestHeader('Content-Type', 'application/json');
// 	xhr.send();	
// 	xhr.onload = () => {
// 		if (xhr.status === 200){			
			
// 			contentList = JSON.parse(xhr.responseText);
// 				// console.log(Array.isArray(data.lista));
// 			server.emit('List-Loaded', contentList)
// 			return contentList
// 		}
// 		else{
// 			console.error(xhr.status +': ' + 'No se encotraron documentos');
// 		}
// 	};
// })()
(function loadcontentList(){
	fetch('docs/content.json')
		.then((response) => {
			response.json()
				.then((parsedJson) => {
					console.log(`status: ${response.status}  --  statusText: ${response.statusText} --  json: ${parsedJson}`);
					console.log(parsedJson);
					contentList = parsedJson;
					server.emit('List-Loaded', contentList)
					return contentList
				})

		.catch(function (err) {
			console.log("[Error] ********************* ", err + " ********************* /");
		})
	})
})()



document.addEventListener('DOMContentLoaded', function () {	
	mainNav.init();
	loadDocuments.init();
	htmlPluck.init();
})


