import {useCallback} from 'react';
import InputTypes from "../enums/InputTypes";

function isFieldEmpty(value: unknown, type: string): boolean {
    if (value == null) return true;

    if (type === InputTypes.TOGGLE_BUTTON || type === InputTypes.DROPDOWN_WITH_RADIO) {
        const nested = value as {radio?: string; string?: string};
        return !nested.radio?.trim() && !nested.string?.trim();
    }

    if (typeof value === "string") {
        return !value.trim();
    }

    return false;
}

export const useErrorPayload = (formValues: any, types: any) => {

    const validate = useCallback(() => {
        let newErrors: any = {};
        for (const type of types) {
            if (!type.required && isFieldEmpty(formValues[type.propertyName], type.type)) {
                newErrors[type.propertyName] = false;
                continue;
            }

            const validator = new RegExp(type?.validator);
            if (type.type === InputTypes.TOGGLE_BUTTON || type.type === InputTypes.DROPDOWN_WITH_RADIO) {
                let isNested = false;
                if (type.radios?.validators) {
                    for (const key in type.radios.validators) {
                        if (formValues[type.propertyName].radio === key) {
                            const innerValidator = new RegExp(type.radios.validators[key]);
                            newErrors[type.propertyName] = !innerValidator.test(formValues[type.propertyName].string);
                            isNested = true;
                        }
                    }
                }
                if (!isNested) {
                    newErrors[type.propertyName] = !validator.test(formValues[type.propertyName].string);
                }
            } else {
                newErrors[type.propertyName] = !validator.test(formValues[type.propertyName]);
            }

            if (Boolean(type?.dependsOn)) {
                if (formValues[type.dependsOn.propertyName] === type.dependsOn.value) {
                    newErrors[type.propertyName] = false;
                }
            }
        }

        const hasError = Object.values(newErrors).some(error => error === true);

        return [newErrors, hasError];
    }, [formValues, types]);

    return {validate}
};

