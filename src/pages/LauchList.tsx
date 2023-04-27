import {
    StyleSheet,
    Text,
    View,
    FlatList,
    RefreshControl,
    Image,
    ListRenderItemInfo,
    TouchableOpacity
} from 'react-native';
import {RootStackScreenProps} from '../../navigation-types';
import {css} from '../../css';
import {useCallback, useEffect, useRef, useState} from "react";
import {ActivityIndicator, Menu, Divider, RadioButton, Modal, IconButton, Searchbar, Button} from "react-native-paper";
import {StatusBar} from "expo-status-bar";
import {ICommitActionPrams, IListItem} from '../interfaces/ILauch';
import moment from "moment";
import LauchFilterModal from "../components/LauchFilterModal";
import IndexSearchBar from "../components/IndexSearchBar";
import {toLauchItem, toLauchItemArray} from "../../utils/resp2model";


export default function LauchList({navigation, route}:RootStackScreenProps<'LauchList'>) {

    let limit = 12;
    let page = 1;

    const flatlistRef = useRef<FlatList>(null);
    const [data, setData] = useState<Array<IListItem>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showModel, setShowModel] = useState(false);

    // 加载数据
    const loadMoreData = async (inParams:ICommitActionPrams) => {

        console.log("请求。。")
        if (isLoading) return;
        console.log("发送请求。。。。")
        setIsLoading(true);

        let params:any = {
            query:{
                "links.flickr.original":{ "$ne":null, "$not": {"$size": 0}},
            },
            options: {
                limit:limit,
                page:page,
                sort:{"date_unix":inParams.sortType || "desc"}
            }
        }

        // 关键词搜索，目前只搜索名字
        if(inParams.searchKey){
            params.query["name"] = {
                "$regex": inParams.searchKey,
                "$options":"$i"
            }
        }

        // 发射开始时间
        if(inParams.startDate){
            params.query["date_unix"] = {
                "$gte": moment(inParams.startDate).unix()
            }
        }

        // 发射结束时间
        if(inParams.endDate){
            params.query["date_unix"] = {
                "$lte":moment(inParams.endDate).unix()
            }
        }

        // 是否发射成功
        if(inParams.radioValue != "" && inParams.radioValue != undefined){
            params.query["success"] = inParams.radioValue=="1"?true:false;
        }

        console.log("请求参数====", params);

        try {
            const url = "https://api.spacexdata.com/v5/launches/query";
            const response = await fetch(url, {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(params)
            });
            const result = await response.json();
            const newData = toLauchItemArray(result);

            // console.log(newData);

            setIsLoadMore((newData.length < limit && newData.length != 0)? false : true);

            if(page == 1){
                setData([...newData]);
            }else{
                setData([...data, ...newData]);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        loadMoreData({});
    }, []);


    // 列表 item
    const renderItem = ({item}:ListRenderItemInfo<IListItem>) => {
        return (
            <View style={styles.itemContainer}>
                {/*react-native-fast-image expo not supported*/}
                {/*看了感觉效果还行*/}
                <Image style={{ width: '100%', height: 300 }} source={{ uri: item.image_url }} resizeMode="cover"/>
                <Text style={styles.itemDate}>{moment(item.launch_date_unix!*1000).format("YYYY-MM-DD")}</Text>
                <Text style={styles.itemName}>{item.name}</Text>

                <TouchableOpacity activeOpacity={0.7}
                                  onPress={()=>navigation.navigate('LauchDetail', {id:item.id, title:item.name})}
                                  style={[css.flex_center, styles.goBtn]}>
                    <Text  style={styles.goBtnText}>LEARN MORE</Text>
                </TouchableOpacity>
            </View>
        );
    };

    // 滚动到顶部
    const scrollToTop = ()=>{
        flatlistRef.current!.scrollToOffset({ animated: true, offset: 0 })
    };


    return (
        <View style={styles.container}>
            {/*状态栏*/}
            <StatusBar translucent={false} backgroundColor="transparent"></StatusBar>

            {/*搜索头部*/}
            <IndexSearchBar searchAction={(inPrams)=>{
                loadMoreData(inPrams);
                scrollToTop();
            }} filterBtnAction={()=>setShowModel(true)} />

            {/*列表*/}
            <FlatList
                ref={flatlistRef}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()+Math.random()*100}
                removeClippedSubviews={true} // Unmount components when outside of window
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => {
                            page = 1
                            setIsLoadMore(true)
                            loadMoreData({});
                        }}
                    />
                }
                // onEndReachedThreshold={0.5}
                onEndReached={() => {
                    if(isLoadMore){
                        page++;
                        loadMoreData({})
                    }

                }}
                ListFooterComponent={
                    isLoading ? (
                        <ActivityIndicator animating={true} style={{ marginVertical: 10 }} />
                    ) : null
                }
            />

            {/*筛选modal*/}
            <LauchFilterModal  commitAction={(inPrams)=>{loadMoreData(inPrams);scrollToTop();}} dismiss={()=>setShowModel(false)} visiable={showModel}/>

            {/*悬浮按钮*/}
            <IconButton style={styles.upArrow} size={40} icon="arrow-up-circle" onPress={scrollToTop} ></IconButton>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    },
    searchBar:{
        marginTop:10
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
    },

    upArrow:{
        position:'absolute',
        right:0,
        bottom:60
    },

    itemContainer:{
        backgroundColor:'black',
        padding:10
    },

    itemDate:{
        color:'white',
        fontSize:10,
        marginTop:20
    },

    itemName:{
        color:'white',
        fontWeight:'bold',
        fontSize:20
    },

    goBtn:{
        borderWidth:1,
        borderColor:'white',
        width:100,
        height:30,
        marginTop:20
    },

    goBtnText:{
        color:'white',
        fontSize:10
    }
});
