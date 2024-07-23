
export function isValidHexColor(color: string): boolean {
    // Regular expression to match valid hex color codes
    const hexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
    return hexColorRegex.test(color);
}