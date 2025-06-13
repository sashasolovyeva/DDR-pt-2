export const notes = ["A3", "B3b", "C4", "D4", "E4", "F4", "G4"];
export const altPattern1 = ["C4", "D4", "E4", "F4", "G4", "A4", "C5"];
export const altPattern2 = ["F4", "G4", "A4", "B4b", "C5", "D5", "E5", "F5"];

export const noteToColorMap = {
    "A3": [180, 100, 255],    // purple
    "B3b": [100, 255, 255],    // cyan
    "C4": [255, 100, 200],    // pink
    "D4": [100, 200, 255],    // light blue
    "E4": [200, 255, 100],    // light green
    "F4": [255, 200, 100],    // orange
    "G4": [255, 100, 100],    // red
    "A4": [180, 100, 255],    // purple
    "B4b": [100, 255, 255],    // cyan
    "C5": [255, 100, 200],    // pink
    "D5": [100, 200, 255],    // light blue
    "E5": [200, 255, 100],    // light green
    "F5": [255, 200, 100],    // orange
}

export function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}