"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";

import {
	Form,
	FormField,
	FormItem,
	FormControl,
	FormMessage,
} from "../../../components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { createRescue } from "@/app/(home)/actions/createRescue";
import { toast } from "sonner";
import { NumericFormat, PatternFormat } from "react-number-format";

const formSchema = z.object({
	street: z.string().min(1, "Nome da rua é obrigatório"),
	number: z.string().min(1, "Número da casa é obrigatório"),
	district: z.string().min(1, "Bairro é obrigatório"),
	referencePoint: z.string().min(0),
	city: z.string().min(1, "Cidade é obrigatória"),
	peopleQuantity: z
		.string()
		.min(1, "Número de pessoas é obrigatório")
		.regex(/^[1-9]\d*$/, "Digite apenas números"),
	note: z.string().min(0),
	phoneNumber: z
		.string()
		.min(1, "Número de telefone é obrigatório")
		.max(15, "Você ultrapassou o limite de 15 caracteres")
		.regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Preencha todos os números")
		.transform((str) => str.replace(/\D/g, "")),
});

export function HelpForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			street: "",
			number: "",
			district: "",
			referencePoint: "",
			phoneNumber: "",
			city: "",
			peopleQuantity: "",
			note: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const result = await createRescue(data);

		if (result) {
			form.reset();

			toast.success("Seu pedido de resgate foi registrado com sucesso!", {
				position: "top-center",
				duration: 3500,
			});
		} else {
			toast.error("Falha ao criar pedido de resgate. Tente novamente.", {
				position: "top-center",
				duration: 3500,
			});
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="bg-muted flex flex-col gap-6 rounded-lg p-3"
			>
				<div className="flex flex-col gap-2">
					<h2 className="font-medium">Endereço de resgate</h2>

					<fieldset className="grid grid-cols-1 gap-3 lg:grid-cols-2">
						<FormField
							control={form.control}
							name="street"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="text"
											placeholder="Nome da rua"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="number"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="text"
											placeholder="Número da casa"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="district"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input type="text" placeholder="Bairro" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="referencePoint"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="text"
											placeholder="Ponto de referência"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}

							name="phoneNumber"
							render={({ field: { onChange, name, value,ref,onBlur }}) => (
								<FormItem>
									<FormControl>
										<PatternFormat
											format="(##) #####-####"
											getInputRef={ref}
											onChange={onChange}
											name={name}
											value={value}
											onBlur={onBlur}
											autoComplete="tel-national"
											defaultValue={""}
											customInput={Input}
											placeholder="(99) 99999-9999"
										/>

									</FormControl>
									<FormMessage />

								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="city"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="text"
											placeholder="Cidade"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</fieldset>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="font-medium">Quantidade de pessoas</h2>

					<fieldset>
						<FormField
							control={form.control}
							name="peopleQuantity"
							render={({ field: { onChange, name, value,ref,onBlur }}) => (
								<FormItem>
									<FormControl>
										<NumericFormat
											onChange={onChange}
											name={name}
											value={value}
											getInputRef={ref}
											onBlur={onBlur}
											allowNegative={false} // Impede números negativos
											decimalScale={0} // Impede decimais
											thousandSeparator={false} // Não separa milhares
											defaultValue={""}
											customInput={Input}
											type="tel"
											placeholder="Quantidade de pessoas"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</fieldset>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="font-medium">Observações</h2>

					<fieldset>
						<FormField
							control={form.control}
							name="note"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											placeholder="Digite uma observação (se houver)"
											className='h-[200px] resize-none'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</fieldset>
				</div>

				<Button type="submit" disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting ? (
						<>
							<Loader2Icon className="h-4 w-4 mr-1 animate-spin" />
							Aguarde...
						</>
					) : (
						<>
							Pedir resgate
						</>
					)}
				</Button>
			</form>
		</Form>
	);
}
