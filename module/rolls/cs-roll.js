import SystemUtils from "../utils/systemUtils.js";

export const ROLL_TYPE = {
    COMBAT: 'combat',
    INTRIGUE: 'intrigue',
    OTHER: 'other'
}

export class CSRoll {
    constructor(actor, title, skill, rollData) {
        this.rollData = rollData;
        this.skill = skill;
        this.title = title;
        this.actor = actor;
        this.rollCard  = "systems/chroniclesystem/templates/chat/cs-stat-rollcard.html";
        this.results = [];
        this.type = this._getRollType()
    }

    _getRollType() {
        switch (this.skill) {
            case 'fighting':
            case 'marksmanship':
                return ROLL_TYPE.COMBAT;
            case 'deception':
            case 'persuasion':
                return ROLL_TYPE.INTRIGUE;
            default: 
                return ROLL_TYPE.OTHER;
        }
    }

    async doRoll(async = true) {
        const testDice = this.rollData.pool - this.rollData.dicePenalty;
        
        if (testDice < 0) {
            ui.notifications.info(SystemUtils.localize("CS.notifications.dicePoolInvalid"));
            return null;
        }

        let rerollFormula = '';
        if (this.rollData.reRoll) {
            rerollFormula = this.rollData.reRoll.reduce((acc, curr) => acc + `r${curr.number ? curr.number + '=' : ''}${curr.value}`,'');
        }
        
        const bonusDice = Math.max(0, this.rollData.bonusDice)
        let roll = await new Roll(`
        ${testDice + bonusDice}
        d6${rerollFormula}kh${testDice}${this.rollData.modifier 
        ? '+' + this.rollData.modifier : ''}
        `).evaluate({async: true});
        

        // TO DO: here
        const messageId = this.formula.isUserChanged ? "CS.chatMessages.customRoll" : "CS.chatMessages.simpleRoll";
        let flavor =  SystemUtils.format(messageId, {name: actor.name, test: this.title});
        resultRoll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            flavor: flavor
        });
        return resultRoll;
    }
}
