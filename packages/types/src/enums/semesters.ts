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

export const getColorFromSemester = (semester: EnumSemester): string => {
    switch (semester) {
        case EnumSemester.S5:
            return "#ff7254";
        case EnumSemester.S6:
            return "#8abe00";
        case EnumSemester.S7:
            return "#0ce457";
        case EnumSemester.S8:
            return "#0cbde4";
        case EnumSemester.S9:
            return "#5800fe";
        case EnumSemester.S10:
            return "#d00065";
    }
};