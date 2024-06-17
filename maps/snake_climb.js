var map = {
    title: "Snake Climb",
    song: "env2",
    maker: "Kazil",
    spawn: [0, 0.5, 0],
    init: function() {
        a.c([8.18, 0.300010001, -15.12]);
        a.c([8.18, 0.300010001, -11.23]);
        a.c([12.43, 0.300010001, -13.28]);
        a.c([16.31, 0.300010001, -11.23]);
        a.c([16.31, 0.300010001, -15.12]);
        a.c([18.44, -0.61, -13.08]);
        a.p([0, -0.5, -3], [0, 0, 0], [3, 0.5, 6]);
        a.p([1.84, -0.49, -12.23], [-1.05, 0, 0], [3, 0.5, 6]);
        a.p([0, -0.5, -9.04], [0, 0, 0], [3, 0.5, 6]);
        a.p([10.67, -0.48, -13.08], [0, 0, 0], [14, 0.5, 8]);
        a.p([20.89, -0.49, -11.86], [-1.22, 0, 0], [3, 0.5, 8]);
        a.p([20.86, -0.5, -14.29], [-1.92, 0, 0], [3, 0.5, 8]);
        a.p([22.85, -19.99, -43.04], [-0.79, 0, 0], [3.2, 0.5, 6]);
        a.p([32.46, -0.47, -18.47], [1.57, 2.79, 0], [14, 0.5, 6]);
        a.p([27.1, -1.47, -23.87], [-1.57, 0, 0], [3.2, 0.5, 6]);
        a.p([-3.19, -3.17, -41.76], [-1.57, 0, 0], [3.2, 0.5, 6]);
        a.p([-7.83, -2.17, -34.37], [1.57, -2.79, 0], [18, 0.5, 6]);
        a.p([-3.19, -2.18, -26.83], [-1.57, 0, 0], [3.2, 0.5, 6]);
        a.p([15, -20, -41.82], [0, 0, 0], [14, 0.5, 4]);
        a.p([24.57, -19.98, -47.02], [0, 0, 0], [3.2, 0.5, 6]);
        a.p([27.1, -0.48, -13.08], [-1.57, 0, 0], [3.2, 0.5, 6]);
        a.p([24.57, -11.29, -58.8], [0, -2.09, 0], [4, 0.5, 22]);
        a.p([24.57, 10.56, -66.52], [0, -1.75, 0], [4, 0.5, 25]);
        a.p([24.57, 40.47, -79.57], [0, -2.62, 0], [4, 0.5, 2]);
        a.p([24.57, 31.4, -73.71], [0, -2.09, 0], [4, 0.5, 20]);
        a.p([24.57, 43.38, -99.39], [0, -1.57, 0], [4, 0.2, 0.6]);
        a.p([22.78, 43.74, -99.39], [0, 0, 0.79], [2, 0.6, 0.2]);
        a.p([22.78, 42.74, -99.41], [0, 0, -0.79], [2, 0.6, 0.2]);
        a.y([17.95, -3.37, -26.72], [-0.35, 0, -1.57], [4, 14, 4]);
        a.y([5.42, -3.27, -28.07], [0.17, 0, -1.57], [3.4, 14, 3.4]);
        a.p([24.57, 40.93, -114.53], [-1.57, 0, 0], [68.02, 0.5, 8.04]);
        a.e([-5.48, 41.83, -114.53]);
    },
    post: function() {
        a.m('C0').unfreezeWorldMatrix();
        a.m('C0').material = decorations.materials.moving_mat;
        a.m('C1').unfreezeWorldMatrix();
        a.m('C1').material = decorations.materials.moving_mat;
        a.m('C2').unfreezeWorldMatrix();
        a.m('C2').material = decorations.materials.moving_mat;
        a.m('C3').unfreezeWorldMatrix();
        a.m('C3').material = decorations.materials.moving_mat;
        a.m('C4').unfreezeWorldMatrix();
        a.m('C4').material = decorations.materials.moving_mat;
        a.m('C5').unfreezeWorldMatrix();
        a.m('C5').material = decorations.materials.moving_mat;
        a.m('P0').unfreezeWorldMatrix();
        a.m('P0').material = decorations.materials.moving_mat;
        a.m('P1').unfreezeWorldMatrix();
        a.m('P1').material = decorations.materials.moving_mat;
        a.m('P2').unfreezeWorldMatrix();
        a.m('P2').material = decorations.materials.moving_mat;
        a.m('P3').unfreezeWorldMatrix();
        a.m('P3').material = decorations.materials.moving_mat;
        a.m('P4').unfreezeWorldMatrix();
        a.m('P4').material = decorations.materials.moving_mat;
        a.m('P5').unfreezeWorldMatrix();
        a.m('P5').material = decorations.materials.moving_mat;
        a.m('P6').unfreezeWorldMatrix();
        a.m('P6').material = decorations.materials.moving_mat;
        a.m('P7').unfreezeWorldMatrix();
        a.m('P7').material = decorations.materials.moving_mat;
        a.m('P8').unfreezeWorldMatrix();
        a.m('P8').material = decorations.materials.moving_mat;
        a.m('P9').unfreezeWorldMatrix();
        a.m('P9').material = decorations.materials.moving_mat;
        a.m('P10').unfreezeWorldMatrix();
        a.m('P10').material = decorations.materials.moving_mat;
        a.m('P11').unfreezeWorldMatrix();
        a.m('P11').material = decorations.materials.moving_mat;
        a.m('P12').unfreezeWorldMatrix();
        a.m('P12').material = decorations.materials.moving_mat;
        a.m('P13').unfreezeWorldMatrix();
        a.m('P13').material = decorations.materials.moving_mat;
        a.m('P14').unfreezeWorldMatrix();
        a.m('P14').material = decorations.materials.moving_mat;
        a.m('P15').unfreezeWorldMatrix();
        a.m('P15').material = decorations.materials.moving_mat;
        a.m('P16').unfreezeWorldMatrix();
        a.m('P16').material = decorations.materials.moving_mat;
        a.m('P17').unfreezeWorldMatrix();
        a.m('P17').material = decorations.materials.moving_mat;
        a.m('P18').unfreezeWorldMatrix();
        a.m('P18').material = decorations.materials.moving_mat;
        a.m('P19').unfreezeWorldMatrix();
        a.m('P19').material = decorations.materials.moving_mat;
        a.m('P20').unfreezeWorldMatrix();
        a.m('P20').material = decorations.materials.moving_mat;
        a.m('P21').unfreezeWorldMatrix();
        a.m('P21').material = decorations.materials.moving_mat;
        a.m('Y0').unfreezeWorldMatrix();
        // a.m('Y0').material = decorations.materials.moving_mat;
        a.m('Y1').unfreezeWorldMatrix();
        // a.m('Y1').material = decorations.materials.moving_mat;
        a.m('P22').unfreezeWorldMatrix();
        a.m('P22').material = decorations.materials.moving_mat;
    },
    section_id: 0,
    section_update: function() {
        let PZ = player.position.z;
        switch (this.section_id) {
            case 0:
                if (PZ < -0.1700000000000017) {
                    speed = default_speed * 0.7;
                    steer = default_steer * 1.65;
                    update.set_gravity(default_gravity * 0.6);
                    this.section_id += 1
                }
                break;
            case 1:
                if (PZ < -49.67) {
                    speed = default_speed;
                    steer = default_steer;
                    update.set_gravity(default_gravity);
                    this.section_id += 1
                }
                break;
            case 2:
                if (PZ < -49.79) {
                    update.set_gravity(default_gravity * -1.0);
                    this.section_id += 1
                }
                break;
            case 3:
                if (PZ < -64.71) {
                    update.set_gravity(default_gravity);
                    this.section_id += 1
                }
                break;
            case 4:
                if (PZ < -95.5) {
                    update.set_gravity(default_gravity * 7.0);
                    steer = default_steer * 1.5;
                    this.section_id += 1
                }
                break;
            case 5:
                a.m('P22').rotation.y += 0.009;
                if (PZ < -188.24) {
                    update.set_gravity(default_gravity);
                    steer = default_steer;
                    this.section_id += 1
                }
                break;
        }
    },
    reset: function() {
        this.section_id = 0;
        a.m('C0').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('C0').rotation.x = 0;
        a.m('C0').rotation.y = 0;
        a.m('C0').rotation.z = 0;
        a.m('C0').position.x = 8.18;
        a.m('C0').position.y = 0.300010001;
        a.m('C0').position.z = -15.12;
        a.m('C0').scaling.x = 2;
        a.m('C0').scaling.y = 2;
        a.m('C0').scaling.z = 2;
        a.m('C1').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('C1').rotation.x = 0;
        a.m('C1').rotation.y = 0;
        a.m('C1').rotation.z = 0;
        a.m('C1').position.x = 8.18;
        a.m('C1').position.y = 0.300010001;
        a.m('C1').position.z = -11.23;
        a.m('C1').scaling.x = 2;
        a.m('C1').scaling.y = 2;
        a.m('C1').scaling.z = 2;
        a.m('C2').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('C2').rotation.x = 0;
        a.m('C2').rotation.y = 0;
        a.m('C2').rotation.z = 0;
        a.m('C2').position.x = 12.43;
        a.m('C2').position.y = 0.300010001;
        a.m('C2').position.z = -13.28;
        a.m('C2').scaling.x = 2;
        a.m('C2').scaling.y = 2;
        a.m('C2').scaling.z = 2;
        a.m('C3').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('C3').rotation.x = 0;
        a.m('C3').rotation.y = 0;
        a.m('C3').rotation.z = 0;
        a.m('C3').position.x = 16.31;
        a.m('C3').position.y = 0.300010001;
        a.m('C3').position.z = -11.23;
        a.m('C3').scaling.x = 2;
        a.m('C3').scaling.y = 2;
        a.m('C3').scaling.z = 2;
        a.m('C4').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('C4').rotation.x = 0;
        a.m('C4').rotation.y = 0;
        a.m('C4').rotation.z = 0;
        a.m('C4').position.x = 16.31;
        a.m('C4').position.y = 0.300010001;
        a.m('C4').position.z = -15.12;
        a.m('C4').scaling.x = 2;
        a.m('C4').scaling.y = 2;
        a.m('C4').scaling.z = 2;
        a.m('C5').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('C5').rotation.x = 0;
        a.m('C5').rotation.y = 0;
        a.m('C5').rotation.z = 0;
        a.m('C5').position.x = 18.44;
        a.m('C5').position.y = -0.61;
        a.m('C5').position.z = -13.08;
        a.m('C5').scaling.x = 2;
        a.m('C5').scaling.y = 2;
        a.m('C5').scaling.z = 2;
        a.m('P0').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P0').rotation.x = 0;
        a.m('P0').rotation.y = 0;
        a.m('P0').rotation.z = 0;
        a.m('P0').position.x = 0;
        a.m('P0').position.y = -0.5;
        a.m('P0').position.z = -3;
        a.m('P0').scaling.x = 3;
        a.m('P0').scaling.y = 0.5;
        a.m('P0').scaling.z = 6;
        a.m('P1').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P1').rotation.x = 0;
        a.m('P1').rotation.y = -1.05;
        a.m('P1').rotation.z = 0;
        a.m('P1').position.x = 1.84;
        a.m('P1').position.y = -0.49;
        a.m('P1').position.z = -12.23;
        a.m('P1').scaling.x = 3;
        a.m('P1').scaling.y = 0.5;
        a.m('P1').scaling.z = 6;
        a.m('P2').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P2').rotation.x = 0;
        a.m('P2').rotation.y = 0;
        a.m('P2').rotation.z = 0;
        a.m('P2').position.x = 0;
        a.m('P2').position.y = -0.5;
        a.m('P2').position.z = -9.04;
        a.m('P2').scaling.x = 3;
        a.m('P2').scaling.y = 0.5;
        a.m('P2').scaling.z = 6;
        a.m('P3').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P3').rotation.x = 0;
        a.m('P3').rotation.y = 0;
        a.m('P3').rotation.z = 0;
        a.m('P3').position.x = 10.67;
        a.m('P3').position.y = -0.48;
        a.m('P3').position.z = -13.08;
        a.m('P3').scaling.x = 14;
        a.m('P3').scaling.y = 0.5;
        a.m('P3').scaling.z = 8;
        a.m('P4').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P4').rotation.x = 0;
        a.m('P4').rotation.y = -1.22;
        a.m('P4').rotation.z = 0;
        a.m('P4').position.x = 20.89;
        a.m('P4').position.y = -0.49;
        a.m('P4').position.z = -11.86;
        a.m('P4').scaling.x = 3;
        a.m('P4').scaling.y = 0.5;
        a.m('P4').scaling.z = 8;
        a.m('P5').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P5').rotation.x = 0;
        a.m('P5').rotation.y = -1.92;
        a.m('P5').rotation.z = 0;
        a.m('P5').position.x = 20.86;
        a.m('P5').position.y = -0.5;
        a.m('P5').position.z = -14.29;
        a.m('P5').scaling.x = 3;
        a.m('P5').scaling.y = 0.5;
        a.m('P5').scaling.z = 8;
        a.m('P6').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P6').rotation.x = 0;
        a.m('P6').rotation.y = -0.79;
        a.m('P6').rotation.z = 0;
        a.m('P6').position.x = 22.85;
        a.m('P6').position.y = -19.99;
        a.m('P6').position.z = -43.04;
        a.m('P6').scaling.x = 3.2;
        a.m('P6').scaling.y = 0.5;
        a.m('P6').scaling.z = 6;
        a.m('P7').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P7').rotation.x = 2.79;
        a.m('P7').rotation.y = 1.57;
        a.m('P7').rotation.z = 0;
        a.m('P7').position.x = 32.46;
        a.m('P7').position.y = -0.47;
        a.m('P7').position.z = -18.47;
        a.m('P7').scaling.x = 14;
        a.m('P7').scaling.y = 0.5;
        a.m('P7').scaling.z = 6;
        a.m('P8').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P8').rotation.x = 0;
        a.m('P8').rotation.y = -1.57;
        a.m('P8').rotation.z = 0;
        a.m('P8').position.x = 27.1;
        a.m('P8').position.y = -1.47;
        a.m('P8').position.z = -23.87;
        a.m('P8').scaling.x = 3.2;
        a.m('P8').scaling.y = 0.5;
        a.m('P8').scaling.z = 6;
        a.m('P9').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P9').rotation.x = 0;
        a.m('P9').rotation.y = -1.57;
        a.m('P9').rotation.z = 0;
        a.m('P9').position.x = -3.19;
        a.m('P9').position.y = -3.17;
        a.m('P9').position.z = -41.76;
        a.m('P9').scaling.x = 3.2;
        a.m('P9').scaling.y = 0.5;
        a.m('P9').scaling.z = 6;
        a.m('P10').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P10').rotation.x = -2.79;
        a.m('P10').rotation.y = 1.57;
        a.m('P10').rotation.z = 0;
        a.m('P10').position.x = -7.83;
        a.m('P10').position.y = -2.17;
        a.m('P10').position.z = -34.37;
        a.m('P10').scaling.x = 18;
        a.m('P10').scaling.y = 0.5;
        a.m('P10').scaling.z = 6;
        a.m('P11').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P11').rotation.x = 0;
        a.m('P11').rotation.y = -1.57;
        a.m('P11').rotation.z = 0;
        a.m('P11').position.x = -3.19;
        a.m('P11').position.y = -2.18;
        a.m('P11').position.z = -26.83;
        a.m('P11').scaling.x = 3.2;
        a.m('P11').scaling.y = 0.5;
        a.m('P11').scaling.z = 6;
        a.m('P12').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P12').rotation.x = 0;
        a.m('P12').rotation.y = 0;
        a.m('P12').rotation.z = 0;
        a.m('P12').position.x = 15;
        a.m('P12').position.y = -20;
        a.m('P12').position.z = -41.82;
        a.m('P12').scaling.x = 14;
        a.m('P12').scaling.y = 0.5;
        a.m('P12').scaling.z = 4;
        a.m('P13').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P13').rotation.x = 0;
        a.m('P13').rotation.y = 0;
        a.m('P13').rotation.z = 0;
        a.m('P13').position.x = 24.57;
        a.m('P13').position.y = -19.98;
        a.m('P13').position.z = -47.02;
        a.m('P13').scaling.x = 3.2;
        a.m('P13').scaling.y = 0.5;
        a.m('P13').scaling.z = 6;
        a.m('P14').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P14').rotation.x = 0;
        a.m('P14').rotation.y = -1.57;
        a.m('P14').rotation.z = 0;
        a.m('P14').position.x = 27.1;
        a.m('P14').position.y = -0.48;
        a.m('P14').position.z = -13.08;
        a.m('P14').scaling.x = 3.2;
        a.m('P14').scaling.y = 0.5;
        a.m('P14').scaling.z = 6;
        a.m('P15').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P15').rotation.x = -2.09;
        a.m('P15').rotation.y = 0;
        a.m('P15').rotation.z = 0;
        a.m('P15').position.x = 24.57;
        a.m('P15').position.y = -11.29;
        a.m('P15').position.z = -58.8;
        a.m('P15').scaling.x = 4;
        a.m('P15').scaling.y = 0.5;
        a.m('P15').scaling.z = 22;
        a.m('P16').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P16').rotation.x = -1.75;
        a.m('P16').rotation.y = 0;
        a.m('P16').rotation.z = 0;
        a.m('P16').position.x = 24.57;
        a.m('P16').position.y = 10.56;
        a.m('P16').position.z = -66.52;
        a.m('P16').scaling.x = 4;
        a.m('P16').scaling.y = 0.5;
        a.m('P16').scaling.z = 25;
        a.m('P17').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P17').rotation.x = -2.62;
        a.m('P17').rotation.y = 0;
        a.m('P17').rotation.z = 0;
        a.m('P17').position.x = 24.57;
        a.m('P17').position.y = 40.47;
        a.m('P17').position.z = -79.57;
        a.m('P17').scaling.x = 4;
        a.m('P17').scaling.y = 0.5;
        a.m('P17').scaling.z = 2;
        a.m('P18').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P18').rotation.x = -2.09;
        a.m('P18').rotation.y = 0;
        a.m('P18').rotation.z = 0;
        a.m('P18').position.x = 24.57;
        a.m('P18').position.y = 31.4;
        a.m('P18').position.z = -73.71;
        a.m('P18').scaling.x = 4;
        a.m('P18').scaling.y = 0.5;
        a.m('P18').scaling.z = 20;
        a.m('P19').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P19').rotation.x = -1.57;
        a.m('P19').rotation.y = 0;
        a.m('P19').rotation.z = 0;
        a.m('P19').position.x = 24.57;
        a.m('P19').position.y = 43.38;
        a.m('P19').position.z = -99.39;
        a.m('P19').scaling.x = 4;
        a.m('P19').scaling.y = 0.2;
        a.m('P19').scaling.z = 0.6;
        a.m('P20').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P20').rotation.x = 0;
        a.m('P20').rotation.y = 0;
        a.m('P20').rotation.z = 0.79;
        a.m('P20').position.x = 22.78;
        a.m('P20').position.y = 43.74;
        a.m('P20').position.z = -99.39;
        a.m('P20').scaling.x = 2;
        a.m('P20').scaling.y = 0.6;
        a.m('P20').scaling.z = 0.2;
        a.m('P21').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P21').rotation.x = 0;
        a.m('P21').rotation.y = 0;
        a.m('P21').rotation.z = -0.79;
        a.m('P21').position.x = 22.78;
        a.m('P21').position.y = 42.74;
        a.m('P21').position.z = -99.41;
        a.m('P21').scaling.x = 2;
        a.m('P21').scaling.y = 0.6;
        a.m('P21').scaling.z = 0.2;
        a.m('Y0').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('Y0').rotation.x = 0;
        a.m('Y0').rotation.y = -0.35;
        a.m('Y0').rotation.z = -1.57;
        a.m('Y0').position.x = 17.95;
        a.m('Y0').position.y = -3.37;
        a.m('Y0').position.z = -26.72;
        a.m('Y0').scaling.x = 4;
        a.m('Y0').scaling.y = 14;
        a.m('Y0').scaling.z = 4;
        a.m('Y1').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('Y1').rotation.x = 0;
        a.m('Y1').rotation.y = 0.17;
        a.m('Y1').rotation.z = -1.57;
        a.m('Y1').position.x = 5.42;
        a.m('Y1').position.y = -3.27;
        a.m('Y1').position.z = -28.07;
        a.m('Y1').scaling.x = 3.4;
        a.m('Y1').scaling.y = 14;
        a.m('Y1').scaling.z = 3.4;
        a.m('P22').rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        a.m('P22').rotation.x = 0;
        a.m('P22').rotation.y = -1.57;
        a.m('P22').rotation.z = 0;
        a.m('P22').position.x = 24.57;
        a.m('P22').position.y = 40.93;
        a.m('P22').position.z = -114.53;
        a.m('P22').scaling.x = 68.02;
        a.m('P22').scaling.y = 0.5;
        a.m('P22').scaling.z = 8.04;
    },
    physics_update: function() {},
    render_update: function() {}
}
