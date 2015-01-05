var apioProperty = angular.module("apioProperty");
apioProperty.directive("asyncdisplay", ["currentObject", "socket", "$timeout", function(currentObject, socket, $timeout){
	return{
	    restrict: "E",
	    replace: true,
	    scope: {
	    	model: "=propertyname"
	    },
	    templateUrl: "apioProperties/AsyncDisplay/asyncdisplay.html",
	    link: function(scope, elem, attrs){
	    	scope.object = currentObject.get();
	    	scope.currentObject = currentObject;
	    	
			//Serve per il cloud: aggiorna in tempo reale il valore di una proprietà che è stata modificata da un"altro utente
			socket.on("apio_server_update", function(data){
				if(data.objectId === scope.object.objectId  && !currentObject.isRecording()){
					if(data.properties.hasOwnProperty(attrs["propertyname"])){
						scope.model = data.properties[attrs["propertyname"]];
						//In particolare questa parte aggiorna il cloud nel caso siano state definite delle correlazioni
						
					}
				}
			});
			//
			
	    	//Inizializzo la proprietà con i dati memorizzati nel DB
	    	scope.label = attrs["label"];
	    	scope.model = scope.object.properties[attrs["propertyname"]];
	    	scope.propertyname = attrs["propertyname"];
	    	//
	    	
            scope.$on('propertyUpdate',function() {
            	scope.object = currentObject.get();
			});

			scope.$watch("object.properties."+attrs["propertyname"], function(){
			  	scope.model = scope.object.properties[attrs["propertyname"]];
		    });
		    
		    var event = attrs["event"] ? attrs["event"] : "click touchend";
	    	elem.on(event, function(){
				//Aggiorna lo scope globale con il valore che è stato modificato nel template
				scope.object.properties[attrs["propertyname"]] = scope.model;
				//
	
				//Se è stato definito un listener da parte dell'utente lo eseguo altrimenti richiamo currentObject.update che invia i dati al DB e alla seriale
				if(attrs["listener"]) {
					scope.$parent.$eval(attrs["listener"]);
				}
				//

				//Se è stata definita una correlazione da parte dell'utente la eseguo


				//Esegue codice javascript contenuto nei tag angular
				scope.$apply();
				//
			});
			

		    //
		}
	};
}]);
