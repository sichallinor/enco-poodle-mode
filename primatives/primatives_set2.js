
//module.exports = {
export default {

  "component_001": {
    "reference": "component_001",
    "apitype" : null,
    "mode_type": "",
    "items": [],
    "models": [],
    "schema_references": [],
    "schemas": [],
    "search": "",
    "workflowstep": 1,
    "layout": "LayoutFlowVertical",
    "layout_ratio": "",
    "layout_studio": false,
    "active_mode" : null,
    "components": [
      {
        "reference": "slot1",
        "type": "HeaderBasic",
        "mode": "FUNC: return mode"
      },
      {
        "reference": "slot2",
        "type": "ItemsFilter",
        "mode": "FUNC: return mode"
      },
      {
        "reference": "slot3",
        "type": "ItemsTable",
        "mode": "FUNC: return mode"
      }
    ],
    "actions": [],
    "drawer": false,
    "can_nav_back": true,
    "can_update": true,
    "can_create": true,
    "can_delete": true,
    "is_creating": false,
    "is_updating": false,
    "is_reading": false,
    "proxy": {   }
  },

  "component_003": {
    "reference": "component_003",
    "mode_type": "",
    "items": [],
    "models": [],
    "schema_references": [],
    "schemas": [],
    "search": "",
    "workflowstep": 1,
    "layout": "LayoutSplitHorizontal",
    "layout_ratio": "50:50:0",
    "layout_studio": false,
    "components": [
      {
        "reference": "slot1",
        "type": "Main",
        "mode": "FUNC: return mode.child.component_003a"
      },
      {
        "reference": "slot2",
        "type": "EditorJsonSchema",
        "mode": "FUNC: return mode"
      }
    ],
    "modes": [
    	{
    		"reference": "component_003a",
    		"primatives": ["component_001"],
		    "proxy":{
		      "items": "FUNC: return parent",
		      "models": "FUNC: return parent",
		      "schemas": "FUNC: return parent",
		      "actions": "FUNC: return parent",
              "can_update": "FUNC: return parent",
              "can_create": "FUNC: return parent",
              "can_delete": "FUNC: return parent",
              "can_nav_back": "FUNC: return parent",
		    }
    	}
    ],
    "actions": [
        {"reference":"action_store", "store":true},
    	{"reference":"action_create_new", "create_new":true},
    	{"reference":"action_delete", "delete":true}
    ],
    "drawer": false,
    "can_nav_back": true,
    "can_update": true,
    "can_create": true,
    "can_delete": true,
    "is_creating": false,
    "is_updating": false,
    "is_reading": false,
    "proxy": {   }
  },



  "component_002": {
    "reference": "component_002",
    "mode_type": "",
    "workflowstep": 1,
    "layout": "LayoutBasic",
    "layout_ratio": "50:50:0",
    "layout_studio": false,

    "items": [],
    "models": [],
    "schemas": [],

    "components": [
      {
        "reference": "slot1",
        "type": "Main",
        "mode": "FUNC: return mode.child.component_002a"
      }
    ],
    "modes": [
    	{
    		"reference": "component_002a",
    		"primatives": ["component_001"],
		    "proxy":{
		      "items": "FUNC: return parent",
		      "models": "FUNC: return parent",
		      "schemas": "FUNC: return parent",
		    }
    	}
    ],
    "dialog_visible": false,
    "dialog_result": null,
    "can_nav_back": false,
    "can_update": false,
    "can_create": true,
    "can_delete": true,
    "is_creating": false,
    "is_updating": false,
    "is_reading": false,

    "actions": []
  },


  "component_004_dialog_menu": {
    "reference": "component_004_dialog_menu",
    "mode_type": "",
    "workflowstep": 1,
    "layout": "LayoutBasic",
    "layout_ratio": "50:50:0",
    "layout_studio": false,

    "items": [],
    "models": [],
    "schemas": [],

    "components": [
      {
        "reference": "slot1",
        "type": "MenuSystemBasic",
        "mode": "FUNC: return mode.child.component_004a"
      }
    ],
    "modes": [
        {
            "reference": "component_004a",
            "primatives": ["primative"],
            "proxy":{
              "items": "FUNC: return parent",
              "models": "FUNC: return parent",
              "schemas": "FUNC: return parent",
            }
        }
    ],
    "dialog_visible": false,
    "dialog_result": null,
    "can_nav_back": false,
    "can_update": false,
    "can_create": true,
    "can_delete": true,
    "is_creating": false,
    "is_updating": false,
    "is_reading": false,

    "actions": []
  },



}