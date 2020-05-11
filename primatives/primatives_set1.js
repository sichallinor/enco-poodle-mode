
//module.exports = {
export default {

	// MOST BASIC PRIMATIVE
    primative: { 
		reference : "primative",
		mode_type : "",

		// BE CAREFUL THIS CANNOT BE INCLUDED IN A PRIMATIVE
		// AS IT WILL OVERRIDE ITS PARENT MODES WHEN SWITCHING WORKFLOWS
      	//modes : [],

		items: [],
		models: [],
		schemas: [],

		search: "",

		workflowstep: 1,


		// ---------------------------
		// DEFAULT UI COMPONENTS - IN CASE THIS VIEW IS RENDERED
		layout: 'LayoutBasic',
		layout_ratio: '50:50:0',
		layout_studio: false,
		components: [
    		{ reference: "slot1", type: 'ModeViewBasic', mode: 'FUNC: return mode' }
		],
		// ---------------------------

    	actions: [],

    	/*
		component_list: 'ItemsTable',
		component_header: 'HeaderBasic',
		component_3: null,
		*/

		drawer: false,

		can_nav_back: true,
		can_update: true,
		can_create: true,
		can_delete: true,

		is_creating: false,
		is_updating: false,
		is_reading: false

    },


    // MOST BASIC LIST
	workflow_list: {
		reference : "workflow_list",
		mode_type : "workflow",

		drawer: false,


		/*
		component_list: 'ItemsTable',
		component_header: 'HeaderBasic',
		component_editor: null,
		*/

		layout: 'LayoutOriginal',
		layout_ratio: '50:50:0',
		layout_studio: false,
    	components: [
    		{ reference: "slot1", type: null, mode: null },
    		{ reference: "slot2", type: 'HeaderBasic', mode: 'PARENT' },
    		{ reference: "slot3", type: "ItemsTable", mode: 'PARENT' }
    	],

    	actions: [],

    	/*
		component_1: null,
		component_1_mode: null,
		component_2: 'HeaderBasic',
		component_2_mode: 'PARENT',
		component_3: "ItemsTable",
		component_3_mode: "PARENT",*/

		schemas: [],

		realtime_bulk_update: false,

		workflowstep: 1
	},

    // MOST BASIC LIST
	workflow_edit_record: {
		reference : "workflow_edit_record",
		mode_type : "workflow",

		layout: 'LayoutOriginal',
    	components: [
    		{ reference: "slot1", type: null, mode: null },
    		{ reference: "slot2", type: 'HeaderBasic', mode: 'PARENT' },
    		{ reference: "slot3", type: "EditorJsonSchema", mode: 'PARENT' }
    	],

    	/*
		layout: 'LayoutBasic',
		component_list: null,
		component_3: null,
		component_header: 'HeaderBasic',
		component_editor: 'EditorJsonSchema',
		*/

    	actions: [],

		schemas: [],

		realtime_bulk_update: false,
		
		workflowstep: 2
	},

    // MOST BASIC EDITOR
	workflow_create_record: {
		reference : "workflow_create_record",
		mode_type : "workflow",

		layout: 'LayoutOriginal',
    	components: [
    		{ reference: "slot1", type: null, mode: null },
    		{ reference: "slot2", type: 'HeaderBasic', mode: 'PARENT' },
    		{ reference: "slot3", type: "EditorJsonSchema", mode: 'PARENT' }
    	],

		/*
		component_list: null,
		component_header: 'HeaderBasic',
		component_editor: 'EditorJsonSchema',
		component_3: "EditorJsonSchema",
		component_3_mode: "PARENT",
		*/

		schemas: [],

		realtime_bulk_update: false,

		workflowstep: 3
	},








}