export class Step {
    constructor(
        public id: number,
        public firstOldPos: number[],
        public firstNewPos: number[],
        public secondOldPos: number[],
        public secondNewPos: number[]
    ) {}    
}