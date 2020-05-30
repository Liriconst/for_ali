import {WrappedFormUtils} from "@ant-design/compatible/lib/form/Form";

export type FormCreateKostyl<T extends React.Component<{form?: WrappedFormUtils}>> = Omit<ExtractProps<T>, 'form'>;
export type ExtractProps<T> = T extends React.Component<infer TProps, any> ? TProps : T;