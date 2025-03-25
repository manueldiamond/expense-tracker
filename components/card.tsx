import { ReactNode } from 'react';
import { View, Text } from 'react-native'
type CardProps = {
  children: ReactNode;
  className?: string;
  label?: string;
}
const Card = ({ children, className, label }: CardProps) => (
  <View className={`${className} bg-paleblue p-6 rounded-2xl`}>
    {label && <Text className='p-0 m-0 text-muted-2'>{label}</Text>}
    {children}
  </View>
)

export default Card
