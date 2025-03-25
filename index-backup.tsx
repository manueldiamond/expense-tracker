import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useState } from 'react';
import { Button, KeyboardAvoidingView, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'

type StatsCardProps = {
  amount: number;
  title: string;
  circleColor: `#${string}`;
}
const StatCard = ({ amount, title, circleColor, }: StatsCardProps) => {
  return (
    <View className='flex-1 bg-white gap-2.5 rounded-2xl px-[12px]  py-[12px]'>
      <View className='items-center gap-[5px] flex-row '>
        <View style={{ backgroundColor: circleColor }} className={` rounded-full size-5 `} />
        <Text className='text-[13px] font-light'>{title}</Text>
      </View>
      <Text className='text-[25px] font-semibold'>GH₵ {amount}</Text>
      <Text className='py-1 px-2 font-extralight bg-green-light text-[10px] rounded-full'>+20% more than yesterday</Text>
    </View>
  )
}
type RecordProps = {
  amount: number,
  income?: boolean,
  title: string;
  time: string;
}


const Record = ({ amount, income, title, time, }: RecordProps) => {

  return (
    <View className='flex-row gap flex justify-between items-center w-full bg-white rounded-[8px] px-3 py-2.5'>
      <View className='gap-[15px] items-center flex-row flex'>
        <View className='bg-black p-[8px] rounded-full justify-center items-center'>
          <FontAwesome name='money' color={'#FFDDAB'} size={32} />
        </View>

        <View className='gap-[5px]'>
          <Text className='text-[12px] font-light' numberOfLines={1}>{title}</Text>
          <Text className='text-[16px] font-semibold'>{income ? '+' : '-'} GH₵ {amount.toFixed(2)}</Text>
        </View>

      </View>
      <View className='items-center '>
        <Text className='text-[12px] h-[22px] font-light'>{time}</Text>
        {income ?
          <View className='px-2 gap-1 flex-row items-center justify-center rounded-full text-green-dark bg-green-light'>
            <Text className='text-[10px] font-bold'>income</Text>
            <FontAwesome name='arrow-circle-up' className='#235411' size={16} />
          </View>
          :
          <View className='px-2 py-1 gap-1 flex-row items-center justify-center rounded-full text-red-dark bg-red-light'>
            <Text className='text-[10px] font-bold'>expense</Text>
            <FontAwesome name='arrow-circle-down' className='#541111' size={16} />
          </View>
        }
      </View>
    </View>
  )
}


const dateToTimeString = (date: Date) => date.toLocaleTimeString('en-US', { hour12: true, timeStyle: 'short' })

const AddNew = () => {
  const [formModalVisible, setFormModalVisible] = useState(false)
  const time = dateToTimeString(new Date())
  const closeModal = () => setFormModalVisible(false)

  const [formData, setFormData] = useState()

  return (
    <>
      <Modal
        transparent
        animationType='fade'
        statusBarTranslucent
        onRequestClose={closeModal}
        visible={formModalVisible}
        className='bg-black backdropw-blur'
      >
        <Pressable onPress={closeModal}>
          <BlurView
            intensity={10}
            experimentalBlurMethod='dimezisBlurView'
            className='absolute bg-black top-0 left-0 flex w-screen h-screen'
          >
            <LinearGradient colors={['#00000000', '#000000ff']} className='flex-1 opacity-50 ' />
          </BlurView>
        </Pressable>
        <KeyboardAvoidingView className='h-full w-[95%] mx-auto justify-end'>
          <View className='px-5 py-6 bg-pale rounded-t-[28px] relative overflow-hidden'>
            {/*Header*/}
            <LinearGradient
              colors={['#F1EEFF', '#FFFFFF']}
              className='flex-1 w-screen h-full absolute top-0 left-0'
            />

            <View className='flex-row justify-between items-center h-[53px]'>
              <TouchableOpacity onPress={() => setFormModalVisible(false)}>

                <View className='flex-row gap-.5 justify-center items-center'>

                  <FontAwesome name='close' />
                  <Text className='font-medium'> Close </Text>
                </View>
              </TouchableOpacity>
              <View className='items-center gap-0 absolute top-0 left-1/2 -translate-x-1/2'>
                <Text className='font-light text-[12px]'>{time}</Text>
                <Text className='font-medium text-[18px]'>New Record</Text>
              </View>
              <TouchableOpacity>
                <Text className='font-medium'>Save</Text>
              </TouchableOpacity>
            </View>
            <Button title='Save' color='#000' />
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <LinearGradient
        colors={['#F8F9FF00', '#F8F9FF']}
        end={{ x: .5, y: 0.9 }}
        className='bottom-0 z-10 w-full h-[20vh] absolute'
      />
      <View className='absolute z-50 bottom-[32px] w-full items-center justify-center'>
        <TouchableOpacity onPress={() => setFormModalVisible(true)}>
          <View
            className='bg-white shadow-[0px_8px_20px_#B5B3C1] rounded-full flex items-center justify-center size-[80px] overflow-hidden border-solid border-2 border-[#f1eeff]'
          >
            <LinearGradient
              colors={['#f1eeff', '#fff']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 1.0, y: 1.0 }}
              className='absolute left-0 top-0 z-[-1] w-full h-full'
            />
            <Text className='text-[28px] size-max font-normal'>+</Text>
          </View>
        </TouchableOpacity >
      </View >
    </>
  )
}

const Records = () => {
  return (
    <View className='gap-3'>
      <Record title='Description/Category' amount={685.50} income time='8:00 AM' />
      <Record title='Description/Category' amount={685.50} income time='8:00 AM' />
      <Record title='Description/Category' amount={685.50} time='10:00 AM' />
      <Record title='Description/Category' amount={685.50} income time='8:00 AM' />
      <Record title='Description/Category' amount={685.50} time='10:00 AM' />
      <Record title='Description/Category' amount={685.50} income time='8:00 AM' />
      <Record title='Description/Category' amount={685.50} time='10:00 AM' />
    </View>
  )
}
export default function Index() {
  const inspiration = "Keep up the grind!!"
  return (
    <View>
      <AddNew />
      <ScrollView>
        <View className="text-white w-full min-h-full items-center bg-pale px-5 pb-32">
          <View className='flex-row flex gap-2.5 mt-[18px] w-full'>
            <StatCard title='Income' amount={999} circleColor='#D4CEF0' />
            <StatCard title='Expenses' amount={200} circleColor='#FFF0E9' />
          </View>
          <View className='h-[22px] justify-center items-center'>
            <Text className='text-center text-[11px] font-light italic'>{inspiration}</Text>
          </View>
          <View className=' w-full items-center py-6 pb-4 flex-row justify-between'>
            <Text className='text-[18px] font-medium'>Records</Text>
            <View className='gap-1.5 flex-row items-center justify-center'>
              <Text className='text-[13px]'>See All</Text>
              <FontAwesome name='long-arrow-right' />
            </View>
          </View>
          <Records />
        </View>
      </ScrollView >
    </View>
  );
}
