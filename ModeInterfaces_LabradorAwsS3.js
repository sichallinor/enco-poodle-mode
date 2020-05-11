

import { default as mf } from './ModeFunctions_LabradorAwsS3.js'

//module.exports = class Mode {
export default class ModeInterface_LabradorAwsS3{



	// Get a URL for a single image download
	mfGet_LabradorAwsS3ImageUrlDownload(key){
		return mf.modeGet_LabradorAwsS3ImageUrlDownload(this,key);
	}
	// Get a URL for a single image upplad
	mfGet_LabradorAwsS3ImageUrlUpload(replace=false){
		return mf.modeGet_LabradorAwsS3ImageUrlUpload(this,replace)
	}

	// A SIMPLE WRAPPER AROUND THE "mfGetItems" METHOD
	mfGetItems_LabradorAwsS3Images(){
		return mf.modeGetItems_LabradorAwsS3Images(this)
	}

	// A SIMPLE WRAPPER AROUND THE "actionCrudDelete" METHOD
	mfDelete_LabradorAwsS3Images(file){
		return mf.modeDelete_LabradorAwsS3Images(this,file)
	}


}