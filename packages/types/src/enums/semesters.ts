export enum EnumSemester {
    S5 = "semester_5",
    S6 = "semester_6",
    S7 = "semester_7",
    S8 = "semester_8",
    S9 = "semester_9",
    S10 = "semester_10",
}

export const isBefore = (semester1: EnumSemester, semester2: EnumSemester): number => {
    const semesterOrder = [
        EnumSemester.S5,
        EnumSemester.S6,
        EnumSemester.S7,
        EnumSemester.S8,
        EnumSemester.S9,
        EnumSemester.S10
    ];

    return semesterOrder.indexOf(semester2) - semesterOrder.indexOf(semester1);
};
