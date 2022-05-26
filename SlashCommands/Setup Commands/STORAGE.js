
//#region FIND userData, use this as standpoint later!
/*
const inv = await ownedTesting.findOne({
    OwnerID: interaction.user.id
})
if(!inv){
    console.log("Created new user as no data was found on user!")
    await ownedTesting.create({
        OwnerID: interaction.user.id,
        Inventory: [{
            PokemonID: 123,
            PokemonName: "Turtle"
        }]
    })
}
*/
//#endregion FIND userData, use this as standpoint later!

//#region CREATE DOCUMENT WITH INVENTORY SIZE 0!
/*
await ownedTesting.create({
    OwnerID: interaction.user.id,
    Inventory: []
})
*/
//#endregion CREATE DOCUMENT WITH INVENTORY SIZE 0!

//#region PUSH DOCUMENT INTO INVENTORY!
/*
await ownedTesting.findOneAndUpdate({
    OwnerID: interaction.user.id
}, {
    $push: {
        Inventory: {
            PokemonID: 6969,
            PokemonName: "PG"
        }
    }
})
*/
//#endregion PUSH DOCUMENT INTO INVENTORY!

//#region LOG SPECIFIC OBJECT IN INVENTORY
/*
await inv.Inventory.find(inventory => {
    if(inventory.PokemonID === '6969'){
        console.log(inventory)
    }
})
*/
//#endregion LOG SPECIFIC OBJECT IN INVENTORY

//#region DELETE SPECIFIC OBJECT FROM INVENTORY!
/*
await ownedTesting.findOneAndUpdate({
    OwnerID: interaction.user.id,
}, {
    $pull: {
        Inventory: {
            PokemonID: 6969,
            PokemonName: "PG"
        }
    }
})
*/
//#endregion DELETE SPECIFIC OBJECT FROM INVENTORY!

//#region UPDATE SPECIFIC OBJECT IN INVENTORY!
/*
const test = await testingOwned.findOneAndUpdate({
    OwnerID: interaction.user.id,
    "Inventory.PokemonID": "PGs"
}, {
    $set: {
        'Inventory.$.PokemonID': 'PG'
    }
})
console.log(test)
*/
//#endregion UPDATE SPECIFIC OBJECT IN INVENTORY!

//#region FIND SPECIFIC OBJECTS IN INVENTORY BY KEY SIZE!

/*
const test = await ownedTesting.aggregate([{
    $match: {
        OwnerID: interaction.user.id,
    }
}, {
    $unwind: "$Inventory"
}, {
    $sort: {
        "Inventory.PokemonOrder": -1
    }
}]).limit(1)
return console.log(test)
*/
//#endregion FIND SPECIFIC OBJECTS IN INVENTORY BY KEY SIZE!

//#region FIND OBJECT BY SPECIFIC VALUE!
/*
const findselected = await userdata.findOne({
    OwnerID: interaction.user.id,
    "Inventory.PokemonSelected": true
}, {
    "Inventory.$": 1
})
*/
//#endregion FIND OBJECT BY SPECIFIC VALUE!

