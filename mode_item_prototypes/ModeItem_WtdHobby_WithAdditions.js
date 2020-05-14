'use strict';

import { ModeItem } from 'enco-poodle-mode-simple'
import { default as mf } from '../ModeFunctions_LabradorAwsS3.js'



export default class ModeItem_WtdHobby_WithAdditions extends ModeItem {

    testMessage(){
        console.log("MESSAGE FROM ModeItem_WtdHobby_WithAdditions")
    }


    // -------------------------------------------------
    // THIS OBJECT HAS AT LEAST ONE AWS S3 ITEM
    hasAwsS3Items(){
    	return ( this.hasOwnProperty('AwsS3Items') && this.AwsS3Items.length>0 )
    }
    // GET THE FIRST AWS S3 ITEM
    getFirstAwsS3Item(){
    	if(this.hasAwsS3Items()) return this.AwsS3Items[0]
    	return null;
    }
    // GET THE URL OF THE PRIMARY S3 ITEM
    getMyPrimaryImageUrl(mode){
    	var primaryAwsS3Item = this.getFirstAwsS3Item()
    	if(primaryAwsS3Item){
    		var myPrimaryAwsS3ItemKey = primaryAwsS3Item.key;
	    	var myPrimaryAwsS3ItemUrl = mf.modeGet_LabradorAwsS3ImageUrlDownload(mode,myPrimaryAwsS3ItemKey)
	    	return myPrimaryAwsS3ItemUrl;
    	}else{
    		return null;
    	}
    }

    // -------------------------------------------------

}