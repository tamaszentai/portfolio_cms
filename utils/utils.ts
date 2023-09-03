export const formattedSize = (size: number): string => {
    if (size >= 1048576) {
        // If file size is greater than or equal to 1 MB, convert to MB
        return (size / 1048576).toFixed(2) + " MB";
    } else {
        // If file size is less than 1 MB, convert to KB
        return (size / 1024).toFixed(2) + " KB";
    }
}

export const timestampToDate = (option: string, data: Record<string, any>): string | null => {
    if (!data[option]) return null;
    return new Date(data[option].seconds * 1000 + data[option] / 1000000).toLocaleString();
}