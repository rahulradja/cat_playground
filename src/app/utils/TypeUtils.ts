export function randomArrayElement(arr: any[])
{
    return arr[Math.floor(Math.random() * arr.length)];
}

export function randomNumberBetween(lowerBound: number, upperBound: number)
{
    if (lowerBound > upperBound){ throw new Error("cant get random number")}
    if (lowerBound === upperBound){ return lowerBound; }
    const distance = upperBound - lowerBound;
    return Math.random() * distance + lowerBound
}