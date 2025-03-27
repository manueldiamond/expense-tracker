import { useHandleBack } from "@/hooks";
import { ExternalState, Option } from "@/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { cloneElement, ReactNode, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, BackHandler, ScrollView, TouchableWithoutFeedback } from 'react-native'


type SelectProps<T = any> = {
	items: Option<T>[],
	state: ExternalState<T>,
	formatValue?: (val: any) => ReactNode
	valueClassName?: string;
	optionClassName?: string;
	iconSize?: number;
}

//Custom drodown select component
const Select = ({ iconSize = 12, items, state, valueClassName, optionClassName }: SelectProps) => {
	//useState is called externally, the full use state return array is passed and desctuctured for internal use
	const [value, setValue] = state;

	const [opened, setOpened] = useState(false);

	//const toggleOpened = () => setOpened(prev => !prev)
	const open = () => setOpened(true)
	const close = () => setOpened(false)

	useHandleBack(close);

	return (
		<View className="">
			<TouchableOpacity onPress={open}>
				<View className="flex-row gap-1 justify-center items-center ">
					<View className="flex-1">
						<Text className={valueClassName}>{items.find(item => item.value === value)?.label}</Text>
					</View>
					<FontAwesome name="chevron-down" size={iconSize} />
				</View>
			</TouchableOpacity >

			{opened && <>
				<TouchableWithoutFeedback
					onPress={close}
				>
					<View className="absolute top-[-100vh] left-[-100vw] w-[300vw] h-[300vw] " />
				</TouchableWithoutFeedback>

				<ScrollView
					style={{
						maxHeight: 'auto',
						zIndex: 99999,
						elevation: 99999,
						shadowColor: '#000'
					}}
					className="border-muted-2 border border-t-[none] min-w-max w-full absolute drop-shadow-xl shadow-black shadow-xl bg-white rounded-2xl overflow-visible p-2">
					{items.map(opt =>
						<TouchableOpacity
							key={opt.value}
							onPress={() => {
								setValue(opt.value)
								close()
							}}
							className={`
								last:border-b-[0px] 
								border-b-muted-2 border-b p-2 
								hover:bg-accent
								${opt.value === value && 'bg-accent/10 rounded-xl'}
							`}
						>
							<Text className={optionClassName}>{opt.label}</Text>
						</TouchableOpacity>
					)}
				</ScrollView>
			</>}
		</View >
	)
}


export default Select
