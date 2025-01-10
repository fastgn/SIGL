export enum EnumSkillStatus {
    not_covered = "not_covered",
    in_progress = "in_progress",
    covered = "covered",
    empty= "empty"
}

export const skillToNumber = (status: EnumSkillStatus): number => {
    switch (status) {
        case EnumSkillStatus.not_covered:
            return 1;
        case EnumSkillStatus.in_progress:
            return 2;
        case EnumSkillStatus.covered:
            return 3;
        default:
            throw new Error(`Invalid status: ${status}`);
    }
};

export const numberToSkill = (number: number): EnumSkillStatus => {
    switch (number) {
        case 1:
            return EnumSkillStatus.not_covered;
        case 2:
            return EnumSkillStatus.in_progress;
        case 3:
            return EnumSkillStatus.covered;
        default:
            throw new Error(`Invalid number: ${number}`);
    }
};