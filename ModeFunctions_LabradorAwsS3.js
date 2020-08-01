
import { default as mfApi } from './ModeFunctions_Api.js'
import { mfModelAndItems }  from 'enco-poodle-mode-simple';

export default {

    // NOTE THAT THESE "MODE FUNCTIONS" CAN BE IMPORTED EASILY INTO ANY PROJECT WITHOUT THE OVERHEAD OF THE FULL MODE CLASS
    // ---------------------------------
    // MODE MANIPULATION FUNCTIONS
    //   MODEL AND ITEMS RELATED FUNCTIONS

    // These functions accept a mode object (albeit NO EXPECTATIONS other than a JS object) ...
    // Any ASSUMPTIONS about mode are checked and should not be REQUIRED
    // plus accept any other input ...
    // then manipulate the mode in order to produce the finished mode


    // --------------------------------
    // ASSUMPTIONS :
    //    THE MODE HAS A "labrador_awss3item" property = to an OBJECT with the following sub properties :
    //			urlpath_get   	....  url for downloading (IMAGE file)
    //			urlpath_list  	....  url for listing (GET) image objects (JSON)
    //			urlpath_delete	....  url for deleting (DELETE) images
    //			urlpath_upload	....  url for uploading (POSTING) images
    //			urlpath_replace	....  url for replacing (POSTING) images (to replace all prior items)
    //
    //			fkid 			....  the foreign key id (usually set to the parent object ID)
    //			fktable 		....  the foreign key table (usually set to the parent object table name or short version, key)



	// the path for simple image downloading
	urlPathForResourceGet(mode){
	  if( mode.hasOwnProperty('labrador_awss3item') )
	      return mode.labrador_awss3item.urlpath_get;
	  return "";
	},
	// the path for resource listing
	urlPathForResourceList(mode){
	  if( mode.hasOwnProperty('labrador_awss3item') )
	      return mode.labrador_awss3item.urlpath_list;
	  return "";
	},

	// the path for resource listing
	urlPathForResourceDelete(mode){
	  if( mode.hasOwnProperty('labrador_awss3item') )
	      return mode.labrador_awss3item.urlpath_delete;
	  return "";
	},

	// the path for image upload
	urlPathForResourceUpload(mode){
	  if( mode.hasOwnProperty('labrador_awss3item') )
	      return mode.labrador_awss3item.urlpath_upload;
	  return "";
	},

	// the path for image replacing (removes all prior records)
	urlPathForResourceReplace(mode){
	  if( mode.hasOwnProperty('labrador_awss3item') )
	      return mode.labrador_awss3item.urlpath_replace;
	  return "";
	},

	// ------------------------------------
	// METHODS TO GET URL PATHS  (from paramenter input)
	// NOTE THE REPLACE FUNCTIONS REPLACE ELEMENTS IN THE PATH WITH VIARIABLES ...
	// MIGHT EXTEND THIS CONCEPT IN THE FUTURE TO ADD FLEXIBILITY

	// Get a URL for a single image download
	modeGet_LabradorAwsS3ImageUrlDownload(mode,key){
		var finalBase = mode.protocol + "://" + mode.urlbase + ":" + mode.port;
		var finalPath = this.urlPathForResourceGet(mode).replace("{key}", key);
		return finalBase + finalPath;
	},
	// Get a URL for a single image upplad
	modeGet_LabradorAwsS3ImageUrlUpload(mode,replace=false){

		// CHECK FOR THE EXISTANCE OF A "LABRADOR AWS S3 ITEM" PROPERTY
		if( mode.hasOwnProperty('labrador_awss3item') ){
			var fkTable = mode.labrador_awss3item.fktable;
			var fkId = mode.labrador_awss3item.fkid;

			var urlPath = (replace===true) ? this.urlPathForResourceReplace(mode) : this.urlPathForResourceUpload(mode);
			var finalBase = mode.protocol + "://" + mode.urlbase + ":" + mode.port;
			var finalPath = urlPath.replace("{fktable}", fkTable).replace("{fkid}", fkId);
			return finalBase + finalPath;  
		}else{
			return null
		}

	},

	// A SIMPLE WRAPPER AROUND THE "mfApi.modeGetItems" METHOD
	modeGetItems_LabradorAwsS3Images(mode){
		var self = this;

        return new Promise(function(resolve, reject) {
	        //-----------------------------------------------
	        // LABRADOR AWS S3 ....
	        // CHECK FOR THE EXISTANCE OF A "LABRADOR AWS S3 ITEM" PROPERTY
		    if( mode.hasOwnProperty('labrador_awss3item') ){
				var fkTable = mode.labrador_awss3item.fktable;
				var fkId = mode.labrador_awss3item.fkid;

				if(fkTable && fkId){

					// ---------------------
					// GET THE FINAL PATH USED TO GET A LIST OF RESOURCES FROM THE API
					var finalPath = self.urlPathForResourceList(mode).replace("{fktable}", fkTable).replace("{fkid}", fkId);
					// SET THIS AS THE "MAIN" urlpath IN THE MODE
					mode.urlpath = finalPath;
					// ---------------------

					console.log("urlpath : ",mode.urlpath )

					var prom = mfApi.modeGetItems(mode);
					prom.then(function(result){
						var data = result.data;
						console.log("getImages_FINAL NUM ITEMS :",data,data.length);
						for(var i=0; i<data.length; i++){
							var res = data[i]

							// FIND THE SINGLE IMAGE DOWNLOAD URL
							res['url'] = self.modeGet_LabradorAwsS3ImageUrlDownload(mode,res['key'])
							res['name'] = res['key'];
						}

						resolve(data)
					}, function(err) {
						reject(err)
					});


				}else{
					reject()
				}
		    }else{
		    	reject()
		    }

        });



	},


	// A SIMPLE WRAPPER AROUND THE "mfApi.modeDelete" METHOD
	modeDelete_LabradorAwsS3Images(mode,file){
		var self = this;

        return new Promise(function(resolve, reject) {

			mfModelAndItems.modeSetModel(mode,file)

			// ---------------------
			// GET THE FINAL PATH USED TO GET A LIST OF RESOURCES FROM THE API
			var finalPath = self.urlPathForResourceDelete(mode);
			// SET THIS AS THE "MAIN" urlpath IN THE MODE
			mode.urlpath = finalPath;
			// ---------------------

			var prom = mfApi.modeDelete(mode);
			prom.then(function(result){
				console.log("deleteImages_RESULT :",result);
				resolve(result)
			}, function(err) {
				reject()
			});
		});

	}



}
