/* eslint-disable */

const INF = 90000000000000;

// defaults
// set speed
let speedtoggle = document.getElementById("speedoverwrite")
let speedOverwrite = document.getElementById("speed");

let default_speed;
const default_radius = 2.5;
const default_steer = 0.022;
const default_gravity = -9;
const physics_call_rate = 2; // higher = better performance. lower = better accuracy.
const default_cameraDownAngle = 0.3;
const default_cameraRightAngle = 0;
const default_jumpSpeed = 1;
const default_jumpHeight = 1;


// current
var speed;// = default_speed;
var steer;// = default_steer;
var gravity;

var jumpSpeed;
var jumpHeight;

var radius;// = default_radius;
var cameraDownAngle;// = default_cameraDownAngle;
var cameraRightAngle;// = default_cameraRightAngle;

// solved
var cam_horizontal = 0;
var cam_vertical = 0;
var cam_depression = 0;

var cc = {
	default: {},
	monkey: {},
	set_default: function() {
		this.default["camera.maxZ"] = () => {return 300};
		this.default["camera.fov mul2"] = () => {return 1};
		this.default["light.intensity"] = () => {return 1.0};
		this.default["radius"] = () => {return default_radius;};
		this.default["cameraDownAngle"] = () => {return default_cameraDownAngle;};
		this.default["cameraRightAngle"] = () => {return default_cameraRightAngle;};
		this.default["jumpSpeed"] = () => {return default_jumpSpeed;};
		this.default["jumpHeight"] = () => {return default_jumpHeight;};
		this.default["speed"] = () => {
            let freeze = document.getElementById("freeze");
            if (speedtoggle.checked) {
                default_speed = speedOverwrite;
                return speedOverwrite.value;
            }
            else if (freeze.checked) {
                default_speed=0;return 0
            }
            else {
                default_speed = 0.28;
                return 0.28;
            }
        };
		this.default["steer"] = () => {return default_steer};
		this.default["player.scaling"] = () => {return new BABYLON.Vector3(1, 0.16, 1)};
		this.default["scene.clearColor"] = () => {return new BABYLON.Color4(0,0,0,1)};
		this.default["scene.ambientColor"] = () => {return new BABYLON.Color4(1,1,1,1)};
		this.default["light.diffuse"] = () => {return new BABYLON.Color4(1, 1, 1, 1)};
		this.default["light.specular"] = () => {return new BABYLON.Color3(1, 1, 1)};
		this.default["light.groundColor"] = () => {return new BABYLON.Color3(0, 0, 0)};
		this.default["gravity"] = () => {
            let gravitytoggle = document.getElementById("gravityoverwrite");
            let gravityOverwrite = document.getElementById("gravity");
            let freeze = document.getElementById("freeze");
            if (gravitytoggle.checked) {
                return new BABYLON.Vector3(0, gravityOverwrite.value, 0);
            } else if (freeze.checked) {
                return new BABYLON.Vector3(0, 0, 0);
            } else {
                return new BABYLON.Vector3(0, -9, 0);
            }
        }
		this.default["camera.upVector"] = () => {
            return new BABYLON.Vector3(0, 1, 0);
        };
	},
	set_monkey: function(key, val) {
        this.monkey[key] = val;
    },
	get: function(const_key, top_vec = null) {
        // Debugging statements
        console.log(`const_key: ${const_key}`);
        console.log(`this.default[const_key]:`, this.default[const_key]);
    
        // Check if this.default[const_key] is a function
        if (typeof this.default[const_key] !== 'function') {
            throw new Error(`this.default[${const_key}] is not a function`);
        }
    
        var vec = this.default[const_key]();
        if (Object.keys(vec).length == 0) {
            // scalar
            var arr = [vec, this.monkey[const_key], top_vec].filter(v => v != null);
            return arr[arr.length - 1];
        } else {
            // vector
            let is_color = ((vec.r) && (vec.g) && (vec.b));
            let arr = [this.monkey[const_key], top_vec];
            if (is_color) {
                for (var i = 0; i < 2; i++) {
                    let ar = arr[i];
                    if (ar) {
                        vec = ar;
                    }
                }
            } else {
                for (let key in vec) {
                    for (var i = 0; i < 2; i++) {
                        let ar = arr[i];
                        if ((ar != null) && (ar[key] != null)) {
                            vec[key] = ar[key];
                        }
                    }
                }
            }
        }
    },
	refresh: function() {
        // Debugging statements
        console.log("Refreshing values...");
    
        // Helper function to get and log values
        const getValue = (key) => {
            console.log(`Getting value for key: ${key}`);
            const value = this.get(key);
            console.log(`Value for ${key}:`, value);
            return value;
        };
    
        camera.maxZ = getValue("camera.maxZ");
        light.intensity = getValue("light.intensity");
        radius = getValue("radius");
        cameraDownAngle = getValue("cameraDownAngle");
        cameraRightAngle = getValue("cameraRightAngle");
        speed = getValue("speed");
        steer = getValue("steer");
        player.scaling = getValue("player.scaling");
        scene.clearColor = getValue("scene.clearColor");
        scene.ambientColor = getValue("scene.ambientColor");
        light.diffuse = getValue("light.diffuse");
        light.specular = getValue("light.specular");
        light.groundColor = getValue("light.groundColor");
    },
	hard_reset: function() {
		cc.monkey = {};
	}
}

