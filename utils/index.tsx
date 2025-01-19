import axios from "axios";

export async function saveExam(payload: any) {
    return await axios.post('/api/insertExam', payload)
}

export async function savePatient(payload: any) {
    return await axios.post('/api/insertPatient', payload)
}

export function validateText(text, fallback = '-') {
    return text && text.trim() ? text.trim() : fallback;
}

export function validateAndFormatDate(dateInput, locale = 'el-GR', fallback = '-') {
    try {
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) {
            return fallback;
        }
        return date.toLocaleDateString(locale);
    } catch {
        return fallback;
    }
}
