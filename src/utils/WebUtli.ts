export function validateIpAndPort(input: string) {
    var parts = input.split(":");
    var ip = parts[0].split(".");
    var port = parts[1];
    return validateNum(port, 1, 65535) &&
        ip.length == 4 &&
        ip.every(function (segment) {
            return validateNum(segment, 0, 255);
        });
}

function validateNum(input: string, min: number, max: number) {
    var num = +input;
    return num >= min && num <= max && input === num.toString();
}