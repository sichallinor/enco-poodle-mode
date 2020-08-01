// NOTE THAT A MODE INTERFACE IS A CLASS THAT CAN BE ADDED TO A MODE OBJECT 
// IN ORDER TO EMBELISH THE MODE WITH ADDITIONAL POWERS

import { default as mf } from './ModeFunctions_Api.js'

//module.exports = class Mode {
export default class ModeInterface_Api {



    // ---------------------------------
    // MODE MANIPULATION FUNCTIONS
    //   API RELATED FUNCTIONS



    mfGetItems(){
    	return mf.modeGetItems(this);
    }


    mfStore(){
    	return mf.modeStore(this);
    }

    mfUpdate(){
       	return mf.modeUpdate(this);
    }


    mfCreate(){
       	return mf.modeCreate(this);
    }


    mfDelete(){
       	return mf.modeDelete(this);
    }


    mfBulkStore(){
        return mf.modeBulkStore(this);
    }




}