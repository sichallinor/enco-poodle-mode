// NOTE THAT A MODE INTERFACE IS A CLASS THAT CAN BE ADDED TO A MODE OBJECT 
// IN ORDER TO EMBELISH THE MODE WITH ADDITIONAL POWERS

import { default as mf } from './ModeFunctions_LabradorLogin.js'

//module.exports = class Mode {
export default class ModeInterface_LabradorLogin {



    // ---------------------------------
    // MODE MANIPULATION FUNCTIONS
    //   API RELATED FUNCTIONS


    mfAuthenticateIfNecessary(){
    	return mf.modeAuthenticateIfNecessary(this);
    }

    // THIS FUNCTION SIMPLY TESTS AN EXISTING TOKEN AND RETURNS THE USER PROFILE JUST LIKE AUTHENTICATION
    mfLoginCheck(){
    	return mf.modeLoginCheck(this);
    }


    mfLogout(){
    	return mf.modeLogout(this);
    }

    mfRegister(){
        return mf.modeRegister(this);
    }

}