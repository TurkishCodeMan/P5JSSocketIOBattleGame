class DropGun{
    type={}
    types = [
        { name: "Tabanca", damage: 0.5, color: [44, 159, 232],image:"pistol" },
        { name: "AK-47", damage: 0.9, color: [237, 166, 24] ,image:"ak"},
        { name: "AWP", damage: 2, color: [237, 24, 24] ,image:"sniper"},
    ]
    constructor(type){
        this.x=Math.floor(Math.random()*850)+64;
        this.y=Math.floor(Math.random()*600)+64;
        this.type = this.types.find(t => t.name == type);
    }

}

module.exports=DropGun;