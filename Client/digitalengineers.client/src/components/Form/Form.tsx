import { yupResolver } from '@hookform/resolvers/yup';
import { Form as BSForm } from 'react-bootstrap';
import { useForm, FormProvider, type DefaultValues,type FieldValues,type SubmitHandler, type UseFormReturn } from 'react-hook-form';
import {type CSSProperties, type ReactNode, useEffect } from 'react';
import { ObjectSchema } from 'yup';

type FormProps<TFormValues extends FieldValues> = {
	id?: string;
	name?: string;
	schema?: ObjectSchema<TFormValues>;
	onSubmit: SubmitHandler<TFormValues>;
	children: ReactNode;
	defaultValues?: DefaultValues<TFormValues>;
	className?: string;
	initCallback?: (methods: UseFormReturn<TFormValues>) => void;
	styles?: CSSProperties;
};

const Form = <TFormValues extends Record<string, any> = Record<string, any>>({
	schema,
	onSubmit,
	children,
	defaultValues,
	initCallback,
	...props
}: FormProps<TFormValues>) => {
	const methods = useForm<TFormValues>({
		resolver: schema != null ? yupResolver(schema) : undefined,
		defaultValues,
		mode: 'onChange',
	});

	useEffect(() => {
		if (initCallback) {
			initCallback(methods);
		}
	}, []);

	return (
		<FormProvider {...methods}>
			<BSForm onSubmit={methods.handleSubmit(onSubmit)} {...props}>
				{children}
			</BSForm>
		</FormProvider>
	);
};

export default Form;
