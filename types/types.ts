export interface InputProps {
    options?: string[] | [];
    property: string;
    handleChange: (val:string, prop: string) => void;
    value?: string | {radio: string; string: string;} | { value: string; units: string;};
    label: string;
    errorMsg?: string;
    validator?: string;
    radios?: any;
    title?: string;
    hasNested?: boolean;
    error: boolean;
    handleError: (val:boolean, prop: string) => void;
    required?: boolean;
    dependsOn?: boolean;
    isDepended?: boolean;
}

export interface FormValuesPatient {
    name: string;
    surname: string;
    patronimo: string;
    amka: string;
    imerominia_katagrafis: Date;
    test: string;
    methodoi_energopoiisis: {
        radio: string;
        string: string;
    }
    xronos_eksetasis: {
        radio: string;
        string: string;
    }
}
