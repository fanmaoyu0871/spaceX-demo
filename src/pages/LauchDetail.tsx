import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RootStackScreenProps} from '../../navigation-types';
import {useEffect, useState} from "react";
import {IListItem} from '../interfaces/ILauch';
import {css} from "../../css";
import {toLauchItem} from "../../utils/resp2model";
import moment from "moment/moment";

export default function LauchDetail({navigation, route}:RootStackScreenProps<'LauchDetail'>) {

    // 设置导航栏标题
    const route_params = route["params"];
    navigation.setOptions({title:route_params["title"]});

    const [detailData, setDetailData] = useState<IListItem>({id:route_params["id"]})

    useEffect(()=>{
        reqData()
    }, [])

    // 请求详情
    const reqData = async () => {
        try {
            const url = `https://api.spacexdata.com/v5/launches/${route_params["id"]}`;
            const response = await fetch(url);
            const data = await response.json();
            setDetailData(toLauchItem(data));
        } catch (error) {
            console.error(error);
        } finally {

        }
    };

    return (
        <View style={styles.container}>
            <View style={{backgroundColor:'black'}}>
                <Image
                    style={{ width: '100%', height: 300 }}
                    source={{ uri: detailData.image_url }}
                    resizeMode="cover"
                />
                <Text style={{color:'gray', fontSize:10, marginTop:20}}>{moment(detailData.launch_date_unix!*1000).format("YYYY-MM-DD")}</Text>
                <Text style={{color:'white', fontWeight:'bold', fontSize:20}}>{detailData.name}</Text>
                <Text style={{color:'white', marginTop:20, lineHeight:18, fontSize:12}}>{detailData.details}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding:20
    },
});
