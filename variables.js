function buildVariables(self) {
    const variables = []
    const values = {}

    self.lights.forEach((light) => {
        variables.push({
            variableId: `light_${light.id}`,
            name: `Light ${light.name}`,
        });
        values[`light_${light.id}`] = light.name;
    });

    self.rooms.forEach((room) => {
        variables.push({
            variableId: `room_${room.id}`,
            name: `Room ${room.name}`,
        });
        values[`room_${room.id}`] = room.name;
    });

    self.scenes.forEach((scene) => {
        variables.push({
            variableId: `scene_${scene.id}`,
            name: `Scene ${scene.name}`,
        });
        values[`scene_${scene.id}`] = scene.name;
    });

    self.zones.forEach((zone) => {
        variables.push({
            variableId: `zone_${zone.id}`,
            name: `Zone ${zone.name}`,
        });
        values[`zone_${zone.id}`] = zone.name;
    });

    self.setVariableDefinitions(variables);
    self.setVariableValues(values);
}

module.exports = { buildVariables }