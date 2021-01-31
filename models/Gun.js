class Gun {
    bullets = [];
    types = [
        { name: "Tabanca", damage: 0.5, color: [44, 159, 232],image:"pistol" },
        { name: "AK-47", damage: 0.9, color: [237, 166, 24] ,image:"ak"},
        { name: "AWP", damage: 2, color: [237, 24, 24] ,image:"sniper"},
    ]
    type = {};
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = this.types.find(t => t.name == type);
    }

    fire(targetX, targetY) {
        let bb;
        this.bullets.forEach(b => {
            if (!(b.x > 900 || b.y > 640)) {
                setInterval(() => {
                    if (b.x < targetX) {
                        b.x += 4;
                        if (b.x == targetX) {
                            return;
                        }
                    }
                    if (b.x > targetX) {
                        b.x -= 4;
                        if (b.x == targetX) {
                            return;
                        }
                    }
                    if (b.y < targetY) {
                        b.y += 4;
                        if (b.y == targetY) {
                            return;
                        }
                    }
                    if (b.y > targetY) {
                        b.y -= 4;
                        if (b.y == targetY) {
                            return;
                        }
                    }

                })
                bb = b;
            }
        });



        setTimeout(() => {
            this.bullets.splice(this.bullets.findIndex(p => p == bb), 1);
        }, 800);
        return bb;

    }


}

module.exports = Gun;