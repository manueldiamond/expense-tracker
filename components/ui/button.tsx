import { colors } from "@/data";
import { ReactChildren } from "@/types";
import { Text, TouchableOpacity } from "react-native";
import tw from 'twrnc'

export const MainButton = ({ textClassName, children, className, text, onPress, ghost }: { ghost?: boolean, textClassName?: string; text?: string; onPress: () => void } & ReactChildren) => (
        <TouchableOpacity
                className={`${className}`}
                style={tw`relative items-center justify-center rounded-[24px] px-6 py-6 bg-[${colors[ghost ? 'muted-2' : 'accent']}] `}
                onPress={onPress}
        >
                {/*
          <LinearGradient
            colors={[colors.accent, colors["accent-dark"]]}
            start={[0.5, 0.2]} end={[1.0, 1.0]}
            className=" absolute left-0 top-0 flex-1"
          />
          */}
                <Text
                        style={tw`text-white text-xl font-medium`}
                        className={`${textClassName}`}
                >
                        {text}{children}</Text>
        </TouchableOpacity>

)
