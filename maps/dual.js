player1 = null;
var map = {
    title: "Dual",
    song: "env2",
    maker: "applepear and Bumpo",
    spawn: [0, 0, 0],
    init: function() {
        cleanup.run = this.run;
		a.y([-0.18, -16.73, -188.23], [0, 0, 0], [73.28, 0.22, 73.28], "1f2024", 0, 0, 0.6, true, 1, false);
        a.y([-0.18, -17.13, -188.23], [0, 0, 0], [80.46, 0.24, 80.46], "34353b", 0, 0, 0.6, true, 1, false);
        a.p([19.51, -17.49, -107.24], [0, 0, 0], [4, 0.14, 113.72], "3d58b8", 0, 0, 0.6, false, true, false, false);
        a.y([-0.18, -17.33, -188.23], [0, 0, 0], [87.3, 0.26, 87.3], "4e4f54", 0, 0, 0.6, true, 1, false);
        a.p([19.51, -17.86, -107.24], [0, 0, 0], [6.34, 0.14, 113.72], "516bc9", 0, 0, 0.6, false, true, false, false);
        a.p([19.51, -18.23, -107.24], [0, 0, 0], [8.22, 0.14, 113.72], "657fdb", 0, 0, 0.6, false, true, false, false);
        a.p([-19.51, -17.49, -107.24], [0, 0, 0], [4, 0.14, 113.72], "c94242", 0, 0, 0.6, false, true, false, false);
        a.p([-19.51, -17.86, -107.24], [0, 0, 0], [6.34, 0.14, 113.72], "db5151", 0, 0, 0.6, false, true, false, false);
        a.y([-0.18, -16.8, -33.32], [0, 0, 0], [57.84, 0.18, 57.84], "dbcf63", 0, 0, 0.6, true, 1, false);
        a.y([-0.18, -17.12, -33.32], [0, 0, 0], [63.5, 0.2, 63.5], "e8dd76", 0, 0, 0.6, true, 1, false);
        a.p([-19.51, -18.23, -107.24], [0, 0, 0], [8.22, 0.14, 113.72], "f06e6e", 0, 0, 0.6, false, true, false, false);
        a.y([-0.18, -17.27, -33.32], [0, 0, 0], [68.9, 0.22, 68.9], "f5eb8e", 0, 0, 0.6, true, 1, false);
        a.p([0, -2.97, -4.41], [0, -0.22, 0], [2.74, 2, 20], "000000,0.99", 0, 0, 0.6, false, false, false, false);
        a.p([0, -5.14, -16.72], [0, 0, 0], [2.74, 2, 5.46], "000000,0.99", 0, 0, 0.6, false, false, false, false);
        a.p([0, -4.45, -159.72], [0, 0, 0], [7.52, 2, 5.3], "0a0a0a", 0, 0, 0.6, false, false, false, false);
        a.p([0, -4.45, -164.99], [0, 0, 0], [5.94, 2, 5.3], "0a0a0a", 0, 0, 0.6, false, false, false, false);
        a.p([0, -4.45, -170.19], [0, 0, 0], [4.82, 2, 5.3], "0a0a0a", 0, 0, 0.6, false, false, false, false);
        a.p([0, -4.45, -175.38], [0, 0, 0], [3.66, 2, 5.3], "0a0a0a", 0, 0, 0.6, false, false, false, false);
        a.p([0, -4.45, -139.12], [0, 0, 0], [9, 2, 36], "0a0a0a", 0, 0, 0.6, false, false, false, false);
        a.p([0, -4.45, -180.58], [0, 0, 0], [2.76, 2, 5.3], "0a0a0a", 0, 0, 0.6, false, false, false, false);
        a.p([0, -4.45, -185.74], [0, 0, 0], [2, 2, 5.3], "0a0a0a", 0, 0, 0.6, false, false, false, false);
        a.p([8.56, -5.34, -217.64], [-1.57, -0.79, 0], [0.86, 9.54, 9.56], "0a0a0a", 0, 0, 0.6, false, false, false, false);
        a.p([-8.5, -5.34, -217.64], [-1.57, -0.79, 0], [0.86, 9.54, 9.56], "0a0a0a", 0, 0, 0.6, false, false, false, false);
        a.p([-2.13, -5.12, -77.1], [0, 0, 0], [3, 3, 3], "324ca8", 0, 0, 0.6, true, false, false, false);
        a.p([1.97, -5.12, -43.93], [0, 0, 0], [0.94, 2, 7.86], "324ca8", 0, 0, 0.6, true, false, false, false);
        a.p([0, -2.93, -60.58], [0, 0, 0], [3.82, 2.42, 2.86], "324ca8,0.5", 0, 0, 0.6, false, false, true, false);
        a.c([0, -3.21, -99.13], "324ca8");
        a.c([-2.66, -3.21, -91.1], "324ca8");
        a.p([7.44, 0.47, -173.71], [0.1, 0, 0], [1.36, 16, 33.24], "324ca8,0.3", 0, 0, 0.6, false, false, true, false);
        a.p([2.72, -5.12, -20.86], [-0.79, 0, 0], [2, 2, 5.9], "324ca8", 0, 0, 0.6, false, false, false, false);
        a.p([5.16, -4.33, -82.15], [0, 0, 0], [3, 3, 3], "324ca8", 0, 0, 0.6, false, false, false, false);
        a.p([-1.89, -5.46, -211.24], [-1.57, -1.57, 0], [0.48, 2.98, 0.82], "324ca8", 0, 0, 0.6, false, false, false, false);
        a.p([-1.89, -3.08, -211.24], [-1.57, -1.57, 0], [0.48, 2.98, 0.82], "324ca8", 0, 0, 0.6, false, false, false, false);
        a.p([-3.02, -5.49, -211.24], [-1.57, 0, 0], [0.48, 5.56, 0.82], "324ca8", 0, 0, 0.6, false, false, false, false);
        a.p([-4.84, -5.49, -211.24], [-1.57, 0, 0], [0.48, 5.56, 0.82], "324ca8", 0, 0, 0.6, false, false, false, false);
        a.p([-5.94, -7.93, -211.24], [-1.57, -1.57, 0], [0.48, 2.98, 0.82], "324ca8", 0, 0, 0.6, false, false, false, false);
        a.p([-0.79, -5.49, -211.24], [-1.57, 0, 0], [0.48, 5.56, 0.82], "324ca8", 0, 0, 0.6, false, false, false, false);
        a.p([3.51, -5.12, -31.17], [0, 0, 0], [4, 2, 18], "324ca8", 0, 0, 0.6, false, false, false, false);
        a.p([8.47, -5.34, -217.24], [-1.57, -0.79, 0], [0.48, 5.36, 5.38], "7e21c4", 0, 0, 0.6, false, false, false, false);
        a.p([-8.59, -5.34, -217.24], [-1.57, -0.79, 0], [0.48, 5.36, 5.38], "852219,1.0", 0, 0, 0.6, false, false, false, false);
        a.p([-8.59, -5.34, -217.24], [-1.57, 0, 0], [0.8, 3.34, 3.34], "c42f21", 0, 0, 0.6, false, false, false, false);
        a.p([-1.97, -5.12, -43.93], [0, 0, 0], [0.94, 2, 7.86], "d91c1c", 0, 0, 0.6, true, false, false, false);
        a.p([2.13, -5.12, -77.1], [0, 0, 0], [3, 3, 3], "d91c1c", 0, 0, 0.6, true, false, false, false);
        a.p([-1.84, -2.93, -68.05], [0, 0, 0], [2.3, 2.42, 2.86], "d91c1c,0.5", 0, 0, 0.6, false, false, true, false);
        a.p([1.84, -2.93, -68.05], [0, 0, 0], [2.3, 2.42, 2.86], "d91c1c,0.5", 0, 0, 0.6, false, false, true, false);
        a.c([3.92, -3.21, -87.47], "d91c1c");
        a.c([0, -3.21, -93.94], "d91c1c");
        a.p([-7.44, 0.47, -173.71], [-0.1, 0, 0], [1.36, 16, 33.24], "d91c1c,0.3", 0, 0, 0.6, false, false, true, false);
        a.p([-5.17, -4.33, -82.15], [0, 0, 0], [3, 3, 3], "d91c1c", 0, 0, 0.6, false, false, false, false);
        a.p([5.28, -4.34, -211.24], [-1.57, -0.52, 0], [0.48, 3.36, 0.82], "d91c1c", 0, 0, 0.6, false, false, false, false);
        a.p([-2.72, -5.12, -20.86], [0.79, 0, 0], [2, 2, 5.9], "d91c1c", 0, 0, 0.6, false, false, false, false);
        a.p([5.24, -6.74, -211.24], [-1.57, 0.52, 0], [0.48, 3.12, 0.82], "d91c1c", 0, 0, 0.6, false, false, false, false);
        a.p([3.07, -5.49, -211.24], [-1.57, 0, 0], [0.48, 5.56, 0.82], "d91c1c", 0, 0, 0.6, false, false, false, false);
        a.p([-3.49, -5.12, -31.17], [0, 0, 0], [4, 2, 18], "d91c1c", 0, 0, 0.6, false, false, false, false);
        a.p([0.84, -5.49, -211.24], [-1.57, 0, 0], [0.48, 5.56, 0.82], "d91c1c", 0, 0, 0.6, false, false, false, false);
        a.p([6.17, -5.47, -211.24], [-1.57, 0, 0], [0.48, 5.56, 0.82], "d91c1c", 0, 0, 0.6, false, false, false, false);
        a.p([1.97, -7.93, -211.24], [-1.57, -1.57, 0], [0.48, 2.98, 0.82], "d91c1c", 0, 0, 0.6, false, false, false, false);
        a.p([8.47, -5.34, -217.24], [-1.57, 0, 0], [0.8, 3.34, 3.34], "df74ed", 0, 0, 0.6, false, false, false, false);
        a.p([0, -5.12, -71.55], [0, 0, 0], [1.1, 2, 4], "fcba03", 0, 0, 0.6, true, false, false, false);
        a.y([4.51, -3.42, -30.24], [0, 0, 0], [2, 1.4, 2], "fcba03", 0, 0, 0.6, false, 0.0, true);
        a.y([2.45, -3.42, -34.41], [0, 0, 0], [2, 1.4, 2], "fcba03", 0, 0, 0.6, false, 0.0, true);
        a.y([4.51, -3.42, -38.7], [0, 0, 0], [2, 1.4, 2], "fcba03", 0, 0, 0.6, false, 0.0, true);
        a.y([-4.52, -3.42, -38.7], [0, 0, 0], [2, 1.4, 2], "fcba03", 0, 0, 0.6, false, 0.0, true);
        a.y([-2.44, -3.42, -34.41], [0, 0, 0], [2, 1.4, 2], "fcba03", 0, 0, 0.6, false, 0.0, true);
        a.y([-4.52, -3.42, -30.24], [0, 0, 0], [2, 1.4, 2], "fcba03", 0, 0, 0.6, false, 0.0, true);
        a.p([-4.33, -3.08, -139.18], [0, 0, 0], [0.4, 1, 36], "fcba03", 0, 0, 0.6, false, false, true, false);
        a.p([4.3, -3.08, -139.18], [0, 0, 0], [0.4, 1, 36], "fcba03", 0, 0, 0.6, false, false, true, false);
        a.p([0, -3.08, -139.18], [0, 0, 0], [0.4, 1, 36], "fcba03", 0, 0, 0.6, false, false, true, false);
        a.c([-0.76, -2.83, -132.76], "fcba03");
        a.c([-2.21, -2.83, -136.32], "fcba03");
        a.c([-3.26, -2.85, -129.17], "fcba03");
        a.c([-2.21, -2.83, -137.95], "fcba03");
        a.c([-3.24, -2.83, -141.57], "fcba03");
        a.c([-2.68, -2.83, -143.15], "fcba03");
        a.c([-1.99, -2.83, -144.84], "fcba03");
        a.c([-2.42, -2.83, -151.29], "fcba03");
        a.c([-1.74, -2.83, -149.6], "fcba03");
        a.c([-0.95, -2.83, -148.01], "fcba03");
        a.c([3.27, -2.83, -134.89], "fcba03");
        a.c([2.48, -2.83, -136.47], "fcba03");
        a.c([1.8, -2.83, -138.16], "fcba03");
        a.c([2.23, -2.83, -144.72], "fcba03");
        a.c([1.54, -2.83, -143.03], "fcba03");
        a.c([0.98, -2.83, -141.45], "fcba03");
        a.c([2.01, -2.83, -131.27], "fcba03");
        a.c([0.96, -2.85, -122.48], "fcba03");
        a.c([2.01, -2.83, -129.64], "fcba03");
        a.c([3.45, -2.83, -126.08], "fcba03");
        a.c([0, -2.83, -164.92], "fcba03");
        a.c([1.41, -2.83, -170.19], "fcba03");
        a.c([-1.41, -2.83, -170.19], "fcba03");
        a.c([0, -2.83, -175.38], "fcba03");
        a.p([-2.31, -7.76, -101.77], [0, 0, 0], [2.92, 8.38, 3.22], "fcba03,0.3", 0, 0, 0.6, false, false, false, false);
        a.p([-0.02, 0.47, -157.27], [0, 0, 0], [8.68, 8.38, 0.72], "fcba03,0.3", 0, 0, 0.6, false, false, false, false);
        a.p([-1.65, -4.44, -92.21], [-0.35, 0, 0], [1.6, 2, 24], "fcba03", 0, 0, 0.6, false, false, false, false);
        a.p([1.72, -4.44, -92.21], [0.35, 0, 0], [1.6, 2, 24], "fcba03", 0, 0, 0.6, false, false, false, false);
        a.p([0, -5.12, -60.58], [0, 0, 0], [6, 2, 18], "fcba03", 0, 0, 0.6, false, false, false, false);
        a.p([2.4, -4.44, -112.21], [0, 0, 0], [1.6, 2, 18], "fcba03", 0, 0, 0.6, false, false, false, false);
        a.p([-2.31, -4.44, -112.21], [0, 0, 0], [1.6, 2, 18], "fcba03", 0, 0, 0.6, false, false, false, false);
        a.p([0.64, -3.61, -21.5], [-2.36, 0, 0], [4, 2, 2], "-1.0", 0, 0, 0.6, false, false, false, false);
        a.p([-0.79, -3.61, -21.5], [-0.79, 0, 0], [4, 2, 2], "-1.0", 0, 0, 0.6, false, false, false, false);
        a.p([0, -4.71762, -71.5485], [0, 0, 0], [1.09192, 2, 4], "-1.0", 0, 0, 0.6, true, true, false ,false);
        a.e([0, -3.35, -189.37]);

        if (player1 !== null) {
            player1.dispose();
			player1 = null;
        }
    },
    post: function() {
        cc.set_monkey("steer", default_steer * 0.9);
        cc.set_monkey("scene.clearColor", new BABYLON.Color3.FromHexString("#808080"));
        cc.set_monkey("light.groundColor", new BABYLON.Color3.FromHexString("#ffffff"));
        cc.set_monkey("speed", default_speed * 1.0);
        // cc.set_monkey("cameraDownAngle", 50.0 * Math.PI / 180);
        cc.set_monkey("light.specular", new BABYLON.Color3.FromHexString("#0a0a0a"));
        cc.refresh();
    },
    section_id: 0,
    section_update: function() {
        let PZ = player.position.z;
		switch (this.section_id) {
            case 0:
                if (PZ < 1) {
                    steer = 0;
                    this.section_id += 1
                }
                break;
            case 1:
                if (PZ < -18) {
                    a.cam_cd(50.0);

                    player1 = player.clone("player1");
                    setTimeout(() => {
                        player1.physicsImpostor = new BABYLON.PhysicsImpostor(player1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.0, restitution: 1.0, friction: 0.5}, scene);
                    }, 0);
                    player1.applyGravity = true;
                    player1.checkCollisions = true;

                    cape_tail1 = new BABYLON.Mesh("custom", scene);
        
                    var tail_vertexData = new BABYLON.VertexData();
                    tail_vertexData.positions = [
                        -1,0,1,
                        0,0,3,
                        1,0,1,
                    ];
                    tail_vertexData.indices = [0, 1, 2];
                    tail_vertexData.applyToMesh(cape_tail1);

                    cape_tail1.material = decorations.rgba_mat(255,255,255,1);

                    cape_tail1.scaling.x = 0.3;
                    cape_tail1.scaling.y = 0.3;
                    cape_tail1.scaling.z = 0.3;
                    cape_tail1.isVisible = true;
                    cape_tail1.parent = player1;

                    cape_wings1 = new BABYLON.Mesh("custom", scene);

                    var wings_vertexData = new BABYLON.VertexData();
                    wings_vertexData.positions = [
                        1,0,-1,
                        3,0,0,
                        1,0,1,
                        -1,0,-1,
                        -3,0,0,
                        -1,0,1
                    ];
                    wings_vertexData.indices = [0, 1, 2, 3, 4, 5];
                    wings_vertexData.applyToMesh(cape_wings1);

                    cape_wings1.material = decorations.rgba_mat(255,255,255,1);

                    cape_wings1.scaling.x = 0.3;
                    cape_wings1.scaling.y = 0.3;
                    cape_wings1.scaling.z = 0.3;
                    cape_wings1.isVisible = false;
                    cape_wings1.parent = player1;

                    player.position.x = 0.1;

                    cape_arrow = new BABYLON.Mesh("custom", scene);
        
                    var arrow_vertexData = new BABYLON.VertexData(); // Renamed from tail_vertexData
                    arrow_vertexData.positions = [
                        -1, 0, -1,  // Adjusted to point towards negative z-axis
                        0, 0, -3,   // Adjusted to point towards negative z-axis
                        1, 0, -1,   // Adjusted to point towards negative z-axis
                    ];
                    arrow_vertexData.indices = [0, 1, 2];
                    arrow_vertexData.applyToMesh(cape_arrow);

                    cape_arrow.material = decorations.rgba_mat(1,0,0,1);

                    cape_arrow.scaling.x = 0.3;
                    cape_arrow.scaling.y = 0.3;
                    cape_arrow.scaling.z = 0.3;
                    cape_arrow.isVisible = true;
                    cape_arrow.parent = player;
                    
                    cape_arrow1 = new BABYLON.Mesh("custom", scene);
        
                    var arrow_vertexData1 = new BABYLON.VertexData(); // Renamed from tail_vertexData
                    arrow_vertexData1.positions = [
                        -1, 0, -1,  // Adjusted to point towards negative z-axis
                        0, 0, -3,   // Adjusted to point towards negative z-axis
                        1, 0, -1,   // Adjusted to point towards negative z-axis
                    ];
                    arrow_vertexData1.indices = [0, 1, 2];
                    arrow_vertexData1.applyToMesh(cape_arrow1);

                    cape_arrow1.material = decorations.rgba_mat(0,0,0,1);

                    cape_arrow1.scaling.x = 0.3;
                    cape_arrow1.scaling.y = 0.3;
                    cape_arrow1.scaling.z = 0.3;
                    cape_arrow1.isVisible = true;
                    cape_arrow1.parent = player1;

                    light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, 0), scene);
                    light1.specular = new BABYLON.Color3(1, 0, 0);
                    light1.diffuse = new BABYLON.Color3(1, 0, 0);
                    light1.groundColor = new BABYLON.Color3(1, 0, 0);
                    light1.intensity = 2;
                    light1.includedOnlyMeshes.push(cape_arrow);
                    light1.parent = camera;
                    
                    light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 0, 0), scene);
                    light2.specular = new BABYLON.Color3(0, 0, 1);
                    light2.diffuse = new BABYLON.Color3(0, 0, 1);
                    light2.groundColor = new BABYLON.Color3(0, 0, 1);
                    light2.intensity = 2;
                    light2.includedOnlyMeshes.push(cape_arrow1);
                    light2.parent = camera;
                    
                    light.excludedMeshes = [];
                    light.excludedMeshes.push(cape_arrow);
                    light.excludedMeshes.push(cape_arrow1);

                    this.section_id += 1;
                }
                break;
            case 2:
                if (PZ < -23) {
                    speed = default_speed * 0.6;
                    steer = default_steer * 1.3;
                    a.jh(0.5);
                    a.js(0.4);
                    this.section_id += 1
                }
                break;
            case 3:
                if (PZ < -50.29) {
                    speed = cc.get("speed", null);
                    steer = cc.get("steer", null);
                    a.jh(null);
                    a.js(null);
                    this.section_id += 1
                }
                break;
            case 4:
                if (PZ < -50.33) {
                    speed = default_speed * 0.5;
                    steer = default_steer * 1.1;
                    a.jh(0.5);
                    a.js(0.2);
                    this.section_id += 1
                }
                break;
            case 5:
                if (PZ < -84.23) {
                    speed = cc.get("speed", null);
                    steer = cc.get("steer", null);
                    a.jh(null);
                    a.js(null);
                    this.section_id += 1
                }
                break;
            case 6:
                if (PZ < -84.25) {
                    speed = default_speed * 0.7;
                    steer = default_steer * 1.1;
                    a.jh(0.3);
                    this.section_id += 1
                }
                break;
            case 7:
                if (PZ < -104.77000000000001) {
                    speed = cc.get("speed", null);
                    steer = cc.get("steer", null);
                    a.jh(null);
                    this.section_id += 1
                }
                break;
            case 8:
                if (PZ < -104.81) {
                    speed = default_speed * 0.5;
                    rotation = 0.0 * Math.PI / 180;
                    steer = default_steer * 0.0;
                    player.position.x = 2.40456;
                    this.section_id += 1
                }
                break;
            case 9:
                a.mov('P52', 'y', 0.2);
                a.mov('P52', 'z', -0.75);
                if (a.m('P52').position.z - player1.position.z < 1.613) {
                    player1.position.z = a.m('P52').position.z - 1.613;
                }
                if (PZ < -120.94999999999999) {
                    speed = cc.get("speed", null);
                    steer = cc.get("steer", null);
                    this.section_id += 1
                }
                break;
            case 10:
                if (PZ < -121.08999999999999) {
                    speed = default_speed * 0.6;
                    steer = default_steer * 1.5;
                    this.section_id += 1
                }
                break;
            case 11:
                a.mov('P53', 'y', -0.1);
                if (player1.intersectsMesh(a.m('P53'))) {
                    player1.position.z = a.m('P53').position.z + 0.467199;
                }
                if (PZ < -157.69) {
                    speed = cc.get("speed", null);
                    steer = cc.get("steer", null);
                    this.section_id += 1
                }
                break;
            case 12:
                if (PZ < -157.81) {
                    speed = default_speed * 0.5;
                    steer = default_steer * 1.2;
                    a.cam_cd(25.0);
                    this.section_id += 1
                }
                break;
            case 13:
                a.mov('P20', 'x', -0.07);
                a.mov('P37', 'x', 0.07);
                if (PZ < -194.41000000000003) {
                    speed = cc.get("speed", null);
                    steer = cc.get("steer", null);
                    a.cam_cd(null);
                    this.section_id += 1
                }
                break;
		}
    },
    reset: function() {
		if (player1 !== null) {
            player1.dispose();
			player1 = null;
        }
        this.section_id = 0;
        try {
            cape_arrow.dispose();
        } catch { }
        try {
            light1.dispose();
        } catch { }
        try {
            light2.dispose();
        } catch { }
		a.re('Y0', [-0.18, -16.73, -188.23], [0, 0, 0], [73.28, 0.22, 73.28]);
        a.re('Y1', [-0.18, -17.13, -188.23], [0, 0, 0], [80.46, 0.24, 80.46]);
        a.re('P0', [19.51, -17.49, -107.24], [0, 0, 0], [4, 0.14, 113.72]);
        a.re('Y2', [-0.18, -17.33, -188.23], [0, 0, 0], [87.3, 0.26, 87.3]);
        a.re('P1', [19.51, -17.86, -107.24], [0, 0, 0], [6.34, 0.14, 113.72]);
        a.re('P2', [19.51, -18.23, -107.24], [0, 0, 0], [8.22, 0.14, 113.72]);
        a.re('P3', [-19.51, -17.49, -107.24], [0, 0, 0], [4, 0.14, 113.72]);
        a.re('P4', [-19.51, -17.86, -107.24], [0, 0, 0], [6.34, 0.14, 113.72]);
        a.re('Y3', [-0.18, -16.8, -33.32], [0, 0, 0], [57.84, 0.18, 57.84]);
        a.re('Y4', [-0.18, -17.12, -33.32], [0, 0, 0], [63.5, 0.2, 63.5]);
        a.re('P5', [-19.51, -18.23, -107.24], [0, 0, 0], [8.22, 0.14, 113.72]);
        a.re('Y5', [-0.18, -17.27, -33.32], [0, 0, 0], [68.9, 0.22, 68.9]);
        a.re('P6', [0, -2.97, -4.41], [0, -0.22, 0], [2.74, 2, 20]);
        a.re('P7', [0, -5.14, -16.72], [0, 0, 0], [2.74, 2, 5.46]);
        a.re('P8', [0, -4.45, -159.72], [0, 0, 0], [7.52, 2, 5.3]);
        a.re('P9', [0, -4.45, -164.99], [0, 0, 0], [5.94, 2, 5.3]);
        a.re('P10', [0, -4.45, -170.19], [0, 0, 0], [4.82, 2, 5.3]);
        a.re('P11', [0, -4.45, -175.38], [0, 0, 0], [3.66, 2, 5.3]);
        a.re('P12', [0, -4.45, -139.12], [0, 0, 0], [9, 2, 36]);
        a.re('P13', [0, -4.45, -180.58], [0, 0, 0], [2.76, 2, 5.3]);
        a.re('P14', [0, -4.45, -185.74], [0, 0, 0], [2, 2, 5.3]);
        a.re('P15', [8.56, -5.34, -217.64], [-1.57, -0.79, 0], [0.86, 9.54, 9.56]);
        a.re('P16', [-8.5, -5.34, -217.64], [-1.57, -0.79, 0], [0.86, 9.54, 9.56]);
        a.re('P17', [-2.13, -5.12, -77.1], [0, 0, 0], [3, 3, 3]);
        a.re('P18', [1.97, -5.12, -43.93], [0, 0, 0], [0.94, 2, 7.86]);
        a.re('P19', [0, -2.93, -60.58], [0, 0, 0], [3.82, 2.42, 2.86]);
        a.re('C0', [0, -3.21, -99.13], [0, 0, 0], [2, 2, 2]);
        a.re('C1', [-2.66, -3.21, -91.1], [0, 0, 0], [2, 2, 2]);
        a.re('P20', [7.44, 0.47, -173.71], [0.1, 0, 0], [1.36, 16, 33.24]);
        a.re('P21', [2.72, -5.12, -20.86], [-0.79, 0, 0], [2, 2, 5.9]);
        a.re('P22', [5.16, -4.33, -82.15], [0, 0, 0], [3, 3, 3]);
        a.re('P23', [-1.89, -5.46, -211.24], [-1.57, -1.57, 0], [0.48, 2.98, 0.82]);
        a.re('P24', [-1.89, -3.08, -211.24], [-1.57, -1.57, 0], [0.48, 2.98, 0.82]);
        a.re('P25', [-3.02, -5.49, -211.24], [-1.57, 0, 0], [0.48, 5.56, 0.82]);
        a.re('P26', [-4.84, -5.49, -211.24], [-1.57, 0, 0], [0.48, 5.56, 0.82]);
        a.re('P27', [-5.94, -7.93, -211.24], [-1.57, -1.57, 0], [0.48, 2.98, 0.82]);
        a.re('P28', [-0.79, -5.49, -211.24], [-1.57, 0, 0], [0.48, 5.56, 0.82]);
        a.re('P29', [3.51, -5.12, -31.17], [0, 0, 0], [4, 2, 18]);
        a.re('P30', [8.47, -5.34, -217.24], [-1.57, -0.79, 0], [0.48, 5.36, 5.38]);
        a.re('P31', [-8.59, -5.34, -217.24], [-1.57, -0.79, 0], [0.48, 5.36, 5.38]);
        a.re('P32', [-8.59, -5.34, -217.24], [-1.57, 0, 0], [0.8, 3.34, 3.34]);
        a.re('P33', [-1.97, -5.12, -43.93], [0, 0, 0], [0.94, 2, 7.86]);
        a.re('P34', [2.13, -5.12, -77.1], [0, 0, 0], [3, 3, 3]);
        a.re('P35', [-1.84, -2.93, -68.05], [0, 0, 0], [2.3, 2.42, 2.86]);
        a.re('P36', [1.84, -2.93, -68.05], [0, 0, 0], [2.3, 2.42, 2.86]);
        a.re('C2', [3.92, -3.21, -87.47], [0, 0, 0], [2, 2, 2]);
        a.re('C3', [0, -3.21, -93.94], [0, 0, 0], [2, 2, 2]);
        a.re('P37', [-7.44, 0.47, -173.71], [-0.1, 0, 0], [1.36, 16, 33.24]);
        a.re('P38', [-5.17, -4.33, -82.15], [0, 0, 0], [3, 3, 3]);
        a.re('P39', [5.28, -4.34, -211.24], [-1.57, -0.52, 0], [0.48, 3.36, 0.82]);
        a.re('P40', [-2.72, -5.12, -20.86], [0.79, 0, 0], [2, 2, 5.9]);
        a.re('P41', [5.24, -6.74, -211.24], [-1.57, 0.52, 0], [0.48, 3.12, 0.82]);
        a.re('P42', [3.07, -5.49, -211.24], [-1.57, 0, 0], [0.48, 5.56, 0.82]);
        a.re('P43', [-3.49, -5.12, -31.17], [0, 0, 0], [4, 2, 18]);
        a.re('P44', [0.84, -5.49, -211.24], [-1.57, 0, 0], [0.48, 5.56, 0.82]);
        a.re('P45', [6.17, -5.47, -211.24], [-1.57, 0, 0], [0.48, 5.56, 0.82]);
        a.re('P46', [1.97, -7.93, -211.24], [-1.57, -1.57, 0], [0.48, 2.98, 0.82]);
        a.re('P47', [8.47, -5.34, -217.24], [-1.57, 0, 0], [0.8, 3.34, 3.34]);
        a.re('P48', [0, -5.12, -71.55], [0, 0, 0], [1.1, 2, 4]);
        a.re('Y6', [4.51, -3.42, -30.24], [0, 0, 0], [2, 1.4, 2]);
        a.re('Y7', [2.45, -3.42, -34.41], [0, 0, 0], [2, 1.4, 2]);
        a.re('Y8', [4.51, -3.42, -38.7], [0, 0, 0], [2, 1.4, 2]);
        a.re('Y9', [-4.52, -3.42, -38.7], [0, 0, 0], [2, 1.4, 2]);
        a.re('Y10', [-2.44, -3.42, -34.41], [0, 0, 0], [2, 1.4, 2]);
        a.re('Y11', [-4.52, -3.42, -30.24], [0, 0, 0], [2, 1.4, 2]);
        a.re('P49', [-4.33, -3.08, -139.18], [0, 0, 0], [0.4, 1, 36]);
        a.re('P50', [4.3, -3.08, -139.18], [0, 0, 0], [0.4, 1, 36]);
        a.re('P51', [0, -3.08, -139.18], [0, 0, 0], [0.4, 1, 36]);
        a.re('C4', [-0.76, -2.83, -132.76], [0, 0, 0], [2, 2, 2]);
        a.re('C5', [-2.21, -2.83, -136.32], [0, 0, 0], [2, 2, 2]);
        a.re('C6', [-3.26, -2.85, -129.17], [0, 0, 0], [2, 2, 2]);
        a.re('C7', [-2.21, -2.83, -137.95], [0, 0, 0], [2, 2, 2]);
        a.re('C8', [-3.24, -2.83, -141.57], [0, 0, 0], [2, 2, 2]);
        a.re('C9', [-2.68, -2.83, -143.15], [0, 0, 0], [2, 2, 2]);
        a.re('C10', [-1.99, -2.83, -144.84], [0, 0, 0], [2, 2, 2]);
        a.re('C11', [-2.42, -2.83, -151.29], [0, 0, 0], [2, 2, 2]);
        a.re('C12', [-1.74, -2.83, -149.6], [0, 0, 0], [2, 2, 2]);
        a.re('C13', [-0.95, -2.83, -148.01], [0, 0, 0], [2, 2, 2]);
        a.re('C14', [3.27, -2.83, -134.89], [0, 0, 0], [2, 2, 2]);
        a.re('C15', [2.48, -2.83, -136.47], [0, 0, 0], [2, 2, 2]);
        a.re('C16', [1.8, -2.83, -138.16], [0, 0, 0], [2, 2, 2]);
        a.re('C17', [2.23, -2.83, -144.72], [0, 0, 0], [2, 2, 2]);
        a.re('C18', [1.54, -2.83, -143.03], [0, 0, 0], [2, 2, 2]);
        a.re('C19', [0.98, -2.83, -141.45], [0, 0, 0], [2, 2, 2]);
        a.re('C20', [2.01, -2.83, -131.27], [0, 0, 0], [2, 2, 2]);
        a.re('C21', [0.96, -2.85, -122.48], [0, 0, 0], [2, 2, 2]);
        a.re('C22', [2.01, -2.83, -129.64], [0, 0, 0], [2, 2, 2]);
        a.re('C23', [3.45, -2.83, -126.08], [0, 0, 0], [2, 2, 2]);
        a.re('C24', [0, -2.83, -164.92], [0, 0, 0], [2, 2, 2]);
        a.re('C25', [1.41, -2.83, -170.19], [0, 0, 0], [2, 2, 2]);
        a.re('C26', [-1.41, -2.83, -170.19], [0, 0, 0], [2, 2, 2]);
        a.re('C27', [0, -2.83, -175.38], [0, 0, 0], [2, 2, 2]);
        a.re('P52', [-2.31, -7.76, -101.77], [0, 0, 0], [2.92, 8.38, 3.22]);
        a.re('P53', [-0.02, 0.47, -157.27], [0, 0, 0], [8.68, 8.38, 0.72]);
        a.re('P54', [-1.65, -4.44, -92.21], [-0.35, 0, 0], [1.6, 2, 24]);
        a.re('P55', [1.72, -4.44, -92.21], [0.35, 0, 0], [1.6, 2, 24]);
        a.re('P56', [0, -5.12, -60.58], [0, 0, 0], [6, 2, 18]);
        a.re('P57', [2.4, -4.44, -112.21], [0, 0, 0], [1.6, 2, 18]);
        a.re('P58', [-2.31, -4.44, -112.21], [0, 0, 0], [1.6, 2, 18]);
        a.re('P59', [0.64, -3.61, -21.5], [-2.36, 0, 0], [4, 2, 2]);
        a.re('P60', [-0.79, -3.61, -21.5], [-0.79, 0, 0], [4, 2, 2]);
        a.re('P61', [0, -4.71762, -71.5485], [0, 0, 0], [1.09192, 2, 4]);
        a.re('E0', [0, -3.35, -189.37], [0, 0, 0], [1, 1, 1]);
    },
    physics_update: function() {
		if (player1 !== null) {
			this.collision_check();
		}

        const isJumpEnabled = flyjump.can_jump;
		cape_wings1.isVisible = isJumpEnabled;
    },
    render_update: function() {
		if (player1 !== null) {
			this.player_move();
		}
    },
    collision_check: function() {
		if (player1.position.y < -20) {change_state.die('Fell To Death')}
		if (player1.position.y > 80) {change_state.die('Left The Orbit')}
		this.checkConeCollision()
		this.checkEndingCollision()
	},
	checkConeCollision() {
		for (let i=0;i<maker.cone_count;i++) {
			let cone = cones[i];
			if (this.are_touching(player1, cone, 0.5)) {
				change_state.die('Died From Cone');
				break;
			}
		}
	},
	checkEndingCollision() {
		if (score < 10) return
		for (let i=0;i<maker.ending_count;i++) {
			let ending = endings[i];
			if (this.are_touching(player1, ending, 1.2)) { // previously 1.0
				change_state.win();
				break;
			}
		}
	},
	player_move: function() {
		if (!update.shouldSpin()) {
			player1.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(0,0,0));
			player1.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0,0,0),0);
		}

		if (player1 !== null) {
            if (player.position.z > -100 || player.position.z < -158) {
                player1.rotation.y = -player.rotation.y;
                player1.rotation.x = player.rotation.x;
                player1.position.x = -player.position.x;
                player1.position.z = player.position.z;
                player1.position.y = player.position.y;
            } else {
                player1.rotation.y = -player.rotation.y;
                player1.rotation.x = player.rotation.x;
                player1.position.x = -player.position.x;
                player1.position.y = player.position.y;
                const positionAdjustment = window.tsTriggers.getPositionAdjustment()
                player1.position.z += positionAdjustment.z;
            }
        }
		
		camera.position.x = 0;
        camera.rotation.y = 3.14;
        let rotation_offsetted = rotation + cameraRightAngle;
        if (player.position.z < -67 && player.position.z > -83) {
            camera.position.z = player.position.z + Math.cos(rotation_offsetted) * cam_horizontal + 2;
        } else {
            camera.position.z = player.position.z + Math.cos(rotation_offsetted) * cam_horizontal;
        }
	},
	shouldSpin: function() {
		if (speed === default_speed) return true;
		if (speed === 0.2) return true;
		return false
	},
	are_touching: function(a, b, r) {
		let dz = a.position.z - b.position.z;
		if (Math.abs(dz) < r) {
			let dx = a.position.x - b.position.x;
			if (Math.abs(dx) < r) {
				let dy = a.position.y - b.position.y;
				if (Math.abs(dy) < r * 1.5) {
					return true;
				}
			}
		}
		return false;
	},
    run: function(full_reset=true) {
		if (isMapLoaded == false) {
			console.error("Map is not loaded");
			return;
		}
		if (full_reset == true) {
			currentMapId = null;
			isMapLoaded = false;
			map = {
				render_update: function() {},
				physics_update: function() {},
				section_update: function() {}
			}
			cc.hard_reset();
		}

		for (let i=0;i<maker.ending_count;i++) {
			let mesh_name = "E" + i;
			let mesh = scene.getMeshByName(mesh_name);
			mesh.dispose(true);
		}
		for (let i=0;i<maker.platform_count;i++) {
			let mesh_name = "P" + i;
			let mesh = scene.getMeshByName(mesh_name);
			mesh.dispose(true);
		}
		for (let i=0;i<maker.cone_count;i++) {
			let mesh_name = "C" + i;
			let mesh = scene.getMeshByName(mesh_name);
			mesh.dispose(true);
		}
		for (let i=0;i<maker.cylinder_count;i++) {
			let mesh_name = "Y" + i;
			let mesh = scene.getMeshByName(mesh_name);
			mesh.dispose(true);
		}
		for (let i=0;i<maker.sphere_count;i++) {
			let mesh_name = "S" + i;
			let mesh = scene.getMeshByName(mesh_name);
			mesh.dispose(true);
		}
        try {
            player1.dispose()
        } catch { }
        try {
            light1.dispose()
        } catch { }
        try {
            light2.dispose()
        } catch { }
        try {
            cape_arrow.dispose()
        } catch { }
		cones = [];
		endings = [];
		jumppads = [];
		driftPads = [];
		maker.platform_count = 0;
		maker.cone_count = 0;
		maker.cylinder_count = 0;
		maker.sphere_count = 0;
		maker.ending_count = 0;
	}
}