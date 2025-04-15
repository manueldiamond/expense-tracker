import { useHandleBack, useObjectState } from "@/hooks";
import { ExternalState, Option } from "@/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ViewSlot } from "expo-router/build/ui/common";
import React, { cloneElement, ReactNode, useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Modal, BackHandler, ScrollView, TouchableWithoutFeedback, LayoutChangeEvent, Dimensions, StyleProp, ViewStyle } from 'react-native'
import Animated, { FadeInUp, FadeOutDown, measure, ZoomOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { InnerScreen } from "react-native-screens";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";


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


	const [dropViewStyle, setDropViewStyle] = useObjectState<ViewStyle>({})
	const onDropViewLayout = (event: LayoutChangeEvent) => {
		const screenHeight = Dimensions.get('window').height
		event.target.measure((x, y, w, h, pageX, pageY) => {
			const maxHeight = 0.9 * screenHeight
			const height = Math.min(h, maxHeight)
			const bottomHdiff = screenHeight - (pageY + height + 40)
			console.log(bottomHdiff)

			if (!dropViewStyle.maxHeight)
				setDropViewStyle({
					maxHeight,
					top: Math.min(0, bottomHdiff)
				});


		})
	}

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
					<View className="elevation-[99990] z-[9999] absolute top-[-100vh] left-[-100vw] w-[300vw] h-[300vw] " />
				</TouchableWithoutFeedback>

				<Animated.View
					exiting={FadeOutDown}
					style={{ zIndex: 99999999999, elevation: 9999999999 }}
				>
					<ScrollView
						onLayout={onDropViewLayout}
						style={{
							zIndex: 99999,
							elevation: 99999,
							shadowColor: '#000',
							...dropViewStyle
						}}
						className="border-muted-2 border border-t-[none] min-w-max w-full absolute drop-shadow-xl shadow-black shadow-xl bg-white rounded-2xl overflow-hidden p-2">
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
				</Animated.View>
			</>}
		</View >
	)
}


export default Select
