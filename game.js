const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let deck = [];
let hand = [];
let endTurnButton;

function preload() {
    this.load.image('cardBack', 'assets/cardBack.png');
    this.load.image('cardFront', 'assets/cardFront.png');
}

function create() {
    createDeck();
    dealCards.call(this);

    endTurnButton = this.add.text(700, 550, 'End Turn', { fill: '#0f0' })
        .setInteractive()
        .on('pointerdown', () => endTurn.call(this));
}

function update() {
    // This function is called every frame
}

function createDeck() {
    deck = [];
    for (let i = 0; i < 200; i++) {
        deck.push({
            front: 'cardFront',
            designation: `Card ${i + 1}`,
            traits: {
                strength: Math.floor(Math.random() * 10) + 1,
                agility: Math.floor(Math.random() * 10) + 1
            }
        });
    }
    Phaser.Utils.Array.Shuffle(deck);
}

function dealCards() {
    hand.forEach(card => card.destroy());
    hand = [];

    for (let i = 0; i < 3; i++) {
        if (deck.length > 0) {
            const cardData = deck.pop();
            const card = createCard.call(this, 300 + i * 100, 300, cardData);
            hand.push(card);
        }
    }
}

function createCard(x, y, cardData) {
    const card = this.add.container(x, y);
    
    const backSprite = this.add.sprite(0, 0, 'cardBack');
    const frontSprite = this.add.sprite(0, 0, 'cardFront');
    frontSprite.setVisible(false);

    const text = this.add.text(0, 0, cardData.designation, { fontSize: '16px', fill: '#000' });
    text.setOrigin(0.5);
    text.setVisible(false);

    card.add([backSprite, frontSprite, text]);
    card.setSize(backSprite.width, backSprite.height);
    card.setInteractive();
    card.on('pointerdown', () => flipCard(card));

    card.cardData = cardData;
    return card;
}

function flipCard(card) {
    const backSprite = card.getAt(0);
    const frontSprite = card.getAt(1);
    const text = card.getAt(2);

    backSprite.setVisible(!backSprite.visible);
    frontSprite.setVisible(!frontSprite.visible);
    text.setVisible(!text.visible);
}

function endTurn() {
    dealCards.call(this);
}

function repositionCards(x, y, spacing) {
    hand.forEach((card, index) => {
        card.setPosition(x + index * spacing, y);
    });
}

function rescaleCards(scale) {
    hand.forEach(card => {
        card.setScale(scale);
    });
}