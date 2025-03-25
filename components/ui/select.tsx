import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { cloneElement, ReactNode, useState } from "react";
import { View, Text, TouchableOpacity, Modal } from 'react-native'

type Option = {
	label: ReactNode,
	value: string | number;
}

type SelectProps = {
	items: Option[],
	state: [any, ((val: any) => void)],
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

	return (
		<View>
			<TouchableOpacity onPress={open}>
				<View className="flex-row gap-1 justify-center items-center ">
					<Text className={valueClassName}>{items.find(item => item.value === value)?.label}</Text>
					<FontAwesome name="chevron-down" size={iconSize} />
				</View>
			</TouchableOpacity >

			<Modal visible={opened} transparent={true}>
				<View className="">
					{items.map(opt =>
						<TouchableOpacity
							key={opt.value}
							onPress={() => {
								setValue(opt.value)
								close()
							}}>
							<View className="border-t border-t-pale py-2 " >
								<Text className={optionClassName}>{opt.label}</Text>
							</View>
						</TouchableOpacity>
					)}
				</View>
			</Modal>
		</View>
	)
}


export default Select
