import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RootStackScreenProps} from '../../navigation-types';
import {useEffect, useState} from "react";
import {ILauchFilterModalProp} from '../interfaces/ILauch';
import {css} from "../../css";
import {Button, Modal, RadioButton} from "react-native-paper";
import {DatePickerModal} from "react-native-paper-dates";
import {CalendarDate} from "react-native-paper-dates/lib/typescript/Date/Calendar";




export default function LauchFilterModal(props:ILauchFilterModalProp){

    const [radioValue, setRadioValue] = useState("");
    const [startDate, setStartDate] = useState<CalendarDate>(undefined);
    const [startDateOpen, setStartDateOpen] = useState(false);
    const [endDate, setEndDate] = useState<CalendarDate>(undefined);
    const [endDateOpen, setEndDateOpen] = useState(false);


    const containerStyle = {backgroundColor: 'white', padding: 20, margin:20};

    return (
        <Modal visible={props.visiable} onDismiss={props.dismiss}  contentContainerStyle={containerStyle}>
            <Text style={{marginTop:10}}>开始发射时间</Text>
            <Button style={{marginTop:10}} onPress={() => setStartDateOpen(true)} mode="outlined">
                {startDate?startDate.toLocaleDateString():'选择开始发射时间'}
            </Button>
            <DatePickerModal
                locale="en"
                mode="single"
                visible={startDateOpen}
                onDismiss={()=>setStartDateOpen(false)}
                date={startDate}
                onConfirm={({date})=>{
                    setStartDate(date);
                    setStartDateOpen(false);
                }}
            />
            <Text style={{marginTop:10}}>结束发射时间</Text>

            <Button style={{marginTop:10}} onPress={() => setEndDateOpen(true)} mode="outlined">
                {endDate?endDate.toLocaleDateString():'选择结束发射时间'}
            </Button>

            <DatePickerModal
                locale="en"
                mode="single"
                visible={endDateOpen}
                onDismiss={()=>setEndDateOpen(false)}
                date={endDate}
                onConfirm={({date})=>{
                    setEndDate(date);
                    setEndDateOpen(false);
                }}
            />
            <Text style={{marginTop:10}}>发射状态</Text>
            <RadioButton.Group onValueChange={newValue => setRadioValue(newValue)} value={radioValue}>
                <View style={[css.flex_row, css.flex_ver_center]}>
                    <View style={[css.flex_row, css.flex_center]}>
                        <Text>全部</Text>
                        <RadioButton value="" />
                    </View>
                    <View style={[css.flex_row, css.flex_center]}>
                        <Text>成功</Text>
                        <RadioButton value="1" />
                    </View>
                    <View style={[css.flex_row, css.flex_center]}>
                        <Text>失败</Text>
                        <RadioButton value="2" />
                    </View>
                </View>
            </RadioButton.Group>

            <Button style={{marginTop:20}}
                    onPress={()=>{
                        props.commitAction({startDate, endDate, radioValue});
                        props.dismiss();
                    }}
                    mode="contained">确认</Button>
        </Modal>
    );
}