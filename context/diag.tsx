"use client"

//import { useHandleBack } from "@/hooks";
//import { ReactChildren } from "@/types";
//import { MaterialCommunityIcons } from "@expo/vector-icons";
//import { weeksToDays } from "date-fns";
//import { usePathname } from "expo-router";
//import { createContext, MouseEventHandler, ReactNode, useContext, useEffect, useId, useRef, useState } from "react";
//import { Text, TouchableOpacity, View } from "react-native";
//import Animated, { FadeIn, FadeInUp, FadeOut, FadeOutDown, withSequence } from "react-native-reanimated";
//
//
//export const ModalHeading = ({ children }: { children: ReactNode }) =>
//	<Text className="text-2xl centered flex-1 opacity-80 font-extrabold text-2d">{children}</Text>
//
////Popup modal component 
//export const Modal = ({ children, open = false, close, className }: {
//	heading?: string; // heading of the modal
//	open: boolean
//	close?: () => void
//} & ReactChildren) => {
//
//	const onBgClicked = () => close && close();
//
//	useHandleBack(onBgClicked);
//
//	return (
//		<SafeAreaContext className="fixed top-0 left-0 w-full">
//			<Animated.View
//				entering={FadeIn}
//				exiting={FadeOut}
//
//				className=" overflow-y-scroll fixed top-0 left-0 from-dark/25 backdrop-blur to-dark/90 bg-gradient-to-b w-screen h-screen flex z-[50] elevation-[999]"
//			/>
//			<Animated.View className="flex-1 w-full h-full min-h-max  pb-10 container centered py-5 mx-auto ">
//				<Animated.View
//					entering={FadeInUp}
//					exiting={FadeOutDown}
//					className={`bg-white max-w-full relative flex flex-col gap-2 w-max h-max p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl ${className}`}
//				>
//					{close &&
//						<TouchableOpacity onPress={close} className={`z-[3] absolute top-3 right-3 centered aspect-square p-2 hover:bg-dark/20 rounded-full`}>
//							<MaterialCommunityIcons name="close" size={20} />
//						</TouchableOpacity>
//					}
//					{children}
//				</Animated.View>
//			</Animated.View>
//		</View>
//	)
//}
//
//
//
//type ButtonStyles = 'primary' | 'ghost'
//type DiagButton<T = string> = { text: T, style: ButtonStyles, };
//
//type OpenDiagType = <T>(
//	options: Partial<{
//		content: ReactNode | ((respond: (response: any) => void) => ReactNode),
//		buttons: DiagButton<T>[],
//		heading: string,
//		className: string,
//		closable: boolean,
//	}>,
//	tag?: string
//) => Promise<T>
//
//const diagCtx = createContext<null | {
//	openDiag: OpenDiagType
//	diagActive: (key?: string) => boolean
//}>(null);
//
//export const diagButton = <T extends string>(text: T, style: ButtonStyles = 'ghost'): DiagButton<T> => ({ text, style })
//
//const buttonClassNames: Record<ButtonStyles, string> = {
//	'primary': 'btn-primary',
//	'ghost': 'btn-ghost',
//}
//type Diag = {
//	content?: ReactNode;
//	buttons?: DiagButton[],
//	heading?: string,
//	respond: (res: any) => void,
//	tag: string
//	className?: string
//	close: undefined | (() => void);
//}
//
//export const DiagProvider = ({ children }: { children: ReactNode }) => {
//	const [diags, setDiags] = useState<Record<string, Diag | undefined>>({});
//	const removeDiag = (tag: string) =>
//		setDiags(prevDiags => ({
//			...prevDiags,
//			[tag]: undefined
//		}));
//
//	const path = usePathname()
//
//	useEffect(() => {
//		setDiags({})
//	}, [path])
//	const openDiag: OpenDiagType = ({ className, content, buttons, heading, closable }, tag = 'default') => new Promise((resolve) => {
//		const respond = (value: any) => {
//			removeDiag(tag);
//			resolve(value);
//			console.log(tag, ' RESOLVED: ', value)
//		}
//
//		setDiags(prev => ({
//			...prev, [tag]: {
//				heading: heading,
//				content: typeof content === 'function' ? content(respond) : content,
//				respond,
//				tag,
//				className,
//				buttons: buttons,
//				close: closable ? () => respond(null) : undefined
//			} as Diag
//		})
//		);
//	})
//
//	const diagActive = (key?: string) =>
//		key ?
//			Object.keys(diags).includes(key) && diags[key]
//			:
//			Object.values(diags).filter(val => val).length > 0
//
//	console.log(diags)
//	return (
//		<diagCtx.Provider value={{ openDiag, diagActive }}>
//			{children}
//			<Animated.View className={"block"}>
//				{Object.values(diags).map(diag => diag &&
//					< Modal className={diag.className} key={diag.tag} open={true} close={diag.close}>
//						<ModalHeading>{diag.heading}</ModalHeading>
//						{diag.content}
//						<div className='flex gap-2'>
//							{diag.buttons?.map(({ style, text }) =>
//								< button
//									key={text}
//									className={`text-sm ${buttonClassNames[style]}`}
//									onClick={() => diag.respond(text)}
//								>{text}</button>)}
//						</div>
//					</Modal >)}
//			</Animated.View>
//		</diagCtx.Provider >
//	)
//}
//
//
//
//
//export const useDiag = () => {
//	const ctx = useContext(diagCtx)
//	if (!ctx) throw new Error("Dialogue context not initialized");
//	return ctx;
//}
//
//export const useOpenDiag = () => useDiag().openDiag;
