// NOTE THAT A MODE INTERFACE IS A CLASS THAT CAN BE ADDED TO A MODE OBJECT 
// IN ORDER TO EMBELISH THE MODE WITH ADDITIONAL POWERS

import { mfModelAndItems as mf } from 'enco-poodle-mode-simple';



//module.exports = class Mode {
export default class ModeInterface_ModelAndItems {


    // ---------------------------------
    // MODE MANIPULATION FUNCTIONS
    //   MODEL AND ITEMS RELATED FUNCTIONS

    mfCreateNew(template={},autoIncreaseWorkflow=true,autoAddToItems=true,autoStore=false) {
        mf.modeCreateNew(this,template,autoIncreaseWorkflow,autoAddToItems,autoStore);
    }


    mfAddItem(obj){
        mf.modeAddItem(this,obj);
    }

    // Add 'items' an array of items 
    mfAddItems(items){
        mf.modeAddItems(this,items)
    }

    // Set the first Model (results in 1 item only in the models array)
    mfSetModel(model){
        mf.modeSetModel(this,model)
    }

    // SET ALL MODELS ARE CLEAN (_DIRTY FLAG TO FALSE)
    mfSetModelsAreClean(){
        mf.modeSetModelsAreClean(this)
    }


    // EMPTY THE MODELS ARRAY
    mfEmptyModels(){
        mf.modeEmptyModels(this)
    }


    // MARK THE MODEL AS DELETED
    mfSetModelMarkDeleted(){
        mf.modeSetModelMarkDeleted(this)

    }

    // UPDATE ALL THE BULK ITEMS BASED ON THE BULK MODEL
    mfBulkUpdate(){
        mf.modeBulkUpdate(this)        
    }

    // EMPTY THE MODELS ARRAY
    mfRemoveDeletedItems(){
        mf.modeRemoveDeletedItems(this)
    }


    // REPLACE THE CURRENT MODEL BY SCANNING THROUGH (A RECENTLY UPDATED) ITEMS LIST AND MATCHING ON THE IDENTITY FIELD
    mfUpdateCurrentModelFromItemsByIdentityMatch(){
        mf.modeUpdateCurrentModelFromItemsByIdentityMatch(this)
    }


    // ------------------------------------






}