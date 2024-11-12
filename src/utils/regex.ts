export function verifyRegex(value: string, regex: RegExp): boolean {
    if (!regex.test(value)) {
        return true;
    }
    return false;
}