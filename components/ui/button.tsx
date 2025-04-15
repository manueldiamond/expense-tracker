import { ReactChildren } from "@/types";
import { Text, TouchableOpacity } from "react-native";

export const MainButton = ({ textClassName, children, className, text, onPress }: { textClassName?: string; text?: string; onPress: () => void } & ReactChildren) => (
	<TouchableOpacity className={`${className} overflow-hidden bg-accent relative items-center justify-center rounded-[28px] px-6 py-6 `} onPress={onPress}>
		{/*
          <LinearGradient
            colors={[colors.accent, colors["accent-dark"]]}
            start={[0.5, 0.2]} end={[1.0, 1.0]}
            className=" absolute left-0 top-0 flex-1"
          />
          */}
		<Text className={`text-xl text-white font-medium ${textClassName}`}>{text}{children}</Text>
	</TouchableOpacity>

)
