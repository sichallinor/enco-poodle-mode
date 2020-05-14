

import { default as mf } from './ModeFunctions_Crud.js'

//module.exports = class Mode {
export default class ModeInterface_Crud {



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






}