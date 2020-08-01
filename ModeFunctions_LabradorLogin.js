
//----------------
// POODLE-API_INTERFACE IN DEV MODE
//var poodleApiInterface = require('enco-poodle-api-interface');
//var poodleApiInterface = require('../REPO_TDR_ENCO_POODLE_API_INTERFACE/index.js');
//import poodleApiInterface from '../REPO_TDR_ENCO_POODLE_API_INTERFACE/index';
import poodleApiInterface from 'enco-poodle-api-interface';

export default {

    // NOTE THAT THESE "MODE FUNCTIONS" CAN BE IMPORTED EASILY INTO ANY PROJECT WITHOUT THE OVERHEAD OF THE FULL MODE CLASS
    // ---------------------------------
    // MODE MANIPULATION FUNCTIONS
    //   MODEL AND ITEMS RELATED FUNCTIONS

    // These functions accept a mode object (albeit NO EXPECTATIONS other than a JS object) ...
    // Any ASSUMPTIONS about mode are checked and should not be REQUIRED
    // plus accept any other input ...
    // then manipulate the mode in order to produce the finished mode


    modeAuthenticateIfNecessary(mode){
        //console.log("actionGetItems : MODE :",this.mode_for_items.reference);
        //self.mode_master.is_reading = true;
        return poodleApiInterface.authenticateIfNecessary(mode);
    },

    // THIS FUNCTION SIMPLY TESTS AN EXISTING TOKEN AND RETURNS THE USER PROFILE JUST LIKE AUTHENTICATION
    modeLoginCheck(mode){
        return poodleApiInterface.loginCheck(mode);
    },

    modeLogout(mode){
        //console.log("actionGetItems : MODE :",this.mode_for_items.reference);
        //self.mode_master.is_reading = true;
        return poodleApiInterface.logout(mode);
    },

    modeRegister(mode){
        return poodleApiInterface.register(mode);
    },


}

