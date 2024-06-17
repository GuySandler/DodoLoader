var map = {
    title: "Orbit",
    song: "env2",
    maker: "applepear",
    spawn: [0, 0.5, 0],
    init: function () {
        rememberskybox = settings.skyboxEnabled;
        settings.skyboxEnabled = "off";
        cleanup.run = this.run;

        a.s([0.37007, 0.50007, -1298.91993], 21.74, "1a1a1a, 0.99", 0, 0, 0.6, true, false);
        a.s([0.37014, 0.50014, -1114.79986], 25.76, "2f6a69, 0.99", 0, 0, 0.6, true, false);
        a.s([0.37021, 6.60021, -367.64979], 79.04, "366896, 0.99", 0, 0, 0.6, true, false);
        a.s([0.37028, 6.60028, -540.82972], 83.96, "5580aa, 0.99", 0, 0, 0.6, true, false);
        a.s([0.37035, 0.50035, -1044.15965], 19.02, "993d00, 0.99", 0, 0, 0.6, true, false);
        a.s([0.37042, 6.80042, -938.68958], 123.62, "b07f35, 0.99", 0, 0, 0.6, true, false);
        a.s([0.37049, 6.05049, -747.11951], 69.3, "b08f36, 0.99", 0, 0, 0.6, true, false);
        a.s([0.37, 0.5, -1195.09], 45.9, "e6e6e6, 0.99", 0, 0, 0.6, true, false);
        a.s([-17.17993, 0.50007, -1612.04993], 406.8, "fdb813, 0.99", 0, 0, 0.6, true, false);
        a.s([0.37014, 0.50014, -200.74986], 24.42, "fff1d5, 0.99", 0, 0, 0.6, true, false);
        a.s([0.37049, 6.05049, -747.11951], 1, -1, 0, 0, 0.6, true, false);

        a.s([-17.17993, 0.50007, -1612.04993], 300, "fdb813, 0.99", 0, 0, 0.6, true, false);
        a.s([0, 0, 0], 200, -1, 0, 0, 0.6, true, false);
        
        a.p([81.3, 1.15, -700.6], [-2.1, 0.01, 0.3], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([-4.37, -23.6, -838.72], [-6.25, -0.26, -0.16], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([14.62, -25.92, -836.63], [-0.15, -0.28, -0.11], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([32.42, -27.32, -831.83], [-0.36, -0.3, -0.05], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([47.83, -27.42, -823.62], [-0.53, -0.3, 0.01], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([61.89, -26.68, -813.09], [-0.71, -0.3, 0.06], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([75.32, -24.87, -798.99], [-0.89, -0.28, 0.12], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([84.68, -21.98, -783.2], [-1.1, -0.25, 0.17], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([91.13, -18, -765.08], [-1.3, -0.21, 0.22], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([93.21, -13.56, -747.68], [-1.5, -0.16, 0.26], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([92.32, -8.37, -729.22], [-1.68, -0.12, 0.28], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([88.49, -4.05, -715.57], [-1.93, -0.04, 0.3], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([74.19, 4.97, -690.59], [-2.24, 0.05, 0.3], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([61.27, 10.57, -677.3], [-2.42, 0.1, 0.29], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([43.9, 16.22, -666.33], [-2.59, 0.15, 0.27], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([28.83, 20.35, -659.64], [-2.82, 0.2, 0.23], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([11.14, 23.85, -656.7], [-3.03, 0.25, 0.18], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([-5.6, 26.25, -657.23], [-3.29, 0.28, 0.11], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([-23.62, 27.68, -662.05], [-3.5, 0.3, 0.05], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([-43.43, 28.28, -670.88], [-3.59, 0.3, 0.02], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([-59.78, 27.77, -681.85], [-3.77, 0.3, -0.04], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([-70.4, 26.17, -693.63], [-3.97, 0.29, -0.1], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([-80.87, 23.66, -708.61], [-4.24, 0.25, -0.17], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([-89.08, 19.49, -728.42], [-4.36, 0.23, -0.2], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([-92.19, 15.65, -744.21], [-4.62, 0.17, -0.25], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([-92.09, 10.8, -761.87], [-4.82, 0.12, -0.28], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([-88.37, 5.76, -778.19], [-5.03, 0.06, -0.3], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([-81.06, 0.33, -793.98], [-5.28, -0.02, -0.3], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([-70.44, -5.39, -808.97], [-5.43, -0.06, -0.3], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([-56.7, -10.93, -821.54], [-5.62, -0.12, -0.28], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([-40.89, -15.75, -830.38], [-5.87, -0.18, -0.24], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
        a.p([-23.45, -20.02, -836.26], [-6.07, -0.23, -0.2], [24.06, 0.12, 43.42], "ffffff", 0, 0, 0.6, false, true, false, false);
       
        a.p([-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1], -1, 0, 0, 0.6, false, true, false, false);
        a.p([-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1], -1, 0, 0, 0.6, false, true, false, false);
        a.p([-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1], -1, 0, 0, 0.6, false, true, false, false);
        a.p([-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1], -1, 0, 0, 0.6, false, true, false, false);
        a.p([-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1], -1, 0, 0, 0.6, false, true, false, false);
        a.p([-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1], -1, 0, 0, 0.6, false, true, false, false);
        a.p([-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1], -1, 0, 0, 0.6, false, true, false, false);
        a.p([-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1], -1, 0, 0, 0.6, false, true, false, false);
        a.p([-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1], -1, 0, 0, 0.6, false, true, false, false);

        a.p([0, 0.5, 0], [0, 0, 0], [1, 1, 1], -1, 0, 0, 0.6, true, true, false, false);

        a.p([0, 0, -1017.37], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-77.75, 0, -1018.13], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-161.06, 0, -1032.21], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-237.94, 0, -1055.7], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-304.85, 0, -1086.31], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-365.35, 0, -1123.32], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-430.13, 0, -1175.29], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-480.55, 0, -1231.14], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-525.03, 0, -1293.43], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-568.04, 0, -1370.54], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-593.25, 0, -1444.69], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-608.08, 0, -1520.02], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-616.98, 0, -1600.1], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-612.82, 0, -1681.96], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-599.77, 0, -1761.44], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-579.11, 0, -1839.67], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-543.23, 0, -1909.72], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-486, 0, -1984.03], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-429.77, 0, -2048.09], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-356.45, 0, -2105.04], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-272.46, 0, -2152.73], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-192.74, 0, -2184.76], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-108.03, 0, -2204.69], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-32.58, 0, -2211.81], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([45.01, 0, -2206.83], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([124.02, 0, -2194.01], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([205.88, 0, -2169.1], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([275.63, 0, -2139.92], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([341.12, 0, -2097.92], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([403.76, 0, -2043.82], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([457.15, 0, -1982.61], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([504.13, 0, -1923.53], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([537.58, 0, -1853.77], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([560.96, 0, -1783.63], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([577.36, 0, -1709.83], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([585.56, 0, -1619.63], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([581.46, 0, -1538.65], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([569.16, 0, -1464.85], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([549.69, 0, -1391.05], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([514.84, 0, -1314.17], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([478.96, 0, -1253.7], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([423.61, 0, -1187.07], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([366.07, 0, -1134.28], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([283.05, 0, -1089.18], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([203.1, 0, -1053.3], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([109.82, 0, -1027.68], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([0, 0, -1017.37], [0, 0, 0], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, false, false);
        a.p([0, 0.06, -1017.37], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-77.75, 0.06, -1018.13], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-161.06, 0.06, -1032.21], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-237.94, 0.06, -1055.7], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-304.85, 0.06, -1086.31], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-365.35, 0.06, -1123.32], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-430.13, 0.06, -1175.29], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-480.55, 0.06, -1231.14], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-525.03, 0.06, -1293.43], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-568.04, 0.06, -1370.54], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-593.25, 0.06, -1444.69], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-608.08, 0.06, -1520.02], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-616.98, 0.06, -1600.1], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-612.82, 0.06, -1681.96], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-599.77, 0.06, -1761.44], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-579.11, 0.06, -1839.67], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-543.23, 0.06, -1909.72], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-486, 0.06, -1984.03], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-429.77, 0.06, -2048.09], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-356.45, 0.06, -2105.04], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-272.46, 0.06, -2152.73], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-192.74, 0.06, -2184.76], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-108.03, 0.06, -2204.69], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([-32.58, 0.06, -2211.81], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([45.01, 0.06, -2206.83], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([124.02, 0.06, -2194.01], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([205.88, 0.06, -2169.1], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([275.63, 0.06, -2139.92], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([341.12, 0.06, -2097.92], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([403.76, 0.06, -2043.82], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([457.15, 0.06, -1982.61], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([504.13, 0.06, -1923.53], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([537.58, 0.06, -1853.77], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([560.96, 0.06, -1783.63], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([577.36, 0.06, -1709.83], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([585.56, 0.06, -1619.63], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([581.46, 0.06, -1538.65], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([569.16, 0.06, -1464.85], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([549.69, 0.06, -1391.05], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([514.84, 0.06, -1314.17], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([478.96, 0.06, -1253.7], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([423.61, 0.06, -1187.07], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([366.07, 0.06, -1134.28], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([283.05, 0.06, -1089.18], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([203.1, 0.06, -1053.3], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([109.82, 0.06, -1027.68], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, true, false);
        a.p([0, 0.06, -1017.37], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98], "3a3b3c", 0, 0, 0.6, false, false, false, false);

        a.p([-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1], -1, 0, 0, 0.6, false, true, false, false);

        a.e([0, 0.50042, -1612.04958]);

        light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-17.17993, 0.50007, -1612.04993), scene);
	    light1.intensity = 3.0;
        light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(-17.17993, 0.50007, -1612.04993), scene);
        light2.includedOnlyMeshes.push(a.m('S8'));
	    light2.intensity = 50.0;

        player.actionManager = new BABYLON.ActionManager(scene);

        player.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: a.m('S0') // trigger mesh
                },
                function () {
                    map.on_planet_death("Mercury", "S0", "1a1a1a, 0.99")
                }
            )
        );
        player.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: a.m('S1') // trigger mesh
                },
                function () {
                    map.on_planet_death("Earth", "S1", "2f6a69, 0.99")
                }
            )
        );
        player.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: a.m('S2') // trigger mesh
                },
                function () {
                    map.on_planet_death("Neptune", "S2", "366896, 0.99")
                }
            )
        );
        player.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: a.m('S3') // trigger mesh
                },
                function () {
                    map.on_planet_death("Uranus", "S3", "5580aa, 0.99")
                }
            )
        );
        player.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: a.m('S4') // trigger mesh
                },
                function () {
                    map.on_planet_death("Mars", "S4", "993d00, 0.99")
                }
            )
        );
        player.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: a.m('S5') // trigger mesh
                },
                function () {
                    map.on_planet_death("Jupiter", "S5", "b07f35, 0.99")
                }
            )
        );
        player.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: a.m('S6') // trigger mesh
                },
                function () {
                    map.on_planet_death("Saturn", "S6", "b08f36, 0.99")
                }
            )
        );
        player.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: a.m('S7') // trigger mesh
                },
                function () {
                    map.on_planet_death("Venus", "S7", "e6e6e6, 0.99")
                }
            )
        );
        player.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: a.m('S11') // trigger mesh
                },
                function () {
                    if (map.planet_count == 0) return;
                    change_state.die('Died From Sun');
                }
            )
        );
    },
    post: function () {
        a.u('S0');
        a.u('S1');
        a.u('S2');
        a.u('S3');
        a.u('S4');
        a.u('S5');
        a.u('S6');
        a.u('S7');
        a.u('S8');
        a.u('S9');
        a.u('S10');
        a.u('S12');
        a.u('E0');

        a.m('S0').parent = a.m('P32');
        a.m('S1').parent = a.m('P33');
        a.m('S2').parent = a.m('P34');
        a.m('S3').parent = a.m('P35');
        a.m('S4').parent = a.m('P36');
        a.m('S5').parent = a.m('P37');
        a.m('S6').parent = a.m('P38');
        a.m('S7').parent = a.m('P39');
        a.m('S9').parent = player;
        a.m('S10').parent = a.m('P38');

        a.m('P42').parent = a.m('P136');
        a.m('P43').parent = a.m('P136');
        a.m('P44').parent = a.m('P136');
        a.m('P45').parent = a.m('P136');
        a.m('P46').parent = a.m('P136');
        a.m('P47').parent = a.m('P136');
        a.m('P48').parent = a.m('P136');
        a.m('P49').parent = a.m('P136');
        a.m('P50').parent = a.m('P136');
        a.m('P51').parent = a.m('P136');
        a.m('P52').parent = a.m('P136');
        a.m('P53').parent = a.m('P136');
        a.m('P54').parent = a.m('P136');
        a.m('P55').parent = a.m('P136');
        a.m('P56').parent = a.m('P136');
        a.m('P57').parent = a.m('P136');
        a.m('P58').parent = a.m('P136');
        a.m('P59').parent = a.m('P136');
        a.m('P60').parent = a.m('P136');
        a.m('P61').parent = a.m('P136');
        a.m('P62').parent = a.m('P136');
        a.m('P63').parent = a.m('P136');
        a.m('P64').parent = a.m('P136');
        a.m('P65').parent = a.m('P136');
        a.m('P66').parent = a.m('P136');
        a.m('P67').parent = a.m('P136');
        a.m('P68').parent = a.m('P136');
        a.m('P69').parent = a.m('P136');
        a.m('P70').parent = a.m('P136');
        a.m('P71').parent = a.m('P136');
        a.m('P72').parent = a.m('P136');
        a.m('P73').parent = a.m('P136');
        a.m('P74').parent = a.m('P136');
        a.m('P75').parent = a.m('P136');
        a.m('P76').parent = a.m('P136');
        a.m('P77').parent = a.m('P136');
        a.m('P78').parent = a.m('P136');
        a.m('P79').parent = a.m('P136');
        a.m('P80').parent = a.m('P136');
        a.m('P81').parent = a.m('P136');
        a.m('P82').parent = a.m('P136');
        a.m('P83').parent = a.m('P136');
        a.m('P84').parent = a.m('P136');
        a.m('P85').parent = a.m('P136');
        a.m('P86').parent = a.m('P136');
        a.m('P87').parent = a.m('P136');
        a.m('P88').parent = a.m('P136');
        a.m('P89').parent = a.m('P136');
        a.m('P90').parent = a.m('P136');
        a.m('P91').parent = a.m('P136');
        a.m('P92').parent = a.m('P136');
        a.m('P93').parent = a.m('P136');
        a.m('P94').parent = a.m('P136');
        a.m('P95').parent = a.m('P136');
        a.m('P96').parent = a.m('P136');
        a.m('P97').parent = a.m('P136');
        a.m('P98').parent = a.m('P136');
        a.m('P99').parent = a.m('P136');
        a.m('P100').parent = a.m('P136');
        a.m('P101').parent = a.m('P136');
        a.m('P102').parent = a.m('P136');
        a.m('P103').parent = a.m('P136');
        a.m('P104').parent = a.m('P136');
        a.m('P105').parent = a.m('P136');
        a.m('P106').parent = a.m('P136');
        a.m('P107').parent = a.m('P136');
        a.m('P108').parent = a.m('P136');
        a.m('P109').parent = a.m('P136');
        a.m('P110').parent = a.m('P136');
        a.m('P111').parent = a.m('P136');
        a.m('P112').parent = a.m('P136');
        a.m('P113').parent = a.m('P136');
        a.m('P114').parent = a.m('P136');
        a.m('P115').parent = a.m('P136');
        a.m('P116').parent = a.m('P136');
        a.m('P117').parent = a.m('P136');
        a.m('P118').parent = a.m('P136');
        a.m('P119').parent = a.m('P136');
        a.m('P120').parent = a.m('P136');
        a.m('P121').parent = a.m('P136');
        a.m('P122').parent = a.m('P136');
        a.m('P123').parent = a.m('P136');
        a.m('P124').parent = a.m('P136');
        a.m('P125').parent = a.m('P136');
        a.m('P126').parent = a.m('P136');
        a.m('P127').parent = a.m('P136');
        a.m('P128').parent = a.m('P136');
        a.m('P129').parent = a.m('P136');
        a.m('P130').parent = a.m('P136');
        a.m('P131').parent = a.m('P136');
        a.m('P132').parent = a.m('P136');
        a.m('P133').parent = a.m('P136');
        a.m('P134').parent = a.m('P136');
        a.m('P135').parent = a.m('P136');

        a.m('P0').parent = a.m('S10');
        a.m('P1').parent = a.m('S10');
        a.m('P2').parent = a.m('S10');
        a.m('P3').parent = a.m('S10');
        a.m('P4').parent = a.m('S10');
        a.m('P5').parent = a.m('S10');
        a.m('P6').parent = a.m('S10');
        a.m('P7').parent = a.m('S10');
        a.m('P8').parent = a.m('S10');
        a.m('P9').parent = a.m('S10');
        a.m('P10').parent = a.m('S10');
        a.m('P11').parent = a.m('S10');
        a.m('P12').parent = a.m('S10');
        a.m('P13').parent = a.m('S10');
        a.m('P14').parent = a.m('S10');
        a.m('P15').parent = a.m('S10');
        a.m('P16').parent = a.m('S10');
        a.m('P17').parent = a.m('S10');
        a.m('P18').parent = a.m('S10');
        a.m('P19').parent = a.m('S10');
        a.m('P20').parent = a.m('S10');
        a.m('P21').parent = a.m('S10');
        a.m('P22').parent = a.m('S10');
        a.m('P23').parent = a.m('S10');
        a.m('P24').parent = a.m('S10');
        a.m('P25').parent = a.m('S10');
        a.m('P26').parent = a.m('S10');
        a.m('P27').parent = a.m('S10');
        a.m('P28').parent = a.m('S10');
        a.m('P29').parent = a.m('S10');
        a.m('P30').parent = a.m('S10');
        a.m('P31').parent = a.m('S10');

        cc.set_monkey("cameraDownAngle", 5 * Math.PI / 180);
        cc.set_monkey("camera.maxZ", 5000.0);
        cc.set_monkey("light.intensity", 0);
        cc.set_monkey("radius", 2.5);
        cc.set_monkey("camera.fov mul2", 1.0);
        cc.set_monkey("speed", default_speed * 0);
        cc.set_monkey("gravity", new BABYLON.Vector3(null, 0, null));
        cc.set_monkey("steer", 0.03);
        cc.set_monkey("jumpSpeed", 0);
        cc.set_monkey("jumpHeight", 0);
        cc.set_monkey("player.scaling",new BABYLON.Vector3(1, 1, 1));
        cc.refresh();
    },
    section_id: 0,
    ch: 0,
    cv: 0,
    cd: 0,
    skip: false,
    ss: 0,
    planet_count: 8,
    cooldown: false,
    section_update: function () {
        a.m('P42').physicsImpostor.forceUpdate();
        a.m('P43').physicsImpostor.forceUpdate();
        a.m('P44').physicsImpostor.forceUpdate();
        a.m('P45').physicsImpostor.forceUpdate();
        a.m('P46').physicsImpostor.forceUpdate();
        a.m('P47').physicsImpostor.forceUpdate();
        a.m('P48').physicsImpostor.forceUpdate();
        a.m('P49').physicsImpostor.forceUpdate();
        a.m('P50').physicsImpostor.forceUpdate();
        a.m('P51').physicsImpostor.forceUpdate();
        a.m('P52').physicsImpostor.forceUpdate();
        a.m('P53').physicsImpostor.forceUpdate();
        a.m('P54').physicsImpostor.forceUpdate();
        a.m('P55').physicsImpostor.forceUpdate();
        a.m('P56').physicsImpostor.forceUpdate();
        a.m('P57').physicsImpostor.forceUpdate();
        a.m('P58').physicsImpostor.forceUpdate();
        a.m('P59').physicsImpostor.forceUpdate();
        a.m('P60').physicsImpostor.forceUpdate();
        a.m('P61').physicsImpostor.forceUpdate();
        a.m('P62').physicsImpostor.forceUpdate();
        a.m('P63').physicsImpostor.forceUpdate();
        a.m('P64').physicsImpostor.forceUpdate();
        a.m('P65').physicsImpostor.forceUpdate();
        a.m('P66').physicsImpostor.forceUpdate();
        a.m('P67').physicsImpostor.forceUpdate();
        a.m('P68').physicsImpostor.forceUpdate();
        a.m('P69').physicsImpostor.forceUpdate();
        a.m('P70').physicsImpostor.forceUpdate();
        a.m('P71').physicsImpostor.forceUpdate();
        a.m('P72').physicsImpostor.forceUpdate();
        a.m('P73').physicsImpostor.forceUpdate();
        a.m('P74').physicsImpostor.forceUpdate();
        a.m('P75').physicsImpostor.forceUpdate();
        a.m('P76').physicsImpostor.forceUpdate();
        a.m('P77').physicsImpostor.forceUpdate();
        a.m('P78').physicsImpostor.forceUpdate();
        a.m('P79').physicsImpostor.forceUpdate();
        a.m('P80').physicsImpostor.forceUpdate();
        a.m('P81').physicsImpostor.forceUpdate();
        a.m('P82').physicsImpostor.forceUpdate();
        a.m('P83').physicsImpostor.forceUpdate();
        a.m('P84').physicsImpostor.forceUpdate();
        a.m('P85').physicsImpostor.forceUpdate();
        a.m('P86').physicsImpostor.forceUpdate();
        a.m('P87').physicsImpostor.forceUpdate();
        a.m('P88').physicsImpostor.forceUpdate();
        a.m('P89').physicsImpostor.forceUpdate();
        a.m('P90').physicsImpostor.forceUpdate();
        a.m('P91').physicsImpostor.forceUpdate();
        a.m('P92').physicsImpostor.forceUpdate();
        a.m('P93').physicsImpostor.forceUpdate();
        a.m('P94').physicsImpostor.forceUpdate();
        a.m('P95').physicsImpostor.forceUpdate();
        a.m('P96').physicsImpostor.forceUpdate();
        a.m('P97').physicsImpostor.forceUpdate();
        a.m('P98').physicsImpostor.forceUpdate();
        a.m('P99').physicsImpostor.forceUpdate();
        a.m('P100').physicsImpostor.forceUpdate();
        a.m('P101').physicsImpostor.forceUpdate();
        a.m('P102').physicsImpostor.forceUpdate();
        a.m('P103').physicsImpostor.forceUpdate();
        a.m('P104').physicsImpostor.forceUpdate();
        a.m('P105').physicsImpostor.forceUpdate();
        a.m('P106').physicsImpostor.forceUpdate();
        a.m('P107').physicsImpostor.forceUpdate();
        a.m('P108').physicsImpostor.forceUpdate();
        a.m('P109').physicsImpostor.forceUpdate();
        a.m('P110').physicsImpostor.forceUpdate();
        a.m('P111').physicsImpostor.forceUpdate();
        a.m('P112').physicsImpostor.forceUpdate();
        a.m('P113').physicsImpostor.forceUpdate();
        a.m('P114').physicsImpostor.forceUpdate();
        a.m('P115').physicsImpostor.forceUpdate();
        a.m('P116').physicsImpostor.forceUpdate();
        a.m('P117').physicsImpostor.forceUpdate();
        a.m('P118').physicsImpostor.forceUpdate();
        a.m('P119').physicsImpostor.forceUpdate();
        a.m('P120').physicsImpostor.forceUpdate();
        a.m('P121').physicsImpostor.forceUpdate();
        a.m('P122').physicsImpostor.forceUpdate();
        a.m('P123').physicsImpostor.forceUpdate();
        a.m('P124').physicsImpostor.forceUpdate();
        a.m('P125').physicsImpostor.forceUpdate();
        a.m('P126').physicsImpostor.forceUpdate();
        a.m('P127').physicsImpostor.forceUpdate();
        a.m('P128').physicsImpostor.forceUpdate();
        a.m('P129').physicsImpostor.forceUpdate();
        a.m('P130').physicsImpostor.forceUpdate();
        a.m('P131').physicsImpostor.forceUpdate();
        a.m('P132').physicsImpostor.forceUpdate();
        a.m('P133').physicsImpostor.forceUpdate();
        a.m('P134').physicsImpostor.forceUpdate();
        a.m('P135').physicsImpostor.forceUpdate();

        a.rot('P32', 'y', 1-0.1*(8-this.planet_count)) // mercury
        a.rot('P33', 'y', 0.62-0.05*(8-this.planet_count)) // earth
        a.rot('P34', 'y', 0.11) // neptune
        a.rot('P35', 'y', 0.14) // uranus
        a.rot('P36', 'y', 0.5-0.05*(8-this.planet_count)) // mars
        a.rot('P37', 'y', 0.27) // jupiter
        a.rot('P38', 'y', 0.2) // saturn
        a.rot('P39', 'y', 0.73-0.05*(8-this.planet_count)) // venus
        a.rot('P136', 'y', 0.2)

        if (update.are_touching(player, a.m('E0'), 20)) { 
            change_state.win();
        }

        let PZ = player.position.z;
        switch (this.section_id) {
            case 0:
                if (PZ < 1) {
                    steer = default_steer * 0.0;
                    this.ch = cam_horizontal;
                    this.cv = cam_vertical;
                    this.cd = cam_depression;
                    cam_horizontal = 0;
                    cam_vertical = 4000;
                    cam_depression = 1.57;
                    this.section_id += 1
                }
                break;
            case 1:
                camera.position.x = -17.1789;
		        camera.position.z = -1612.05;
                if (score > 10) {
                    a.msg_set("Press space to skip.")
                    this.section_id += 1
                }
                break;
            case 2:
                camera.position.x = -17.1789;
		        camera.position.z = -1612.05;
                if (controls.space) {
                    this.skip = true;
                    this.section_id = 7;
                }
                if (score > 60) {
                    a.msg_del()
                    this.section_id += 1
                }
                break;
            case 3:
                camera.position.x = -17.1789;
		        camera.position.z = -1612.05;
                if (controls.space) {
                    this.skip = true;
                    this.section_id = 7;
                }
                if (score > 120) {
                    a.re('P41', [0, -1000, 0], [0, 0, 0], [1, 1, 1]);
                    a.msg_del()
                    a.msg_set("You remember the day vividly. It was August 24, 2006.");
                    this.section_id += 1
                }
                break;
            case 4:
                camera.position.x = -17.1789;
		        camera.position.z = -1612.05;
                if (score > 360) {
                    a.msg_del()
                    a.msg_set("It was the day Earth decided that Pluto was no longer a planet.");
                    this.section_id += 1
                }
                break;
            case 5:
                camera.position.x = -17.1789;
		        camera.position.z = -1612.05;
                if (score > 600) {
                    a.msg_del()
                    a.msg_set("As revenge, you have vowed to destroy every single planet.");
                    this.section_id += 1
                }
                break;
            case 6:
                camera.position.x = -17.1789;
		        camera.position.z = -1612.05;
                if (score > 840) {
                    a.msg_del()
                    a.msg_set("With each planet destroyed, the remaining will orbit a little slower.");
                    this.section_id += 1
                }
                break;
            case 7:
                camera.position.x = -17.1789;
		        camera.position.z = -1612.05;
                if (score > 1080 || this.skip) {
                    steer = default_steer;
                    cam_horizontal = this.ch;
                    cam_vertical = this.cv;
                    cam_depression = this.cd;
                    speed = 10 * default_speed;
                    radius = 12;
                    a.cam_d(radius);
                    a.msg_del()
                    a.msg_set("Crash into a planet to destroy it!")

                    const skymat1 = new BABYLON.StandardMaterial("skyBox1", scene);
                    skymat1.backFaceCulling = false;
                    const texture1 = new BABYLON.Texture("assets/textures/skybox.jpg", scene);
                    skymat1.reflectionTexture = texture1;
                    skymat1.reflectionTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;
                    skymat1.disableLighting = true;
                    skybox1 = BABYLON.Mesh.CreateBox("skyBox1", 5000, scene);
                    skybox1.infiniteDistance = true;
                    skybox1.material = skymat1;

                    skymat1.freeze();

                    this.ss = score
                    this.section_id += 1
                }
                break;
            case 8:
                if (score > this.ss+120) {
                    a.msg_del()
                    a.msg_set("Hold space for a burst of speed but slower turning.")
                    this.ss = score + 100;
                    this.section_id += 1
                }
                break;
            case 9:
                if (controls.space) {
                    speed = 20 * default_speed;
                    steer = 0.5 * default_steer;
                } else {
                    speed = 10 * default_speed;
                    steer = default_steer;
                }
                if (score > this.ss+100) {
                    a.msg_del()
                    a.msg_set("Be wary of the asteroid belt and the Sun. The Sun will weaken with every planet destroyed.")
                    this.section_id += 1
                }
                break;
            case 10:
                if (controls.space) {
                    speed = 20 * default_speed;
                    steer = 0.5 * default_steer;
                } else {
                    speed = 10 * default_speed;
                    steer = default_steer;
                }
                if (score > this.ss+240) {
                    a.msg_del()
                    this.ss = Infinity
                    if (this.planet_count == 0) {
                        a.msg_set("Go into the sun.")
                    }
                }
                break;
        }
    },
    reset: function () {
        this.section_id = 0;
        this.skip = false;
        this.ss = 0;
        this.planet_count = 8;
        this.cooldown = false;
        try {
            skybox1.dispose();
        } catch {
            // ¯\_(ツ)_/¯
        }
        a.re('S0', [0.37007-(-17.17993), 0.50007-0.50042, -1298.91993-(-1612.04958)], [0, 0, 0], [22, 22, 22]); // mercury
        a.re('S1', [0.37014-(-17.17993), 0.50014-0.50042, -1114.79986-(-1612.04958)], [0, 0, 0], [45.9, 45.9, 45.9]); // earth
        a.re('S2', [0.37021-(-17.17993), 6.60021-0.50042, -367.64979-(-1612.04958)], [0, 0, 0], [60, 60, 60]); // neptune
        a.re('S3', [0.37028-(-17.17993), 6.60028-0.50042, -540.82972-(-1612.04958)], [0, 0, 0], [60, 60, 60]); // uranus
        a.re('S4', [0.37035-(-17.17993), 0.50035-0.50042, -1044.15965-(-1612.04958)], [0, 0, 0], [25.76, 25.76, 25.76]); // mars
        a.re('S5', [0.37042-(-17.17993), 6.80042-0.50042, -938.68958-(-1612.04958)], [0, 0, 0], [100, 100, 100]); // jupiter
        a.re('S6', [0.37049-(-17.17993), 6.05049-0.50042, -747.11951-(-1612.04958)], [0, 0, 0], [80, 80, 80]); // saturn
        a.re('S7', [0.37-(-17.17993), 0.5-0.50042, -1195.09-(-1612.04958)], [0, 0, 0], [45.9, 45.9, 45.9]); // venus
        a.re('S8', [-17.17993, 0.50007, -1612.04993], [0, 0, 0], [406.8, 406.8, 406.8]); // sun
        a.re('S9', [0, 0, 0], [0, 0, 0], [12, 12, 12]); // pluto
        a.re('S10', [0.37049-(-17.17993), 6.05049-0.50042, -747.11951-(-1612.04958)], [0, 0, 0], [1, 1, 1]); // saturn ring parent
        a.re('S11', [-17.17993, 0.50007, -1612.04993], [0, 0, 0], [300, 300, 300]);
        a.re('S12', [0, 0, 0], [0, 0, 0], [200, 200, 200]);

        a.m('S0').isVisible = true;
        a.m('S1').isVisible = true;
        a.m('S2').isVisible = true;
        a.m('S3').isVisible = true;
        a.m('S4').isVisible = true;
        a.m('S5').isVisible = true;
        a.m('S6').isVisible = true;
        a.m('S7').isVisible = true;
        
        a.re('P0', [81.3-0.37049, 1.15-6.05049, -700.6-(-747.11951)], [-2.1, 0.01, 0.3], [24.06, 0.12, 43.42]);
        a.re('P1', [-4.37-0.37049, -23.6-6.05049, -838.72-(-747.11951)], [-6.25, -0.26, -0.16], [24.06, 0.12, 43.42]);
        a.re('P2', [14.62-0.37049, -25.92-6.05049, -836.63-(-747.11951)], [-0.15, -0.28, -0.11], [24.06, 0.12, 43.42]);
        a.re('P3', [32.42-0.37049, -27.32-6.05049, -831.83-(-747.11951)], [-0.36, -0.3, -0.05], [24.06, 0.12, 43.42]);
        a.re('P4', [47.83-0.37049, -27.42-6.05049, -823.62-(-747.11951)], [-0.53, -0.3, 0.01], [24.06, 0.12, 43.42]);
        a.re('P5', [61.89-0.37049, -26.68-6.05049, -813.09-(-747.11951)], [-0.71, -0.3, 0.06], [24.06, 0.12, 43.42]);
        a.re('P6', [75.32-0.37049, -24.87-6.05049, -798.99-(-747.11951)], [-0.89, -0.28, 0.12], [24.06, 0.12, 43.42]);
        a.re('P7', [84.68-0.37049, -21.98-6.05049, -783.2-(-747.11951)], [-1.1, -0.25, 0.17], [24.06, 0.12, 43.42]);
        a.re('P8', [91.13-0.37049, -18-6.05049, -765.08-(-747.11951)], [-1.3, -0.21, 0.22], [24.06, 0.12, 43.42]);
        a.re('P9', [93.21-0.37049, -13.56-6.05049, -747.68-(-747.11951)], [-1.5, -0.16, 0.26], [24.06, 0.12, 43.42]);
        a.re('P10', [92.32-0.37049, -8.37-6.05049, -729.22-(-747.11951)], [-1.68, -0.12, 0.28], [24.06, 0.12, 43.42]);
        a.re('P11', [88.49-0.37049, -4.05-6.05049, -715.57-(-747.11951)], [-1.93, -0.04, 0.3], [24.06, 0.12, 43.42]);
        a.re('P12', [74.19-0.37049, 4.97-6.05049, -690.59-(-747.11951)], [-2.24, 0.05, 0.3], [24.06, 0.12, 43.42]);
        a.re('P13', [61.27-0.37049, 10.57-6.05049, -677.3-(-747.11951)], [-2.42, 0.1, 0.29], [24.06, 0.12, 43.42]);
        a.re('P14', [43.9-0.37049, 16.22-6.05049, -666.33-(-747.11951)], [-2.59, 0.15, 0.27], [24.06, 0.12, 43.42]);
        a.re('P15', [28.83-0.37049, 20.35-6.05049, -659.64-(-747.11951)], [-2.82, 0.2, 0.23], [24.06, 0.12, 43.42]);
        a.re('P16', [11.14-0.37049, 23.85-6.05049, -656.7-(-747.11951)], [-3.03, 0.25, 0.18], [24.06, 0.12, 43.42]);
        a.re('P17', [-5.6-0.37049, 26.25-6.05049, -657.23-(-747.11951)], [-3.29, 0.28, 0.11], [24.06, 0.12, 43.42]);
        a.re('P18', [-23.62-0.37049, 27.68-6.05049, -662.05-(-747.11951)], [-3.5, 0.3, 0.05], [24.06, 0.12, 43.42]);
        a.re('P19', [-43.43-0.37049, 28.28-6.05049, -670.88-(-747.11951)], [-3.59, 0.3, 0.02], [24.06, 0.12, 43.42]);
        a.re('P20', [-59.78-0.37049, 27.77-6.05049, -681.85-(-747.11951)], [-3.77, 0.3, -0.04], [24.06, 0.12, 43.42]);
        a.re('P21', [-70.4-0.37049, 26.17-6.05049, -693.63-(-747.11951)], [-3.97, 0.29, -0.1], [24.06, 0.12, 43.42]);
        a.re('P22', [-80.87-0.37049, 23.66-6.05049, -708.61-(-747.11951)], [-4.24, 0.25, -0.17], [24.06, 0.12, 43.42]);
        a.re('P23', [-89.08-0.37049, 19.49-6.05049, -728.42-(-747.11951)], [-4.36, 0.23, -0.2], [24.06, 0.12, 43.42]);
        a.re('P24', [-92.19-0.37049, 15.65-6.05049, -744.21-(-747.11951)], [-4.62, 0.17, -0.25], [24.06, 0.12, 43.42]);
        a.re('P25', [-92.09-0.37049, 10.8-6.05049, -761.87-(-747.11951)], [-4.82, 0.12, -0.28], [24.06, 0.12, 43.42]);
        a.re('P26', [-88.37-0.37049, 5.76-6.05049, -778.19-(-747.11951)], [-5.03, 0.06, -0.3], [24.06, 0.12, 43.42]);
        a.re('P27', [-81.06-0.37049, 0.33-6.05049, -793.98-(-747.11951)], [-5.28, -0.02, -0.3], [24.06, 0.12, 43.42]);
        a.re('P28', [-70.44-0.37049, -5.39-6.05049, -808.97-(-747.11951)], [-5.43, -0.06, -0.3], [24.06, 0.12, 43.42]);
        a.re('P29', [-56.7-0.37049, -10.93-6.05049, -821.54-(-747.11951)], [-5.62, -0.12, -0.28], [24.06, 0.12, 43.42]);
        a.re('P30', [-40.89-0.37049, -15.75-6.05049, -830.38-(-747.11951)], [-5.87, -0.18, -0.24], [24.06, 0.12, 43.42]);
        a.re('P31', [-23.45-0.37049, -20.02-6.05049, -836.26-(-747.11951)], [-6.07, -0.23, -0.2], [24.06, 0.12, 43.42]);
        
        a.re('P32', [-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1]);
        a.re('P33', [-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1]);
        a.re('P34', [-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1]);
        a.re('P35', [-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1]);
        a.re('P36', [-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1]);
        a.re('P37', [-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1]);
        a.re('P38', [-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1]);
        a.re('P39', [-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1]);
        a.re('P40', [-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1]);

        a.re('P41', [0, 0.5, 0], [0, 0, 0], [1, 1, 1]);

        a.re('P42', [0-(-17.17993), 0-0.50007, -1017.37-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P43', [-77.75-(-17.17993), 0-0.50007, -1018.13-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P44', [-161.06-(-17.17993), 0-0.50007, -1032.21-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P45', [-237.94-(-17.17993), 0-0.50007, -1055.7-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P46', [-304.85-(-17.17993), 0-0.50007, -1086.31-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P47', [-365.35-(-17.17993), 0-0.50007, -1123.32-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P48', [-430.13-(-17.17993), 0-0.50007, -1175.29-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P49', [-480.55-(-17.17993), 0-0.50007, -1231.14-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P50', [-525.03-(-17.17993), 0-0.50007, -1293.43-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P51', [-568.04-(-17.17993), 0-0.50007, -1370.54-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P52', [-593.25-(-17.17993), 0-0.50007, -1444.69-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P53', [-608.08-(-17.17993), 0-0.50007, -1520.02-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P54', [-616.98-(-17.17993), 0-0.50007, -1600.1-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P55', [-612.82-(-17.17993), 0-0.50007, -1681.96-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P56', [-599.77-(-17.17993), 0-0.50007, -1761.44-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P57', [-579.11-(-17.17993), 0-0.50007, -1839.67-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P58', [-543.23-(-17.17993), 0-0.50007, -1909.72-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P59', [-486-(-17.17993), 0-0.50007, -1984.03-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P60', [-429.77-(-17.17993), 0-0.50007, -2048.09-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P61', [-356.45-(-17.17993), 0-0.50007, -2105.04-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P62', [-272.46-(-17.17993), 0-0.50007, -2152.73-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P63', [-192.74-(-17.17993), 0-0.50007, -2184.76-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P64', [-108.03-(-17.17993), 0-0.50007, -2204.69-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P65', [-32.58-(-17.17993), 0-0.50007, -2211.81-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P66', [45.01-(-17.17993), 0-0.50007, -2206.83-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P67', [124.02-(-17.17993), 0-0.50007, -2194.01-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P68', [205.88-(-17.17993), 0-0.50007, -2169.1-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P69', [275.63-(-17.17993), 0-0.50007, -2139.92-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P70', [341.12-(-17.17993), 0-0.50007, -2097.92-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P71', [403.76-(-17.17993), 0-0.50007, -2043.82-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P72', [457.15-(-17.17993), 0-0.50007, -1982.61-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P73', [504.13-(-17.17993), 0-0.50007, -1923.53-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P74', [537.58-(-17.17993), 0-0.50007, -1853.77-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P75', [560.96-(-17.17993), 0-0.50007, -1783.63-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P76', [577.36-(-17.17993), 0-0.50007, -1709.83-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P77', [585.56-(-17.17993), 0-0.50007, -1619.63-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P78', [581.46-(-17.17993), 0-0.50007, -1538.65-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P79', [569.16-(-17.17993), 0-0.50007, -1464.85-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P80', [549.69-(-17.17993), 0-0.50007, -1391.05-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P81', [514.84-(-17.17993), 0-0.50007, -1314.17-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P82', [478.96-(-17.17993), 0-0.50007, -1253.7-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P83', [423.61-(-17.17993), 0-0.50007, -1187.07-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P84', [366.07-(-17.17993), 0-0.50007, -1134.28-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P85', [283.05-(-17.17993), 0-0.50007, -1089.18-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P86', [203.1-(-17.17993), 0-0.50007, -1053.3-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P87', [109.82-(-17.17993), 0-0.50007, -1027.68-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P88', [0-(-17.17993), 0-0.50007, -1017.37-(-1612.04958)], [0, 0, 0], [13.98, 13.98, 13.98]);
        a.re('P89', [0-(-17.17993), 0.06-0.50007, -1017.37-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P90', [-77.75-(-17.17993), 0.06-0.50007, -1018.13-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P91', [-161.06-(-17.17993), 0.06-0.50007, -1032.21-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P92', [-237.94-(-17.17993), 0.06-0.50007, -1055.7-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P93', [-304.85-(-17.17993), 0.06-0.50007, -1086.31-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P94', [-365.35-(-17.17993), 0.06-0.50007, -1123.32-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P95', [-430.13-(-17.17993), 0.06-0.50007, -1175.29-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P96', [-480.55-(-17.17993), 0.06-0.50007, -1231.14-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P97', [-525.03-(-17.17993), 0.06-0.50007, -1293.43-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P98', [-568.04-(-17.17993), 0.06-0.50007, -1370.54-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P99', [-593.25-(-17.17993), 0.06-0.50007, -1444.69-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P100', [-608.08-(-17.17993), 0.06-0.50007, -1520.02-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P101', [-616.98-(-17.17993), 0.06-0.50007, -1600.1-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P102', [-612.82-(-17.17993), 0.06-0.50007, -1681.96-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P103', [-599.77-(-17.17993), 0.06-0.50007, -1761.44-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P104', [-579.11-(-17.17993), 0.06-0.50007, -1839.67-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P105', [-543.23-(-17.17993), 0.06-0.50007, -1909.72-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P106', [-486-(-17.17993), 0.06-0.50007, -1984.03-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P107', [-429.77-(-17.17993), 0.06-0.50007, -2048.09-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P108', [-356.45-(-17.17993), 0.06-0.50007, -2105.04-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P109', [-272.46-(-17.17993), 0.06-0.50007, -2152.73-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P110', [-192.74-(-17.17993), 0.06-0.50007, -2184.76-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P111', [-108.03-(-17.17993), 0.06-0.50007, -2204.69-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P112', [-32.58-(-17.17993), 0.06-0.50007, -2211.81-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P113', [45.01-(-17.17993), 0.06-0.50007, -2206.83-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P114', [124.02-(-17.17993), 0.06-0.50007, -2194.01-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P115', [205.88-(-17.17993), 0.06-0.50007, -2169.1-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P116', [275.63-(-17.17993), 0.06-0.50007, -2139.92-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P117', [341.12-(-17.17993), 0.06-0.50007, -2097.92-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P118', [403.76-(-17.17993), 0.06-0.50007, -2043.82-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P119', [457.15-(-17.17993), 0.06-0.50007, -1982.61-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P120', [504.13-(-17.17993), 0.06-0.50007, -1923.53-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P121', [537.58-(-17.17993), 0.06-0.50007, -1853.77-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P122', [560.96-(-17.17993), 0.06-0.50007, -1783.63-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P123', [577.36-(-17.17993), 0.06-0.50007, -1709.83-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P124', [585.56-(-17.17993), 0.06-0.50007, -1619.63-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P125', [581.46-(-17.17993), 0.06-0.50007, -1538.65-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P126', [569.16-(-17.17993), 0.06-0.50007, -1464.85-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P127', [549.69-(-17.17993), 0.06-0.50007, -1391.05-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P128', [514.84-(-17.17993), 0.06-0.50007, -1314.17-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P129', [478.96-(-17.17993), 0.06-0.50007, -1253.7-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P130', [423.61-(-17.17993), 0.06-0.50007, -1187.07-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P131', [366.07-(-17.17993), 0.06-0.50007, -1134.28-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P132', [283.05-(-17.17993), 0.06-0.50007, -1089.18-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P133', [203.1-(-17.17993), 0.06-0.50007, -1053.3-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P134', [109.82-(-17.17993), 0.06-0.50007, -1027.68-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);
        a.re('P135', [0-(-17.17993), 0.06-0.50007, -1017.37-(-1612.04958)], [0.27, 0.85, -0.62], [13.98, 13.98, 13.98]);

        a.re('P136', [-17.17993, 0.50007, -1612.04993], [0, 0, 0], [1, 1, 1]);

        a.re('E0', [0, 0.50042, -1612.04958], [0, 0, 0], [20, 20, 20]);
    },
    physics_update: function () {},
    render_update: function () {},
    on_planet_death: function (planet_name, mesh_name, colourStr) {
        if (this.cooldown) return;

        this.planet_count -= 1;
        if (this.planet_count != 0) {
            if (planet_name == "Earth") {
                a.msg_set(`Earth down. Who's the planet now? ${map.planet_count} to go.`);
            } else if (planet_name == "Uranus") { 
                a.msg_set(`Uranus down, it was never funny. ${map.planet_count} to go.`);
            } else {
                a.msg_set(`${planet_name} down. ${map.planet_count} to go.`); // msg
            }
        } else {
            a.msg_set(`${planet_name} down. You have wiped out every planet.`);
        }
        this.ss = score;

        a.m(mesh_name).isVisible = false; // make mesh invis
        if (mesh_name == "S6") {
            var childMeshes = a.m('S10').getChildMeshes();
            for (var i = 0; i < childMeshes.length; i++) {
                childMeshes[i].isVisible = false;
            }
        }

        var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
        
        particleSystem.particleTexture = new BABYLON.Texture("assets/textures/flare.png", scene);
        
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 1.5;
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.5;
        particleSystem.emitRate = 100000;
        
        a.m('S12').position = a.m(mesh_name).getAbsolutePosition();
        particleSystem.emitter = a.m('S12'); // emitter mesh

        particleSystem.emitPower = 1000;
        
        let colour = decorations.hexToRgb(`#${colourStr}`); // colour object
        
        particleSystem.color1 = new BABYLON.Color4(colour.r, colour.g, colour.b, 1);
        particleSystem.color2 = new BABYLON.Color4(colour.r, colour.g, colour.b, 1);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.5);

        particleSystem.start();
        this.cooldown = true;

        setTimeout(function() {
            particleSystem.stop();
            a.re(mesh_name, [-1000, -1000, 1000], [0, 0, 0], [1, 1, 1]);
            map.cooldown = false;
        }, 100);
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
        light1.dispose()
        light2.dispose()
        // skybox1.dispose();
        settings.skyboxEnabled = rememberskybox;
        player.actionManager = null;
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