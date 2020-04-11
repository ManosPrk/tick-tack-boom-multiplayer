

export function getCards() {
    return ['ΒΙΟ', 'ΒΕ', 'ΡΑΣ', 'ΡΙ', 'ΓΡΑ', 'ΔΑ', 'ΚΟΙ', 'ΚΕ', 'ΝΤΕ', 'ΝΟ', 'ΤΡΟ', 'ΤΙ', 'ΣΤΑ', 'ΣΕ', 'ΛΟΣ', 'ΛΙ', 'ΒΟΣ', 'ΡΟ'];
}

export function getDiceSide() {
    const sides = ['TICK', 'TACK', 'BOOM']
    let newSide = sides[Math.floor(Math.random() * sides.length)];
    return newSide;
}

export function getRandomSecs() {
    return Math.floor(Math.random() * (40 - 10) + 10);
}