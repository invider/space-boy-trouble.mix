function upload(json) {
    const blueprint = new dna.Blueprint(json)
    blueprint.estimateCost((podName) => {
        return lib.pods.podCost(podName)
    })
    console.dir(blueprint)
    lab.screen.layout.control.designForBlueprint(blueprint)
}
