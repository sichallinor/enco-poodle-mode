'use strict';


//----------------
// POODLE-UTILS IN DEV MODE
//var poodleUtils = require('enco-poodle-utils');
//var poodleUtils = require('../REPO_TDR_ENCO_POODLE_UTILS/index.js');
//import poodleUtils from '../REPO_TDR_ENCO_POODLE_UTILS/index.js';
import poodleUtils from 'enco-poodle-utils';
//----------------
// GET THE LOG
var log = poodleUtils.getLog();

//----------------
// POODLE-JSON-SCHEMA IN DEV MODE
//var poodleJsonSchema = require('enco-poodle-json-schema');
//var poodleJsonSchema = require('../REPO_TDR_ENCO_POODLE_JSON_SCHEMA/index.js');
//import poodleJsonSchema from '../REPO_TDR_ENCO_POODLE_JSON_SCHEMA/index';
import poodleJsonSchema from 'enco-poodle-json-schema';


//var poodleModePrimatives_Set1 = require('./primatives/primatives_set1.js');
//var poodleModePrimatives_Set2 = require('./primatives/primatives_set2.js');
import poodleModePrimatives_Set1 from './primatives/primatives_set1.js';
import poodleModePrimatives_Set2 from './primatives/primatives_set2.js';




//module.exports = class Mode {
export default class Mode {

    constructor() {


        //--------------------------------------------
        // PROXY
        //target is the object being proxied (original, in our case).
        //name is (of course) the name of the property being retrieved, which is usually a string but could also be a Symbol.
        //receiver is the object that should be used as 'this' in the getter function if the property is an accessor rather than a data property. 
        //   In the normal case this is the proxy or something that inherits from it, but it can be anything since the trap may be triggered by Reflect.get.
        var self = this
        return new Proxy(this, {
            getOwnPropertyDescriptor(target, property) {
                var pt = Mode.ProxyTarget(target,property)
                var pp = Mode.ProxyProperty(target,property)
                // if the proxy property is 'self' ... it means return the proxy target as the value of the property
                if(pp==='self') return { configurable: true, enumerable: true, value: pt };
                if(pp==='self.values' && typeof pt === 'object') return { configurable: true, enumerable: true, value: pt };
                return Object.getOwnPropertyDescriptor(pt, pp);
                /*
                //console.log("PROXY_getOwnPropertyDescriptor",target,property)
                if (pp) {
                    return Object.getOwnPropertyDescriptor(pp, property);
                }else{
                    return Object.getOwnPropertyDescriptor(target, property);
                } */
            },
            get(target, name, receiver) {
                var pt = Mode.ProxyTarget(target,name)
                var pp = Mode.ProxyProperty(target,name)
                // if the proxy property is 'self' ... it means return the proxy target as the value of the property
                if(pp==='self') return pt;
                if(pp==='self.values' && typeof pt === 'object') return Object.values(pt);
                return Reflect.get(pt, pp, receiver);
                /*
                //let rv = Reflect.get(target, name, receiver);
                if (pp) {

                    var res = Reflect.get(pp, name, receiver);
                    //console.log("PROXY_get_active",res,target,name,receiver)
                    return res;
                }else{
                    var res = Reflect.get(target, name, receiver);
                    //console.log("PROXY_get_default",res,target,name,receiver)
                    return res;
                }*/
            },
            set(target, name, value, receiver) {
                var pt = Mode.ProxyTarget(target,name)
                var pp = Mode.ProxyProperty(target,name)
                // if the proxy property is 'self' ... setting a value needs to modify the original property on the original object
                // (ie.  when setting ... bypass the proxy all together)
                // actually ... you may consider that the proxy should be removed after this ... 
                // because if the proxy remains .... setting a value would have no effect 
                // also note ... we may consider doing nothing for properties like this ... set nothing
                if(pp==='self') return Reflect.set(target, name, value, receiver);
                if(pp==='self.values') return Reflect.set(target, name, value, receiver);
                return Reflect.set(pt, pp, value, receiver);

                /*
                if (pp) {
                    //if (!Reflect.has(target, name)) {
                    //    console.log(`Setting non-existent property '${name}', initial value: ${value}`);
                    //}
                    //console.log("PROXY_set_active",target.active_mode,target,name,value,receiver)
                    return Reflect.set(pp, name, value, receiver);
                }else{
                    //console.log("PROXY_set_default",target,name,value,receiver)
                    return Reflect.set(target, name, value, receiver);
                }  */
            }
        });
        //--------------------------------------------


    }  

    //--------------------------------------------------
    // PROXY RELATED FUNCTIONS

    // originalTarget : the original object being proxied (THIS object)
    // name : the name of the property we are interested in
    static ProxyTarget(originalTarget,name,debug=false){
        if (originalTarget.hasOwnProperty('proxy') 
                && originalTarget.proxy.hasOwnProperty(name) ){
            //-------
            if(originalTarget.proxy[name] instanceof Mode && originalTarget.proxy[name] !== originalTarget) {
                //the proxy is a mode ... use it as the override target 
                return originalTarget.proxy[name];
            }else if(typeof originalTarget.proxy[name] === 'object' && originalTarget.proxy[name] ){
                //get the override target from a proxy object
                return Mode.ProxyTargetFromObject(originalTarget,originalTarget.proxy[name],debug)
            }else{
                return originalTarget;
            }
        }else{
            return originalTarget;
        }
    }
    static ProxyProperty(originalTarget,name){
        if (originalTarget.hasOwnProperty('proxy') 
                && originalTarget.proxy.hasOwnProperty(name) ){
            //-------
            if(typeof originalTarget.proxy[name] === 'string'  && originalTarget.proxy[name] !== name) {
                //the proxy is a string ... use it as the override property 
                return originalTarget.proxy[name];
            }else if(typeof originalTarget.proxy[name] === 'object' && originalTarget.proxy[name]){
                //get the override property name from a proxy object
                return Mode.ProxyPropertyFromObject(name,originalTarget.proxy[name])
            }else{
                return originalTarget;
            }

        }else{
            return name;
        }
    } 
    //get the override target from a proxy object
    static ProxyTargetFromObject(originalTarget,obj,debug=false){
        if( obj.hasOwnProperty('target') && obj.target){
            if(typeof obj.target === 'string'){
                if(String(obj.target).startsWith('FUNC:') || String(obj.target).startsWith('RTFUNC:') ){
                    var res = this.executeDynamicFunction( obj.target ,originalTarget,originalTarget,originalTarget);
                    return res ? res : obj.target;
                }else{
                    return obj.target; // proxy object's target property ... returns a string from here
                }
            }else{
                return obj.target; // proxy object's target property ... returns a Mode or Object from here
            }
        }else{
            return originalTarget; // the original (underlying) object
        }
    }
    //get the override property name from a proxy object
    static ProxyPropertyFromObject(originalPropertyName,obj){
        if( obj.hasOwnProperty('property') && obj.property){
            return obj.property;
        }else{
            return originalPropertyName;
        }
    }
    //--------------------------------------------------




    // -------------------------------------------------
    // STATIC METHODS (UNIVERSE)
    static createUniverse(){
        // create a location for the raw primatives
        Mode.raw_primatives_dictionary = {}

        var mode_universe_raw = {
                reference : "mode_universe",
                primatives : ['primative'],
                raw_primatives_dictionary: null,
                raw_primatives: null,
                modes: [],
                schemas: []
            };

        var clone = this.parseRawObject(mode_universe_raw,null)
        // else convert it to a REAL Mode (plus all its children modes)
        Mode.mode_universe = this.createModeFromPrimatives(clone);  //Object.assign(new Mode, obj)

        // add all the schemas to the universe
        poodleJsonSchema.initHardCoded()
        Mode.mode_universe.schemas.push( ...poodleJsonSchema.schemas );

        // link raw primatives into the universe
        Mode.mode_universe.raw_primatives_dictionary = Mode.raw_primatives_dictionary;

        // add primatives from set 1
        Mode.addPrimativesToUniverse_fromSet( poodleModePrimatives_Set1 );
        // add primatives from set 2
        Mode.addPrimativesToUniverse_fromSet( poodleModePrimatives_Set2 );


    }
    static addPrimativesToUniverse_fromSet(setOfPrimatives){
        Object.assign( Mode.raw_primatives_dictionary, setOfPrimatives);
        // AFTER EACH ADDITION ... 
        Mode.mode_universe.raw_primatives = Object.values(Mode.raw_primatives_dictionary);  
    }    
    static addModeToUniverse(newMode){
        // --------------------------------------------
        // ADD THIS MODE TO THE UNIVERSE'S MODES ARRAY
        //     ASSUMING NOT ALREADY PRESENT
        if(!Mode.mode_universe.modes.includes(newMode)){
           Mode.mode_universe.modes.push(newMode);
        }
        // --------------------------------------------
        // CHECK THAT THE UNIVERSE HAS THE ALL PROPERTY - READY TO ACCEPT MODES BY REF
        if(!Mode.mode_universe.hasOwnProperty('child')) Mode.mode_universe['child'] = {};
        // -------------------------------------------
        // THEN ADD TO ALL
        if(newMode.hasOwnProperty('reference')){
            Mode.mode_universe.child[newMode.reference] = newMode;
        }

    }
    // -------------------------------------------------
    // STATIC METHODS (MODE)
    // obj : the RAW mode, a simple object to create a Mode from
    // parent : a parent Mode
    // modeRegistry : a simple Object containing all the RAW modes, each as simple Objects
    //   this will likely be a config file containing all the modes for a particular application
    // 
    static createMode(obj,parent=null,modeRegistry=null){
        //1) FIRST CHECK IF THE UNIVERSE EXISTS (CREATE IF NOT)
        if(!Mode.mode_universe) Mode.createUniverse();
        //2) THEN CREATE THE MODE HIERARCHY (FROM THE RAW OBJECT)
        var newMode = Mode.createModeHierarchy(obj,parent,modeRegistry);
        //3) CONVERT ALL THE RESEVED WORDS (WITHIN THIS NEW MODE AND ITS DECENDANTS)
        this.convertResevedWords(newMode, newMode, (parent ? parent : newMode) );


        return newMode;
    } 

    static createModeHierarchy(obj,parent=null,modeRegistry=null){
        //console.log("createModeHierarchy : ",parent)
        if(obj instanceof Mode) return obj;
        // clone the RAWMODE and also converts any mode_references (into cloned RAWMODES) throughout the complete hiererachy
        // NOTE THAT mode_references ARE REFERENCES TO RAW MODES THAT EXIST OUTSIDE THE CURRENT MODE (BUT WITHIN THE RAW MODE REGISTRY)
        //console.log("parseRawObject : (cre) ", obj.reference)
        var clone = Mode.parseRawObject(obj,modeRegistry)
        // else convert it to a REAL Mode (plus all its children modes)
        var newMode = Mode.createModeFromPrimatives(clone);  //Object.assign(new Mode, obj)

        Mode.ensureChildrenModes(newMode,modeRegistry);
        newMode.initialiseAll();

        //4) CHECK AND RUN ANY 'action_after_construct' ACTION
        newMode.action_after_construct();

        // ---------------------------------------
        //4) ADD THIS NEW MODE TO THE UNIVERSE
        if(obj.hasOwnProperty('namespace')){
            //console.log("ADDING_TO_UNIVERSE");
            Mode.addModeToUniverse(newMode)
        }

        // ---------------------------------------

        return newMode;
    }
    // 1) Ensures all children modes are also an instance of MODE
    // 2) create the 'children' object and populate with all the child modes (BY REF)
    //      Note ... 'child' property is a OBJECT and contains modes by REF ... 
    //               'modes' is just an ARRAY of modes
    static ensureChildrenModes(mode,modeRegistry=null){
        //-----------------------------------
        // CONVERT RAW MODES >> MODES
        if( mode.hasOwnProperty('modes') ) {
            var children = {}; 
            mode['child'] = children;
            for(var i=0; i<mode.modes.length; i++){
                var aChild = Mode.createModeHierarchy(mode.modes[i],mode,modeRegistry);
                mode.modes[i] = aChild;
                if(aChild.hasOwnProperty('reference')){
                    children[aChild.reference] = aChild;
                }
            }
        }
        //-----------------------------------
        // CONVERT RAW COMPONENTS >> MODES
        if( mode.hasOwnProperty('components') ) {
            for(var i=0; i<mode.components.length; i++){
                var aComponent = Mode.createModeHierarchy(mode.components[i],mode,modeRegistry);
                mode.components[i] = aComponent;
            }
        }
        //-----------------------------------
        // CONVERT RAW COMPONENTS >> MODES
        if( mode.hasOwnProperty('proxy') ) {
            var aProxy = Mode.createModeHierarchy(mode.proxy,mode,modeRegistry);
            mode.proxy = aProxy;
        }
    }


    // clone the RAWMODE and also converts any mode_references (into cloned RAWMODES) throughout the complete hiererachy
    // NOTE THAT mode_references ARE REFERENCES TO RAW MODES THAT EXIST OUTSIDE THE CURRENT MODE (BUT WITHIN THE RAW MODE REGISTRY)
    static parseRawObject(obj,modeRegistry=null){
        // CLONE THE OBJECT FIRST
        //console.log("parseRawObject : ", obj.reference,obj)
        var clone = JSON.parse(JSON.stringify(obj)) ;

        // ----------------------------------------------------------------------
        // IF THERES A MODE REGISTRY AVAILABLE, AND MODE REFERENCES WITHIN THIS CLONE
        if(modeRegistry && clone.hasOwnProperty('mode_references')){
            // if we have mode_references, ensure the object also has modes property (as an array)
            if(!clone.hasOwnProperty('modes')) clone['modes'] = [];
            //console.log("parseRawObject 1")
            // LOOP THROUGH THE mode_references
            for(var i=0; i<clone.mode_references.length; i++){
                //console.log("parseRawObject 2")
                var reference = clone.mode_references[i];
                // CAN WE LINK TO A PREVIOUSLY EXISTING MODE HERE ... RATHER THAN PARSING FROM RAW EACH TIME
                //-------------------------------------------
                //FIND IF THE modeRegistry has a mode with this reference
                if(modeRegistry.hasOwnProperty(reference)){
                    //console.log("parseRawObject 3")
                    var rawMode = modeRegistry[reference];
                    //console.log("parseRawObject (int): ", obj.reference,":",reference)
                    var rawClone = this.parseRawObject(rawMode,modeRegistry);
                    clone['modes'].push(rawClone);
                }
                //-------------------------------------------
            }  
        }
        // ----------------------------------------------------------------------
        // IF THERES SCHEMA REFERENCES WITHIN THIS CLONE
        if(clone.hasOwnProperty('schema_references')){
            // if we have mode_references, ensure the object also has modes property (as an array)
            if(!clone.hasOwnProperty('schemas')) clone['schemas'] = [];
            //this may cause a problem later ... (assuming only one schema)
            clone['schemas'].length = 0;
            // LOOP THROUGH THE schmema_references
            for(var i=0; i<clone.schema_references.length; i++){
                //console.log("parseRawObject (2): ",obj.reference)
                var reference = clone.schema_references[i];
                //FIND IF THE poodleJsonSchema has a schema with this reference
                var myschema = poodleJsonSchema.getSchemaByRef(reference);

                if(myschema && !clone['schemas'].includes(myschema)) clone['schemas'].push(myschema);
                //console.log("parseRawObject (2b): ",obj.reference,clone['schemas'].length)
                
            } 
        }

        return clone;
    }

    // 1) Create a new MODE object, 
    // 2) assign all the properties of the all the primatives, from the 'original' RAW mode
    // 3) assign all the other properties of the 'original' RAW mode (these supercede the primatives)
    // obj : the 'original' RAW mode (cloned) on whoch to BASE
    static createModeFromPrimatives(obj){
        var newMode = new Mode;
        if ( obj.hasOwnProperty('primatives') ){
            for(var i=0; i<obj.primatives.length; i++){
                var primativeName = obj.primatives[i];
                if(Mode.raw_primatives_dictionary.hasOwnProperty(primativeName) ){
                    var primative = Mode.raw_primatives_dictionary[primativeName];
                    var primative_clone = JSON.parse(JSON.stringify(primative)) ;
                    newMode = Object.assign(newMode, primative_clone);
                }
            }
        }
        Object.assign(newMode, obj)
        //console.log("createModeFromPrimatives : created : ",obj.reference)
        return newMode;
    }




    // 1) obj : the object to look for reserved words inside
    // 2) mode : the most recent mode (note that obj can be any object, mode must be a mode)
    // 3) parent : the most recent parent mode
    static convertResevedWords(obj,mode,parent=null){

        for (var prop in obj){

            if (prop!=='function'){ // EXCLUDE FUNCTIONS - BECAUSE THESE ARE REAL TIME DYNAMIC FUNCTIONS


                if(typeof obj[prop] === 'string' && obj[prop].length>0){


                    var proxTarget = null;

                    if(obj[prop]==='THIS'){
                        //console.log("THIS : ",obj)
                        obj[prop] = obj;

                        // NEW CODE
                        proxTarget = "RTFUNC: return self;"
                    }
                    if(obj[prop]==='MODE'){
                        //console.log("MODE : ",mode)
                        obj[prop] = mode;

                        // NEW CODE
                        proxTarget = "RTFUNC: return mode;"
                    }
                    if(obj[prop]==='PARENT'){
                        //console.log("PARENT : ",obj)
                        obj[prop] = parent;

                        // NEW CODE
                        proxTarget = "RTFUNC: return parent;"
                    }

                    if(String(obj[prop]).startsWith('FUNC:')){
                        // NEW CODE
                        proxTarget = obj[prop].replace('FUNC:','RTFUNC:');

                        //var funcStr = obj[prop].split(":");
                        obj[prop] = this.executeDynamicFunction( obj[prop] ,obj,mode,parent);


                    }

                    // --------------------------------------------
                    // NEW ... to convert RESEVERVED words to A PROXY 
                    // BEFORE the origial "convertResevedWords" does its magic
                    if(proxTarget){
      
                        if(!obj.hasOwnProperty('proxy')) obj['proxy'] = {};
                        var prox = obj['proxy'];
                        var proxObj = {'target1':proxTarget, 'property1':'self'}; //{'property':'self'}
                        prox[prop] = proxObj;
                        // --------------------------------------------
                    }



                }





            }

            //if(typeof obj[prop] === 'object' &&  obj[prop] !== null ){
            //    this.convertResevedWords(obj[prop],mode,parent)
            //}
        }
        if( obj.hasOwnProperty('proxy') && typeof obj === 'object') {
            this.convertResevedWords(obj.proxy, mode, parent,true);
        }
        if( obj.hasOwnProperty('actions') ) {
            for(var i=0; i<obj.actions.length; i++){
                this.convertResevedWords(obj.actions[i], mode, parent,true);
            }
        }
        if( obj.hasOwnProperty('components') ) {
            for(var i=0; i<obj.components.length; i++){
                this.convertResevedWords(obj.components[i], mode, parent);
            }
        }
        // AND UP THE HIERARCHY
        if( obj.hasOwnProperty('modes') ) {
            for(var i=0; i<obj['modes'].length; i++){
                this.convertResevedWords(obj.modes[i],obj.modes[i], mode);
            }
        }
    }

    // Run a function
    static executeDynamicFunction(functionStr,self,mode,parent){
        if(String(functionStr).startsWith('FUNC:')) functionStr = functionStr.split(":")[1];
        if(String(functionStr).startsWith('RTFUNC:')) functionStr = functionStr.split(":")[1];

        //console.log("executeDynamicFunction : ", functionStr,self,mode,parent)

        // now execute the real function
        var result = null;
        try{
            var myFunc = new Function('self','mode','parent','universe', functionStr);
            result = myFunc(self,mode,parent,Mode.mode_universe);

        }catch(ex){
            //console.log("executeDynamicFunction_error : ",ex,functionStr)
        }
        return result;
    }


    // ==================================================
    // ACTIONS


    // A function to return a single action based on its reference
    getActionByReference(reference){
        if( this.hasOwnProperty('actions') ) {
            for(var i=0; i<this.actions.length; i++){
                var action = this.actions[i];
                if(action.hasOwnProperty('reference') && action.reference===reference){
                    return action;
                }
            }
        }
        return null;
    }

    // RUN THE ACTION AFTER CONSTRUCT
    action_after_construct(){
        //console.log('action_after_construct')
        var action_name = 'action_after_construct';
        var action = this.getActionByReference(action_name)
        if(action){
            // 1) HANDLE THE ACTION HERE
            if(action.hasOwnProperty('function')){
                //console.log("handleAction : FUNCTION : action_after_construct");
                if(action.function) Mode.executeDynamicFunction(action.function,this,this,null);
            }
        }
    }


    // ==================================================



    // Function to set a property with the same value in all child modes
    setInAllChildModes(propName,propVal){
        if(this.hasOwnProperty('modes')){
            for(var i=0; i<this.modes.length; i++){
              var childMode = this.modes[i];
              childMode[propName] = propVal;
            }
        }
    }

    aggregateChildrensData(clear=true){
        if( this.hasOwnProperty('modes') ){
            if(clear){
                this.items.length = 0;
                this.models.length = 0;
            }
            for(var i=0; i<this.modes.length; i++){
                var childMode = this.modes[i];
                if(childMode.mode_type && childMode.mode_type==='items'){
                    if(childMode.hasOwnProperty('items')) this.items.push( ...childMode.items );
                    if(childMode.hasOwnProperty('models')) this.models.push( ...childMode.models );
                }
            }
        }
        if(this.models) console.log("aggregateChildrensData : ",this.models.length)
    }


    // --------------------------------------
    // CANVAS
    getNewCanvasObject(){
        return {visible:true, active:false, x:20, y:20, z:0, w:500, h:300, mode: this};
    }


    // ---------------------------------------
    // TRACE
    trace(){
        var allModesAndMeta = [];
        // getAllConnectedModes - finds all modes in the hierarchy via ANY references
        //           modeToRef=false ... so follow this mode to its children
        allModesAndMeta.push( ...Mode.getAllConnectedModes(this,false,true,[],null) );
        for (var i = 0; i < allModesAndMeta.length; i++){
            //console.log("TRACED : ",allModesAndMeta[i].mode.reference, allModesAndMeta[i].meta );
        }
    }


    // ---------------------------------------
    // EXPORT
    export(){
        var completeExport = {};

        var allModes = [];
        allModes.push( this );
        // getAllConnectedModes - finds all modes in the hierarchy via ANY references
        allModes.push( ...Mode.getAllConnectedModes(this,false) );
        for (var i = 0; i < allModes.length; i++){
            console.log("EXPORTING : ",allModes[i].reference);
        }
        for (var i = 0; i < allModes.length; i++){
            var myExport = Mode.exportClone(allModes[i],false,'func');
            completeExport[ allModes[i].reference ] = myExport;
        }
        console.log( "RESULT : ", JSON.stringify(completeExport,null,2) );

    }
    static exportClone(obj,modeToRef=true,modeRefStyle='func'){
        

        if(typeof obj==='string'){
            return obj;
        }else if(Array.isArray(obj)){
            var cloneObj = [];
            for (var i = 0; i < obj.length; i++) cloneObj.push( Mode.exportClone(obj[i],true,modeRefStyle) )
            return cloneObj;
        }else if(obj instanceof Mode && modeToRef){
            if(obj.hasOwnProperty('reference')){
                if(modeRefStyle==='func'){
                    return 'FUNC: return universe.child.' + obj.reference;
                }else{
                    return obj.reference;
                }
            }
            console.log("UNKNOWN_MODE")
            return null;
        }else if(typeof obj==='object' && obj!==null && modeRefStyle==='simple'){
            // THIS CONDITION TO SATISFY SCHEMA REFERENCES (WHICH ARE NOT MODES YET)
            // EXPORTED AS SIMPLE TEXT ... (NOT A FUNCTION)
            return obj.reference;
        }else if(typeof obj==='object' && obj!==null){

            if(obj.hasOwnProperty('reference')) console.log("M:",obj.reference)
            var cloneObj = {};
            for(var k in obj) {
                if(k==='child'){
                    //SPECIAL CONDITION - child property is ignored (it is ONLY dynamically created at runtime)
                    // IGNORE                    
                }else if(k==='modes'){
                    //SPECIAL CONDITION - when modes, place references into 'mode_references' instead
                    cloneObj['mode_references'] = Mode.exportClone(obj[k],true,'simple')
                    cloneObj['modes'] = [];
                }else if(k==='items'){
                    //SPECIAL CONDITION - items are emptied unless 'items_hardcoded' is specified as TRUE
                    if(obj.hasOwnProperty('items_hardcoded') && obj.items_hardcoded){
                        cloneObj['items'] = Mode.exportClone(obj['items'],true,modeRefStyle)
                    }else{
                        cloneObj['items'] = [];
                    }
                }else if(k==='models'){
                    //SPECIAL CONDITION - items are emptied unless 'items_hardcoded' is specified as TRUE
                    if(obj.hasOwnProperty('models_hardcoded') && obj.models_hardcoded){
                        cloneObj['models'] = Mode.exportClone(obj['models'],true,modeRefStyle)
                    }else{
                        cloneObj['models'] = [];
                    }
                }else if(k==='schemas'){
                    //SPECIAL CONDITION - when schemas, place references into 'schema_references' instead
                    cloneObj['schema_references'] = Mode.exportClone(obj[k],true,'simple')
                    cloneObj['schemas'] = [];
                }else{
                    cloneObj[k] = Mode.exportClone(obj[k],true,modeRefStyle)
                }
            }
            // ---------------------------------
            // SIMPLIFY ROUTINE ... removes any properties that are the same as the original primative
            if(cloneObj.hasOwnProperty("primatives")){
                var tempRaw = { "primatives":cloneObj.primatives }
                var tempModeFromPrimatives = Mode.createModeFromPrimatives(tempRaw);
                for(k in tempModeFromPrimatives) {
                    if(cloneObj.hasOwnProperty(k)) {
                        var orig = tempModeFromPrimatives[k]
                        var comp = cloneObj[k]
                        if((typeof orig==='object' || Array.isArray(orig)) && orig!==null ){
                            if(JSON.stringify(orig) === JSON.stringify(comp)) delete cloneObj[k];
                        }else{
                            if(orig == comp) delete cloneObj[k];
                        }
                    } 
                }
            }
            // ---------------------------------


            return cloneObj;
        }else{
            return obj;
        }   
    }
    // THIS FUNCTION RETURNS MODES THAT ARE DIRECTLY CONNECTED
    // modeToRef : IF YES (BY DEFAULT) THEN A MODE IS ADDED TO THE LIST AND NO FURTHER ACTION (NO DECENDANTS ARE TRACED ANY FURTHER), 
    //             IF NO THEN THE MODE IS NOT ADDED TO THE LIST, INSTEAD WE TRACE ITS DECENDANT MODES 
    // withMetaData :   IF YES THEN METADATA IS ACCUMULATED AND THE RETURN VALUE WILL BE AN ARRAY OF OBJECTS (MODE AND META)
    //                  IF NO THEN THE RETURN VALUE WILL BE AN ARRAY OF MODES 
    // metaList : CUMULATIVE PATH FOR THE METADATA ... 
    // metaParent : MOST RECENT OBJECT OR MODE (THAT THE TARGET MODE IS A CHILD WITHIN)
    static getAllConnectedModes(obj,modeToRef=true,withMetaData=false,metaList=[],metaParent=null){
        var allModes = [];
        if(Array.isArray(obj)){
            // if the OBJECT is an array then check each item
            for (var i = 0; i < obj.length; i++){
                var meta;
                if(withMetaData){
                    meta = [...metaList,"["+i+"]"] // copy everything in the path so far
                } 
                allModes.push( ...Mode.getAllConnectedModes(obj[i],true,withMetaData,meta,metaParent) )
            } 
        }else if(obj instanceof Mode && modeToRef){
            // if the OBJECT is actually a MODE (and modeToRef) ... then we ADD IT 
            var item;
            if(withMetaData) {
                var meta = [...metaList] // copy everything in the path so far
                item = {'mode':obj,'meta':meta,'meta_parent':metaParent}
            }else{
                item = obj;
            }
            allModes.push( item )
        }else if(typeof obj==='object' && obj!==null){
            // if the object is a normal object (or a mode when modeToRef=false) ... then check each property
            for(var k in obj){
                var meta;
                if(withMetaData){
                    meta = [...metaList,k] // copy everything in the path so far and add 'k' (this property key)
                } 
                allModes.push( ...Mode.getAllConnectedModes(obj[k],true,withMetaData,meta,obj) );
            }
        }
        // make unique (remove duplicates ... only works for modes without meta)
        var finalModes = [];
        for (var i = 0; i < allModes.length; i++){
            if( !finalModes.includes(allModes[i]) ) finalModes.push(allModes[i])
        }
        return finalModes;
    }




    // ---------------------------------------
    // PROPERTIES ...
    // GETTERS AND SETTERS

    // -------------------------------
    // filters used for querying the date range
    get filter_date_range() {
        return this.filter_date_range_;
    }
    set filter_date_range(value) {
        this.filter_date_range_ = value;
        this.initialiseFilterDateRange()
        this.setInAllChildModes('filter_date_range',value);
    }

    get filter_date_start() {
        return this.filter_date_start_;
    }
    set filter_date_start(value) {
        this.filter_date_start_ = value;
        this.setInAllChildModes('filter_date_start',value);
    }

    get filter_date_end() {
        return this.filter_date_end_;
    }
    set filter_date_end(value) {
        this.filter_date_end_ = value;
        this.setInAllChildModes('filter_date_end',value);
    }


    // -------------------------------
    // date range for the views
    get view_date_range() {
        return this.view_date_range_;
    }
    set view_date_range(value) {
        this.view_date_range_ = value;
        this.initialiseViewDateRange();
        this.setInAllChildModes('view_date_range',value);
    }

    get view_date_start() {
        return this.view_date_start_;
    }
    set view_date_start(value) {
        this.view_date_start_ = value;
        this.setInAllChildModes('view_date_start',value);
    }

    get view_date_end() {
        return this.view_date_end_;
    }
    set view_date_end(value) {
        this.view_date_end_ = value;
        this.setInAllChildModes('view_date_end',value);
    }


    // ---------------------------------------
    // ITEMS FUNCTIONS ...

    /*
    get all_items() {
        if( this.hasOwnProperty('items')){
            var i = this.items
            if( Array.isArray(i) ) return i;
            if( typeof i === 'object' && i!==null ){
                //get the proxy target for the items property
                //var pt = Mode.ProxyTarget(this,'items',true)
                if(i instanceof Mode){
                    if( i!==this){
                       return i.all_items 
                   }else{
                        this.mfAllItems_RefreshFromObject();
                        return i._all_items;
                   }
                } else {
                    //pt._all_items = Object.values(this);
                    return i._all_items;
                }
            } 
        }
        return [];
    }*/


    // ---------------------------------------
    // MODEL FUNCTIONS ...

    get first_model() {
        if( this.hasOwnProperty('models') && this.models.length>0){
            return this.models[0];
        }
        return {};
    }
    set first_model(value) {
        if(typeof value === 'object'){
            if( !this.hasOwnProperty('models')) this['models'] = [];
            this.models.length = 0;
            this.models.push(value)
        }
    }

    // ---------------------------------------

    get models_bulk() {
        return this.getDirtyItems();
    }
    set models_bulk(value) {
    }


    get models_bulk_needing_update() {
        var identityField = poodleJsonSchema.getFieldIdentity(this);
        if(!identityField) return [];
        return this.getDirtyItems().filter(
            function(item) {
                return ( item.hasOwnProperty(identityField) && item[identityField].length>0  )
            });
    }
    get models_bulk_needing_create() {
        var identityField = poodleJsonSchema.getFieldIdentity(this);
        if(!identityField) return [];
        return this.getDirtyItems().filter(
            function(item) {
                return ( !item.hasOwnProperty(identityField)  )
            });
    }



    // ---------------------------------------
    // SCHEMA FUNCTIONS ...

    get first_schema() {
        if( this.hasOwnProperty('schemas') && this.schemas.length>0){
            return this.schemas[0];
        }
        return null;
    }
    set first_schema(value) {
        if(typeof value === 'object'){
            if( !this.hasOwnProperty('schemas')) this['schemas'] = [];
            this.schemas.length = 0;
            this.schemas.push(value)
        }
    }









    // ---------------------------------------
    // MODE FUNCTIONS ... FOR ACCESSING THE MODE AND MODE CHILDREN

    // A function to populate an array of relevant modes based on 'mode_type'
    getModes(modeType){
        var allModes = [];
        if( this.hasOwnProperty('modes') ) {
            for(var i=0; i<this.modes.length; i++){
                var childMode = this.modes[i];
                allModes.push( ...childMode.getModes(modeType) );
            }
        }
        // -------------------------------------------
        if(this.mode_type === modeType ){
            allModes.push(this);
        }
        return allModes;
    }

    // A function to return a single mode based on its reference
    getModeByReference(reference){
        var allModes = [];
        if( this.hasOwnProperty('modes') ) {
            for(var i=0; i<this.modes.length; i++){
                var childMode = this.modes[i];
                if(childMode.hasOwnProperty('reference') && childMode.reference===reference){
                    return childMode;
                }
            }
        }
        console.log("ERROR : getModeByReference : NO SUCH MODE : ",reference)
        return null;
    }


    overridePropValuesFromMode(sourceMode){
        // properties to maintain ..
        var mReference = this.reference;
        var mMode_type = this.mode_type;
        //var mItems = this.items;
        //var mModels = this.models;

        Object.assign(this, sourceMode);

        // restore properties to maintain
        this.reference = mReference;
        this.mode_type = mMode_type;
        //this.items = mItems;
        //this.models = mModels;
    }


    // ---------------------------------------




    myFunction(arg){
        console.log("WORKING:",arg);
    }

    // ---------------------------------------
    // ITEMS RELATED FUNCTIONS
    getDirtyItems(){
        return this.items.filter(
            function(item) {
              if(item._dirty) return true;
              return false;
            }
        );
    }


    // --------------------------------------
    // LOGGING RELATED FUNCTIONS
    mLog(message){
        //console.log("DEBUG_mlog : ",this)
        var newLogItem = {}
        newLogItem['message'] = message
        if(!this.hasOwnProperty('log')){
            this['log'] = [];
            //console.log("DEBUG_mlog : creating ",this['log'])
        } 
        this['log'].push(newLogItem)
    }


    // --------------------------------------
    // WORKFLOW RELATED FUNCTIONS
    increaseWorkflowStep(){
      this.workflowstep = this.workflowstep + 1;
      this.switchToWorkflowIndex(this.workflowstep);
    }
    decreaseWorkflowStep(){
      this.workflowstep = this.workflowstep - 1;
      this.switchToWorkflowIndex(this.workflowstep);
    }
    switchToWorkflowIndex(index){
        var workflows = this.getModes('workflow');
        if(workflows.length>=index){
            var workflow = workflows[index-1];
            this.overridePropValuesFromMode(workflow);
        }
    }
    switchToWorkflowReference(reference){
        console.log("switchToWorkflowReference : ",reference)
        var wf_mode = this.getModeByReference(reference);
        if(wf_mode){
            console.log("switchToWorkflowReference : FOUND : ",wf_mode) 
            this.overridePropValuesFromMode(wf_mode);
            console.log("switchToWorkflowReference : NOW : ",this)
        } else{
            console.log("NOT FOUND : ",this)
        }

    }
    // --------------------------------------
    // FILTER RELATED FUNCTIONS



    // --------------------------------------
    // DATE ADJUSTMENT METHODS

    moveViewDateRange(delta_val,delta_unit){
        this.moveDateRange('view_date_range','view_date_start','view_date_end',delta_val,delta_unit);
        this.checkViewDateRangeWithinFilterDateRange()
    }
    moveFilterDateRange(delta_val,delta_unit){
        this.moveDateRange('filter_date_range','filter_date_start','filter_date_end',delta_val,delta_unit);
    }
    moveDateRange(range_name,start_name,end_name,delta_val,delta_unit){

        this[range_name] = "custom";

        var momentStart = poodleUtils.formatDateAsMoment( this[start_name], poodleUtils.format_datetime_ical );
        var momentEnd = poodleUtils.formatDateAsMoment( this[end_name], poodleUtils.format_datetime_ical );

        this[start_name] = poodleUtils.getMomentWithDeltaAsString( momentStart ,delta_val, delta_unit, poodleUtils.format_datetime_ical)    
        this[end_name] = poodleUtils.getMomentWithDeltaAsString( momentEnd ,delta_val, delta_unit, poodleUtils.format_datetime_ical)  

        console.log("MOVED:",this[start_name],this[end_name])

    }


    checkViewDateRangeWithinFilterDateRange(){
        var vds = poodleUtils.formatDateAsMoment(this.view_date_start,poodleUtils.format_datetime_ical);
        var vde = poodleUtils.formatDateAsMoment(this.view_date_end,poodleUtils.format_datetime_ical);
        var fds = poodleUtils.formatDateAsMoment(this.filter_date_start,poodleUtils.format_datetime_ical);
        var fde = poodleUtils.formatDateAsMoment(this.filter_date_end,poodleUtils.format_datetime_ical);
        if(vds<fds){
            this.filter_date_start = this.view_date_start;
            this.filter_date_range = "custom";
        }
        if(vde>fde){
            this.filter_date_end = this.view_date_end;
            this.filter_date_range = "custom";
        }
    }


    // -------------------------------------------------
    // INITIALISATION METHODS
    initialiseAll(){
        // properties that should be present
        //if(!this.hasOwnProperty('_all_items')) this._all_items = [];

        this.initialiseFilterDateRange();
        this.initialiseViewDateRange();
    }


    // --------------------------------------
    // INITIALISE THE FILTER DATES (START AND END) FROM THE RANGE STRING
    initialiseFilterDateRange(){
        log.debug("MODE : initialiseFilterDateRange")
        this.initialiseDateRange('filter_date_range','filter_date_start_','filter_date_end')
    }

    // --------------------------------------
    // INITIALISE THE VIEW DATES (START AND END) FROM THE RANGE STRING
    initialiseViewDateRange(){
        this.initialiseDateRange('view_date_range','view_date_start','view_date_end')
    }

    // --------------------------------------
    // INITIALISE THE VIEW DATES (START AND END) FROM THE RANGE STRING
    initialiseDateRange(range_name,start_name,end_name){
        if(this[range_name] ){
            var rangeComponents = this[range_name].split("_");

            if(rangeComponents.length==1){
                if(rangeComponents[0]=='custom'){
                    //DO NOTHING
                } else if(rangeComponents[0]=='thisweek'){
                    var fDateStart = poodleUtils.getStartOfWeekAsString(poodleUtils.format_datetime_ical);
                    var fDateEnd = poodleUtils.getEndOfWeekAsString(poodleUtils.format_datetime_ical);
                    this[start_name] = fDateStart;
                    this[end_name] = fDateEnd;
                }else if(rangeComponents[0]=='thismonth'){
                    var fDateStart = poodleUtils.getStartOfMonthAsString(poodleUtils.format_datetime_ical);
                    var fDateEnd = poodleUtils.getEndOfMonthAsString(poodleUtils.format_datetime_ical);
                    this[start_name] = fDateStart;
                    this[end_name] = fDateEnd;
                }
            } else if(rangeComponents.length==2){  
                // X_days , X_weeks , X_months etc (before and after today)
                var rDelta = parseInt(rangeComponents[0]);
                var fDateStart = poodleUtils.getStartOfDayWithDeltaAsString((rDelta*-1),rangeComponents[1],poodleUtils.format_datetime_ical);
                var fDateEnd = poodleUtils.getEndOfDayWithDeltaAsString(rDelta,rangeComponents[1],poodleUtils.format_datetime_ical);
                this[start_name] = fDateStart;
                this[end_name] = fDateEnd;
            } else if(rangeComponents.length==3){ 
                if(rangeComponents[0]=='range'){
                    var fDateStart = poodleUtils.formatDate(rangeComponents[1], poodleUtils.format_datetime_simpledate, poodleUtils.format_datetime_ical)
                    var fDateEnd = poodleUtils.formatDate(rangeComponents[2], poodleUtils.format_datetime_simpledate, poodleUtils.format_datetime_ical)
                    this[start_name] = fDateStart;
                    this[end_name] = fDateEnd; 
                }
            }
        }
    }



    // ---------------------------------
    // MODE FUNCTIONS

    /*
    mfAllItems_RefreshFromObject(){
        // ---------------------
        // ALL ITEMS REFRESH
        var allItm = this.all_items; 
        for(itm in Object.values(this.items)){
            if (typeof itm  === 'object' && obj!==null && !allItm.includes(itm) ){
                allItm.push(obj);
            }
        }
        // ---------------------
    }
    */







}
