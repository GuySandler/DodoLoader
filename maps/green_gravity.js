var map = {
    title: "Green Gravity",
    song: "env2",
    maker: "uPilot",
    spawn: [0, 0.5, 0],
    init: function() {
        a.p([0.00049, 4.69049, -157.11951], [0, 0.01, 0], [9.08, 2, 33.8], "00ff7b,0.5", 0, 0, 0.6, false, false);
        a.c([-2.69, 16.44, -331.37], "03fc45");
        a.p([0.00007000000000000001, 14.95007, -324.83993], [0, 0.01, 0], [9.08, 2, 33.8], "03fc45,0.5", 0, 0, 0.6, false, false);
        a.c([2.87014, 16.44014, -324.03986000000003], "03fc45");
        a.c([3.20021, 16.44021, -331.36978999999997], "03fc45");
        a.c([-2.68972, 16.44028, -324.03972], "03fc45");
        a.c([-2.87965, 6.4003499999999995, -62.75965], "21ff6b");
        a.c([0.020419999999999997, 6.4004199999999996, -65.20958], "21ff6b");
        a.c([2.8704899999999998, 6.40049, -68.85951], "21ff6b");
        a.c([3.12, 6.3999999999999995, -60.72], "21ff6b");
        a.p([0.00007000000000000001, 4.69007, -64.60993], [0, 0.01, 0], [9.08, 2, 33.8], "21ff6b,0.5", 0, 0, 0.6, false, false);
        a.p([0.00014000000000000001, 9.14014, -97.93986000000001], [0, 0.28, 0], [9.08, 2, 33.8], "21ff6b,0.5", 0, 0, 0.6, false, false);
        a.p([0.00021, -0.23979, -31.609789999999997], [0, 0.28, 0], [9.08, 2, 33.8], "21ff6b,0.5", 0, 0, 0.6, false, false);
        a.p([0.00028000000000000003, -0.23972000000000002, 0.00028000000000000003], [0, -0.27, 0], [9.08, 2, 33.8], "21ff6b,0.5", 0, 0, 0.6, false, false);
        a.p([0.00035000000000000005, 4.6903500000000005, -224.85965], [0, 0.01, -0.36], [9.08, 2, 33.8], "00ff7b,0.5", 0, 0, 0.6, false, false);
        a.p([0.00042, 4.69042, -190.80957999999998], [0, 0.01, 0.44], [9.08, 2, 33.8], "00ff7b,0.5", 0, 0, 0.6, false, false);
        a.p([0.00049, 4.69049, -224.85951], [0, 0.01, -0.36], [9.08, 2, 33.8], "00ff7b,0.5", 0, 0, 0.6, false, false);
        a.p([0, 4.69, -258.68], [0, 0.01, 0], [9.08, 2, 33.8], "03fc45,0.5", 0, 0, 0.6, false, false);
        a.p([0.00007000000000000001, 9.770069999999999, -291.82993], [0, 0.3, 0], [9.08, 2, 33.8], "03fc45,0.5", 0, 0, 0.6, false, false);
        a.p([0.00014000000000000001, 11.36014, -357.95986], [0, -0.23, 0], [9.08, 2, 33.8], "03fc45,0.5", 0, 0, 0.6, true, false);
        a.p([0.00021, 17.53021, -414.31979], [0, 0.29, 0], [9.08, 2, 33.8], "03fc45,0.5", 0, 0, 0.6, true, false);
        a.e([0.00028000000000000003, 0.00028000000000000003, 40.17028]);
        a.e([0.00035000000000000005, 18.280350000000002, -409.69964999999996]);
        a.e([0.00042, 17.24042, -403.94957999999997]);
        a.e([0.00049, 19.43049, -415.29951]);
        a.e([0, 20.6, -421.46]);
        a.e([0.00007000000000000001, 22.23007, -426.39993000000004]);
        a.e([0.00014000000000000001, 15.11014, -400.06985999999995]);
    },
    post: function() {
        cc.set_monkey("speed", default_speed * 1.01);
        cc.set_monkey("gravity", new BABYLON.Vector3(null, null, 45));
        cc.set_monkey("steer", 0.03);
        cc.refresh();
    },
    section_id: 0,
    section_update: function() {
        let PZ = player.position.z;
        switch (this.section_id) {
            case 0:
                if (PZ < -16.459650000000003) {
                    a.g(null, 0.3, 0.0);
                    this.section_id += 1
                }
                break;
            case 1:
                if (PZ < -82.03965) {
                    a.g(null, null, null);
                    this.section_id += 1
                }
                break;
            case 2:
                if (PZ < -82.06958) {
                    a.g(null, null, 3.0);
                    this.section_id += 1
                }
                break;
            case 3:
                if (PZ < -151.66958) {
                    a.g(null, null, null);
                    this.section_id += 1
                }
                break;
            case 4:
                if (PZ < -151.73993) {
                    a.g(null, null, -3.7);
                    a.t(null, null, 1.0);
                    this.section_id += 1
                }
                break;
            case 5:
                if (PZ < -266.73992999999996) {
                    a.g(null, null, null);
                    a.t(null, null, null);
                    this.section_id += 1
                }
                break;
            case 6:
                if (PZ < -267.14972) {
                    a.g(null, null, 0.0);
                    this.section_id += 1
                }
                break;
            case 7:
                if (PZ < -310.14972) {
                    a.g(null, null, null);
                    this.section_id += 1
                }
                break;
            case 8:
                if (PZ < -327.72979) {
                    a.js(1.0);
                    a.jh(1.0);
                    a.msg_set("Jump at the right time! ");
                    a.g(null, null, -6.0);
                    this.section_id += 1
                }
                break;
            case 9:
                if (PZ < -471.90979000000004) {
                    a.js(null);
                    a.jh(null);
                    a.msg_del();
                    a.g(null, null, null);
                    this.section_id += 1
                }
                break;
        }
    },
    reset: function() {
        this.section_id = 0;
        a.re('P0', [0.00049, 4.69049, -157.11951], [0, 0.01, 0], [9.08, 2, 33.8]);
        a.re('C0', [-2.69, 16.44, -331.37], [0, 0, 0], [2, 2, 2]);
        a.re('P1', [0.00007000000000000001, 14.95007, -324.83993], [0, 0.01, 0], [9.08, 2, 33.8]);
        a.re('C1', [2.87014, 16.44014, -324.03986000000003], [0, 0, 0], [2, 2, 2]);
        a.re('C2', [3.20021, 16.44021, -331.36978999999997], [0, 0, 0], [2, 2, 2]);
        a.re('C3', [-2.68972, 16.44028, -324.03972], [0, 0, 0], [2, 2, 2]);
        a.re('C4', [-2.87965, 6.4003499999999995, -62.75965], [0, 0, 0], [2, 2, 2]);
        a.re('C5', [0.020419999999999997, 6.4004199999999996, -65.20958], [0, 0, 0], [2, 2, 2]);
        a.re('C6', [2.8704899999999998, 6.40049, -68.85951], [0, 0, 0], [2, 2, 2]);
        a.re('C7', [3.12, 6.3999999999999995, -60.72], [0, 0, 0], [2, 2, 2]);
        a.re('P2', [0.00007000000000000001, 4.69007, -64.60993], [0, 0.01, 0], [9.08, 2, 33.8]);
        a.re('P3', [0.00014000000000000001, 9.14014, -97.93986000000001], [0, 0.28, 0], [9.08, 2, 33.8]);
        a.re('P4', [0.00021, -0.23979, -31.609789999999997], [0, 0.28, 0], [9.08, 2, 33.8]);
        a.re('P5', [0.00028000000000000003, -0.23972000000000002, 0.00028000000000000003], [0, -0.27, 0], [9.08, 2, 33.8]);
        a.re('P6', [0.00035000000000000005, 4.6903500000000005, -224.85965], [0, 0.01, -0.36], [9.08, 2, 33.8]);
        a.re('P7', [0.00042, 4.69042, -190.80957999999998], [0, 0.01, 0.44], [9.08, 2, 33.8]);
        a.re('P8', [0.00049, 4.69049, -224.85951], [0, 0.01, -0.36], [9.08, 2, 33.8]);
        a.re('P9', [0, 4.69, -258.68], [0, 0.01, 0], [9.08, 2, 33.8]);
        a.re('P10', [0.00007000000000000001, 9.770069999999999, -291.82993], [0, 0.3, 0], [9.08, 2, 33.8]);
        a.re('P11', [0.00014000000000000001, 11.36014, -357.95986], [0, -0.23, 0], [9.08, 2, 33.8]);
        a.re('P12', [0.00021, 17.53021, -414.31979], [0, 0.29, 0], [9.08, 2, 33.8]);
        a.re('E0', [0.00028000000000000003, 0.00028000000000000003, 40.17028], [0, 0, 0], [1, 1, 1]);
        a.re('E1', [0.00035000000000000005, 18.280350000000002, -409.69964999999996], [0, 0, 0], [1, 1, 1]);
        a.re('E2', [0.00042, 17.24042, -403.94957999999997], [0, 0, 0], [1, 1, 1]);
        a.re('E3', [0.00049, 19.43049, -415.29951], [0, 0, 0], [1, 1, 1]);
        a.re('E4', [0, 20.6, -421.46], [0, 0, 0], [1, 1, 1]);
        a.re('E5', [0.00007000000000000001, 22.23007, -426.39993000000004], [0, 0, 0], [1, 1, 1]);
        a.re('E6', [0.00014000000000000001, 15.11014, -400.06985999999995], [0, 0, 0], [1, 1, 1]);
    },
    physics_update: function() {},
    render_update: function() {}
}
