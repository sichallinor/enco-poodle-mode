
//----------------
// POODLE-API_INTERFACE IN DEV MODE
//var poodleApiInterface = require('enco-poodle-api-interface');
//var poodleApiInterface = require('../REPO_TDR_ENCO_POODLE_API_INTERFACE/index.js');
//import poodleApiInterface from '../REPO_TDR_ENCO_POODLE_API_INTERFACE/index';
import poodleApiInterface from 'enco-poodle-api-interface';

//----------------
// POODLE-JSON-SCHEMA IN DEV MODE
//var poodleJsonSchema = require('enco-poodle-json-schema');
//var poodleJsonSchema = require('../REPO_TDR_ENCO_POODLE_JSON_SCHEMA/index.js');
//import poodleJsonSchema from '../REPO_TDR_ENCO_POODLE_JSON_SCHEMA/index';
import poodleJsonSchema from 'enco-poodle-json-schema';


export default {

    // NOTE THAT THESE "MODE FUNCTIONS" CAN BE IMPORTED EASILY INTO ANY PROJECT WITHOUT THE OVERHEAD OF THE FULL MODE CLASS
    // ---------------------------------
    // MODE MANIPULATION FUNCTIONS
    //   MODEL AND ITEMS RELATED FUNCTIONS

    // These functions accept a mode object (albeit NO EXPECTATIONS other than a JS object) ...
    // Any ASSUMPTIONS about mode are checked and should not be REQUIRED
    // plus accept any other input ...
    // then manipulate the mode in order to produce the finished mode


    modeGetItems(mode){
        //console.log("actionGetItems : MODE :",this.mode_for_items.reference);
        //self.mode_master.is_reading = true;
        return new Promise(function(resolve, reject) {
            var prom = poodleApiInterface.getItems(mode);
            if(prom){
                prom.then(function(response) {
                  console.log("FINAL NUM ITEMS :",response, mode.items.length);
                  resolve(response);
                }, function(err) {
                  reject("ERROR : NOTHING TO DO");
                });
            }else{
                console.log("ERROR : NOTHING TO DO");
                resolve("ERROR : NOTHING TO DO");
            }
        });
    },




    modeStore(mode){
        mode.mLog("mfStore");

        // get the identity field from the schema
        var identityField = poodleJsonSchema.getFieldIdentity(mode);
        var typeField = 'type';

        var prom;
        if(mode['models'].length > 0 && mode['models'][0].hasOwnProperty(identityField)) {
            // SET THE IDENTITY
            mode['identity'] = mode['models'][0][identityField];
            // SET THE TYPE
            mode['filter_type'] = mode['models'][0][typeField];

            console.log("mfStore : will be updating : ",mode.reference); 
            prom = this.modeUpdate(mode); 
        }else{
            console.log("mfStore : will be creating : ",mode.reference);
            prom = this.modeCreate(mode);
        }

        return prom;

        /*
        prom.then(function() {
            console.log("mfStore : STORED");
        }, function(err) {
            console.log("mfStore : ERROR",err);
        });*/

    },

    modeUpdate(mode){
        mode.mLog("mfUpdate");

        mode.is_updating = true;
        //-------
        return new Promise(function(resolve, reject) {

            var promUpdate = poodleApiInterface.updateItem(mode)
            if(promUpdate){
                promUpdate.then(function(response) {
                    mode.is_updating = false;
                    resolve(response);
                }, function(err) {
                    mode.is_updating = false;
                    reject();
                });
            }else{
                console.log("modeUpdate : NOTHING TO DO, OR NO INTERFACE");
                mode.is_updating = false;
                resolve();
            }
        });
    },


    modeCreate(mode){
        mode.mLog("mfCreate");

        mode.is_creating = true;
        return new Promise(function(resolve, reject) {
            console.log("mfCreate : starting to create");        
            var promToCreate = poodleApiInterface.createItem(mode)
            if(promToCreate){
                promToCreate.then(function(response) {
                    mode.is_creating = false;
                    resolve(response);
                }, function(err) {
                    mode.is_creating = false;
                    reject();
                });
            }else{
                console.log("modeCreate : nothing to do");
                mode.is_creating = false;
                resolve();
            }

        });
    },


    modeDelete(mode){
        mode.mLog("mfDelete");

        // get the identity field from the schema
        var identityField = poodleJsonSchema.getFieldIdentity(mode);
        identityField = ( identityField ) ? identityField : 'id';
        console.log("handleDelete : identify field : ",identityField)

        return new Promise(function(resolve, reject) {

            // ---------------------------------

            if(mode['models'].length > 0 && mode['models'][0].hasOwnProperty(identityField)) {
                console.log("mfDelete : ready to delete")
                var identityValue = mode['models'][0][identityField];

                // --------------------------------
                // SET THE IDENTITY IN THE MODE ... LEGACY
                mode['identity'] = identityValue;
                //---------------------------------

                var prom = poodleApiInterface.deleteItem(mode);
                // THE EXECUTE THE PROMISE
                if(prom) {
                    prom.then(function(response) {
                        console.log("DELETED : ", response);
                        resolve(response);
                    }, function(err) {
                        console.log("ERROR");
                        reject();
                    });
                }else{
                    reject();
                }
            }else{
                console.log("mfDelete : model or identity is missing, ",mode.models)
                reject();
            }


        });
    },


    modeBulkStore(mode){
        mode.mLog("modeBulkStore");

        mode.is_updating = true;
        //-------
        return new Promise(function(resolve, reject) {

            var promUpdate = poodleApiInterface.updateItems(mode)
            if(promUpdate){
                promUpdate.then(function(response) {
                    mode.is_updating = false;
                    resolve(response);
                }, function(err) {
                    mode.is_updating = false;
                    reject();
                });
            }else{
                console.log("modeUpdate : NOTHING TO DO, OR NO INTERFACE");
                mode.is_updating = false;
                resolve();
            }
        });

    },

}

