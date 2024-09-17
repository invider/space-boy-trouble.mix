const df = {
    balance: 1000,
    blueprint: null,
    battleship: null,
}

class Player {

    constructor(st) {
        augment(this, df)
        augment(this, st)
    }

    buy(cost, allowCredit) {
        if (this.balance < cost && !allowCredit) return false
        this.balance -= cost
        return true
    }

    sell(cost) {
        this.balance += cost
    }
}
