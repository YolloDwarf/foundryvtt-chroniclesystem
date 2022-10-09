import SystemUtils from "../utils/systemUtils.js";

export class CSRoll {
    constructor(title, formula) {
        this.formula = formula;
        this.title = title;
        this.entityData = undefined;
        this.rollCard  = "systems/chroniclesystem/templates/chat/cs-stat-rollcard.html";
        this.results = [];
    }

    async doRoll(actor) {
        if (this.formula.pool - this.formula.dicePenalty <=0 ) {
            ui.notifications.info(SystemUtils.localize("CS.notifications.dicePoolInvalid"));
            return null;
        }
        const pool = Math.max(this.formula.pool, 1);
        const dices = pool + this.formula.bonusDice;
        let dieRoll = new Die({faces: 6, number: dices});
        dieRoll.evaluate({async : false});

        this.results = dieRoll.results;

        let reRollFormula = "r"+this.formula.reroll+"=1";
        dieRoll.reroll(reRollFormula);

        dieRoll.keep('kh' + Math.max(this.formula.pool - this.formula.dicePenalty, 0));

        const plus = new OperatorTerm({operator: "+"});
        plus.evaluate();
        const bonus = new NumericTerm({number: this.formula.modifier});
        bonus.evaluate();

        let resultRoll = Roll.fromTerms([dieRoll, plus, bonus]);
        let flavor = this.title + " test";
        resultRoll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            flavor: flavor
        });
    }
}
