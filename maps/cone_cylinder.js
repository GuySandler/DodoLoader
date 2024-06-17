var map = {
    title: "Cone Cylinder",
    song: "env2",
    maker: "Cr43zy",
    spawn: [0, 0.5, 0],
    init: function() {
        a.e([9.68, 12.0603, -177.72]);
        a.y([-13.49, 3.98006, -132.87], [1.49, 0, -1.52], [10.44, 40, 10.44], 3.0, 0);
        a.c([0, -1.45988, -57.15], true);
        a.c([0, -1.33982, -67.17], true);
        a.c([0, -1.54976, -50.05], true);
        a.c([-0.31, -1.9497, -42.59], true);
        a.c([-10.92, 2.95, -86.95], true);
        a.c([-11.32, 3.10006, -90.48], true);
        a.c([-13.79, 6.070119999999999, -92.99], true);
        a.c([-14.69, 9.87018, -145.13], true);
        a.c([-10.77, 9.23024, -138.66], true);
        a.c([-12.83, 9.4103, -133.16], true);
        a.c([-7.91, 11.139999999999999, -158.78], true);
        a.c([-4.13, 10.00006, -155.47], true);
        a.c([-0.08, 10.98012, -161.72], true);
        a.c([-3.93, 9.60018, -168.38], true);
        a.c([-0.34, 9.91024, -171.51], true);
        a.c([-3.05, 11.5003, -163.12], true);
        a.c([11.29, 12.9, -180.6], true);
        a.c([5.63, 9.58006, -166.01], true);
        a.c([11.36, 8.770119999999999, -171.97], true);
        a.c([4.6, 10.37018, -177.72], true);
        a.c([3.16, 11.320239999999998, -167.9], true);
        a.c([12.23, 11.270299999999999, -175.73], true);
        a.c([0.1, 11.26, -168.41], true);
        a.c([5.15, 12.180060000000001, -171.7], true);
        a.c([7.9, 12.520119999999999, -176.47], true);
        a.c([-0.38, -0.8598199999999999, -18.05], true);
        a.p([0, -2.55976, -44.03], [0, 0, 0.72], [4.48, 0.46, 36.18], 1, 0);
        a.y([0.72, 6.1403, -166.99], [0.87, 0, -1.52], [10.44, 40, 10.44], 3.0, 0);
        a.p([-0.46, -2.56, -10.63], [0, 0, 0], [7.42, 2, 32.22], 1, 0);
        a.p([0, -2.55994, -44.03], [0, 0, 0.72], [4.48, 0.46, 36.18], 1, 0);
        a.p([-10.88, 1.36012, -88.23], [0.75, 0.58, -0.65], [9.54, 1.68, 50.82], 1, 0);
        a.y([0, -7.269819999999999, -66.61], [0, 0, 0], [11, 11, 11], 1, 0);
        a.y([-14.72, 2.72024, -111.53], [0, 0, 0], [16.44, 11, 16.44], 1, 0);
    },
    post: function() {},
    section_id: 0,
    section_update: function() {},
    reset: function() {
        this.section_id = 0;
        a.re('Y0', [-13.49, 3.98006, -132.87], [1.49, 0, -1.52], [10.44, 40, 10.44]);
        a.re('C0', [0, -1.45988, -57.15], [0, 0, 0], [2, 2, 2]);
        a.re('C1', [0, -1.33982, -67.17], [0, 0, 0], [2, 2, 2]);
        a.re('C2', [0, -1.54976, -50.05], [0, 0, 0], [2, 2, 2]);
        a.re('C3', [-0.31, -1.9497, -42.59], [0, 0, 0], [2, 2, 2]);
        a.re('C4', [-10.92, 2.95, -86.95], [0, 0, 0], [2, 2, 2]);
        a.re('C5', [-11.32, 3.10006, -90.48], [0, 0, 0], [2, 2, 2]);
        a.re('C6', [-13.79, 6.070119999999999, -92.99], [0, 0, 0], [2, 2, 2]);
        a.re('C7', [-14.69, 9.87018, -145.13], [0, 0, 0], [2, 2, 2]);
        a.re('C8', [-10.77, 9.23024, -138.66], [0, 0, 0], [2, 2, 2]);
        a.re('C9', [-12.83, 9.4103, -133.16], [0, 0, 0], [2, 2, 2]);
        a.re('C10', [-7.91, 11.139999999999999, -158.78], [0, 0, 0], [2, 2, 2]);
        a.re('C11', [-4.13, 10.00006, -155.47], [0, 0, 0], [2, 2, 2]);
        a.re('C12', [-0.08, 10.98012, -161.72], [0, 0, 0], [2, 2, 2]);
        a.re('C13', [-3.93, 9.60018, -168.38], [0, 0, 0], [2, 2, 2]);
        a.re('C14', [-0.34, 9.91024, -171.51], [0, 0, 0], [2, 2, 2]);
        a.re('C15', [-3.05, 11.5003, -163.12], [0, 0, 0], [2, 2, 2]);
        a.re('C16', [11.29, 12.9, -180.6], [0, 0, 0], [2, 2, 2]);
        a.re('C17', [5.63, 9.58006, -166.01], [0, 0, 0], [2, 2, 2]);
        a.re('C18', [11.36, 8.770119999999999, -171.97], [0, 0, 0], [2, 2, 2]);
        a.re('C19', [4.6, 10.37018, -177.72], [0, 0, 0], [2, 2, 2]);
        a.re('C20', [3.16, 11.320239999999998, -167.9], [0, 0, 0], [2, 2, 2]);
        a.re('C21', [12.23, 11.270299999999999, -175.73], [0, 0, 0], [2, 2, 2]);
        a.re('C22', [0.1, 11.26, -168.41], [0, 0, 0], [2, 2, 2]);
        a.re('C23', [5.15, 12.180060000000001, -171.7], [0, 0, 0], [2, 2, 2]);
        a.re('C24', [7.9, 12.520119999999999, -176.47], [0, 0, 0], [2, 2, 2]);
        a.re('C25', [-0.38, -0.8598199999999999, -18.05], [0, 0, 0], [2, 2, 2]);
        a.re('P0', [0, -2.55976, -44.03], [0, 0, 0.72], [4.48, 0.46, 36.18]);
        a.re('Y1', [0.72, 6.1403, -166.99], [0.87, 0, -1.52], [10.44, 40, 10.44]);
        a.re('P1', [-0.46, -2.56, -10.63], [0, 0, 0], [7.42, 2, 32.22]);
        a.re('P2', [0, -2.55994, -44.03], [0, 0, 0.72], [4.48, 0.46, 36.18]);
        a.re('P3', [-10.88, 1.36012, -88.23], [0.75, 0.58, -0.65], [9.54, 1.68, 50.82]);
        a.re('Y2', [0, -7.269819999999999, -66.61], [0, 0, 0], [11, 11, 11]);
        a.re('Y3', [-14.72, 2.72024, -111.53], [0, 0, 0], [16.44, 11, 16.44]);
    },
    physics_update: function() {},
    render_update: function() {}
}
