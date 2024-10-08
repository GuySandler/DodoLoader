/* eslint-disable */

var boot = {
    didPreload: false,
    preload: async function() {
        if (this.didPreload) return;
        this.didPreload = true;
        await start.init();
        await decorations.init();
        await maker.init();
        await start.create_scene();
        await cc.set_default();
        await decorations.add_particle_system();
    },
    init: async function() {
        window.checkpoints = [];
        window.checkpointNum = 0;
        checkpoint = scene.getMeshesByTags("checkpoint")
        for(var i of checkpoint) {
            i.dispose();
        }
        await fov.init();
        await flyjump.init();
        const mapScript = document.querySelector('#map-script').innerHTML;
        eval(mapScript);
        await map.init();
        await cc.refresh()
        decorations.addOrRemoveSkybox()
        await change_state.spawn();
        // await premium.updatePremiumRequirementMet();
        await map.post();
        window.ogdistance = Math.sqrt((Math.abs(player.position.x-window.end.position.x)^2)+(Math.abs(player.position.z-window.end.position.z)^2))-2;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
