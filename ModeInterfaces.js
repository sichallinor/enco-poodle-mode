'use strict';


import { default as Mode } from './Mode'

import { default as ModeModelAndItems } from './ModeInterfaces_ModelAndItems'
import { default as ModeIntefaceCrud } from './ModeInterfaces_Crud'
import { default as ModeIntefaceLabradorAwsS3 } from './ModeInterfaces_LabradorAwsS3'

//import { default as mf } from './ModeFunctions';




//module.exports =  {
export default {


    initialise(){
    	// THIS IS WHERE WE ADD ALL THE INTERFACES TO THE MODE CLASS
        this.implement(Mode,ModeModelAndItems,ModeIntefaceCrud,ModeIntefaceLabradorAwsS3);
    },


	// --------------------------------------------------
    /**
    * Implements any number of interfaces to a given class.
    * @param cls The class you want to use
    * @param interfaces Any amount of interfaces separated by comma
    * @return The class cls exteded with all methods of all implemented interfaces
    */
    implement(cls,...interfaces) {
        let clsPrototype = cls.prototype;
        for (let i = 0; i < interfaces.length; i++) {
        	this.implementInterface(cls,clsPrototype,interfaces[i])
        }
        return cls;
    },

    implementInterface(cls,clsPrototype,interf){
        let proto = interf.prototype;
        for (let methodName of Object.getOwnPropertyNames(proto)) {
            if (methodName!== 'constructor')
                if (typeof proto[methodName] === 'function')
                    if (!clsPrototype[methodName]) {
                        console.warn('WARNING! "'+methodName+'" of Interface "'+interf.name+'" is not declared in class "'+cls.name+'"');
                        clsPrototype[methodName] = proto[methodName];
                    }
        }
    }
	// --------------------------------------------------


	


}