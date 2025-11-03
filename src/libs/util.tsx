import { DateTime, Duration, DurationUnit, DateTimeUnit } from "luxon";

class Luxon {
    dateTime: DateTime;
    defaultFormat = "yyyy-LL-dd HH:mm:ss";
    formattedString: string;

    get f(): string {
        return this.dateTime.toFormat("yyyy-LL-dd HH:mm:ss");
    }

    constructor(obj?: number | Date | DateTime | string | Luxon | { toDate: () => Date } | null, format?: string) {
        if (obj === null || typeof obj === 'undefined') {
            this.dateTime = DateTime.now().setZone("Asia/Seoul").setLocale("ko");
        } else {
            const constructorName = (obj)?.constructor?.name;

            switch (constructorName) {
                case "Number":
                    this.dateTime = DateTime.fromMillis(obj as number).setZone("Asia/Seoul").setLocale("ko");
                    break;

                case "Date":
                    this.dateTime = DateTime.fromJSDate(obj as Date).setLocale("ko").setZone("Asia/Seoul");
                    break;
                case "DateTime":
                    this.dateTime = obj as DateTime;
                    break;
                case "String":
                    let d = obj as string;

                    if (!!format) {
                        this.dateTime = DateTime.fromFormat(d, format).setZone("Asia/Seoul").setLocale("ko");
                    } else {
                        if (d.includes("년")) {
                            d = d.replace("년", "-").replace("월", "-").replace("일", "");
                        }
                        this.dateTime = DateTime.fromJSDate(new Date(d)).setZone("Asia/Seoul").setLocale("ko");
                    }
                    break;
                case "Luxon":
                    this.dateTime = DateTime.fromJSDate((obj as Luxon).dateTime.toJSDate()).setZone("Asia/Seoul").setLocale("ko");
                    break;
                default:
                    if (typeof obj === 'object' && 'toDate' in obj && typeof obj.toDate === 'function') {
                        this.dateTime = DateTime.fromJSDate((obj as { toDate: () => Date }).toDate()).setLocale("ko").setZone("Asia/Seoul");
                    } else {
                        this.dateTime = DateTime.now().setZone("Asia/Seoul").setLocale("ko");
                    }
                    break;
            }
        }

        this.formattedString = this.dateTime.toFormat(this.defaultFormat);
    }

    add(i: number, unit: string): this {
        this.dateTime = this.dateTime.plus(Duration.fromObject({ [unit]: i }));
        this.formattedString = this.dateTime.toFormat(this.defaultFormat);
        return this;
    }

    toJSDate = (): Date => this.dateTime.toJSDate();

    returnMin(arr: Luxon[]): this {
        arr.push(this);
        const minLuxon = arr.reduce((acc: Luxon, cur) => {
            return acc.dateTime > cur.dateTime ? cur : acc;
        });

        this.dateTime = minLuxon.dateTime;
        this.formattedString = this.dateTime.toFormat(this.defaultFormat);
        return this;
    }

    static returnMin(arr: Luxon[]): Luxon {
        const min: Luxon = arr.reduce((acc: Luxon, cur) => {
            return acc.dateTime > cur.dateTime ? cur : acc;
        });

        return min;
    }

    returnMax(arr: Luxon[]): this {
        arr.push(this);
        const maxLuxon = arr.reduce((acc: Luxon, cur) => {
            return acc.dateTime < cur.dateTime ? cur : acc;
        });

        this.dateTime = maxLuxon.dateTime;
        this.formattedString = this.dateTime.toFormat(this.defaultFormat);
        return this;
    }

    static returnMax(arr: Luxon[]): Luxon {
        const max: Luxon = arr.reduce((acc: Luxon, cur) => {
            return acc.dateTime < cur.dateTime ? cur : acc;
        });

        return max;
    }

    subtract(i: number, unit: string): this {
        this.dateTime = this.dateTime.minus(Duration.fromObject({ [unit]: i }));
        this.formattedString = this.dateTime.toFormat(this.defaultFormat);
        return this;
    }

    isBetween(d1: DateTime | Luxon, d2: DateTime | Luxon, eq: "[]" | "(]" | "[)" | "()" = "[]"): boolean {
        const m1: DateTime = d1 instanceof DateTime ? d1 : (d1 as Luxon).dateTime;
        const m2: DateTime = d2 instanceof DateTime ? d2 : (d2 as Luxon).dateTime;

        let ret = false;
        if (eq === "[]") {
            ret = m1 <= this.dateTime && this.dateTime <= m2;
        } else if (eq === "(]") {
            ret = m1 < this.dateTime && this.dateTime <= m2;
        } else if (eq === "[)") {
            ret = m1 <= this.dateTime && this.dateTime < m2;
        } else if (eq === "()") {
            ret = m1 < this.dateTime && this.dateTime < m2;
        }
        this.formattedString = this.dateTime.toFormat(this.defaultFormat);
        return ret;
    }

    toFormat(fmt: string, opts?: { locale?: string, numberingSystem?: string }): string {
        return this.dateTime.toFormat(fmt, opts);
    }

    setDay(value: number, blockOver?: boolean): this {
        let day = value;
        if (blockOver) {
            const max = this.dateTime.endOf("month").day;
            if (day > max) {
                day = max;
            }
        }
        this.dateTime = this.dateTime.set({
            day,
        });
        this.formattedString = this.dateTime.toFormat(this.defaultFormat);
        return this;
    }

    setMonth(value: number, blockOver?: boolean): this {
        let month = value;
        if (blockOver) {
            const max = this.dateTime.endOf("year").month;
            if (month > max) {
                month = max;
            }
        }
        this.dateTime = this.dateTime.set({
            month,
        });
        this.formattedString = this.dateTime.toFormat(this.defaultFormat);
        return this;
    }

    startOfDay(): this {
        this.dateTime = this.dateTime.startOf("day");
        this.formattedString = this.dateTime.toFormat(this.defaultFormat);
        return this;
    }

    endOfDay(): this {
        this.dateTime = this.dateTime.endOf("day");
        this.formattedString = this.dateTime.toFormat(this.defaultFormat);
        return this;
    }

    toISOString(): string {
        return (
            this.dateTime
                .minus({
                    minute: this.dateTime.offset,
                })
                .toISO({
                    includeOffset: false,
                    extendedZone: false,
                }) + "Z"
        );
    }

    diff(m1: Luxon, unit: DurationUnit): Duration {
        return this.dateTime.diff(m1.dateTime, unit);
    }

    isSame(baseDate: Luxon): boolean {
        return this.p(true) === baseDate.p(true);
    }

    isBefore(baseDate: Luxon, inclusiveSame?: boolean): boolean {
        return inclusiveSame ? this.dateTime <= baseDate.dateTime : this.dateTime < baseDate.dateTime;
    }

    isAfter(baseDate: Luxon, inclusiveSame?: boolean): boolean {
        return inclusiveSame ? this.dateTime >= baseDate.dateTime : this.dateTime > baseDate.dateTime;
    }

    getAdd(i: number, unit: string): DateTime {
        return this.dateTime.plus(Duration.fromObject({ [unit]: i }));
    }

    year(): number {
        return this.dateTime.year;
    }

    month(): number {
        return this.dateTime.month;
    }

    day(): number {
        return this.dateTime.day;
    }

    weekDay(max: number = 7): number {
        const weekday = this.dateTime.weekday;
        return weekday <= max ? weekday : weekday - max - (7 - max);
    }

    isWeekend(): boolean {
        return this.dateTime.isWeekend;
    }

    isLeapYear(): boolean {
        return this.dateTime.isInLeapYear;
    }

    endOf(type: DateTimeUnit): Luxon {
        return luxon(this.dateTime.endOf(type).toJSDate());
    }

    startOf(type: DateTimeUnit): Luxon {
        return luxon(this.dateTime.startOf(type).toJSDate());
    }

    isSameDate(day: number): boolean {
        let check = day;
        if (this.endOf("month").dateTime.day <= day) {
            check = this.endOf("month").dateTime.day;
        }
        return this.dateTime.day === check;
    }

    inCount(day: number, end: Luxon, eq: "[]" | "(]" | "[)" | "()" = "()"): number {
        if (this.isSame(end) && this.isSameDate(day)) {
            return eq.includes("[") || eq.includes("]") ? 1 : 0;
        } else if (this.startOf("month").isSame(end.startOf("month"))) {
            return this.clone().setDay(day).isBetween(this.clone(), end, eq) ? 1 : 0;
        } else {
            const monthsDiff = (end.year() - this.year()) * 12 + (end.month() - this.month());
            const startDay = this.day();
            const endDay = end.day();
            let count = monthsDiff - 1;

            const maxStartDay = this.clone().setDay(day, true).day();
            const maxEndDay = end.clone().setDay(day, true).day();

            if ((eq.includes("[") && startDay <= maxStartDay) || (!eq.includes("[") && startDay < maxStartDay)) {
                count++;
            }
            if ((eq.includes("]") && endDay >= maxEndDay) || (!eq.includes("]") && endDay > maxEndDay)) {
                count++;
            }

            return count > 0 ? count : 0;
        }
    }

    closeDay(day: number, func: "+" | "-", excludeStartDate?: boolean): Luxon {
        const currentDate = this.clone();
        if (excludeStartDate) {
            currentDate.add(1, "day");
        }
        while (!currentDate.isSameDate(day)) {
            if (func == "-") {
                currentDate.subtract(1, "day");
            } else {
                currentDate.add(1, "day");
            }
        }
        return currentDate;
    }

    closeWeekday(day: number, func: "+" | "-", excludeStartDate?: boolean): Luxon {
        const currentDate = this.clone();
        if (excludeStartDate) {
            if (func == "-") {
                currentDate.subtract(1, "day");
            } else {
                currentDate.add(1, "day");
            }
        }
        while (!(currentDate.weekDay() === day)) {
            if (func == "-") {
                currentDate.subtract(1, "day");
            } else {
                currentDate.add(1, "day");
            }
        }
        return currentDate;
    }

    getYearlyDaysRatio(endDate: Luxon): { days: number; maxDays: number }[] {
        const e = endDate.startOfDay();

        const currentDate = this.clone().startOfDay();
        const diff = e.startOf("year").diff(currentDate.startOf("year"), "years").years;

        const arr: { days: number; maxDays: number }[] = [];
        for (let i = 0; i <= diff; i++) {
            const maxDays = currentDate.isLeapYear() ? 366 : 365;
            let days = 0;
            if (i === 0) {
                const min = Math.min(currentDate.endOf("year").startOfDay().dateTime.toMillis(), e.dateTime.toMillis());
                days = luxon(min).diff(currentDate, "days").days + 1;
            } else if (i === diff) {
                days = luxon(e.dateTime.toMillis()).diff(currentDate, "days").days + 1;
            } else {
                days = maxDays;
            }
            arr.push({
                days,
                maxDays,
            });
            currentDate.add(1, "year").setMonth(1).setDay(1);
        }

        return arr;
    }

    p(t?: boolean): string {
        return this.dateTime.setZone("Asia/Seoul").toFormat(`yyyy.LL.dd${t ? " HH:mm:ss" : ""}`);
    }

    clone(): Luxon {
        return luxon(this.toJSDate());
    }
}

const luxon = (obj?: number | Date | DateTime | string | Luxon | { toDate: () => Date } | null, format?: string): Luxon => {
    return new Luxon(obj, format);
};

export {Luxon,luxon}
