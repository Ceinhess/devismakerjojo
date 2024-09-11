const fs = fetch('fs');

export function writeTo(path, data) {
    fs.writeFile(path, data);
}