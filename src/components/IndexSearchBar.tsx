import {StyleSheet, View} from 'react-native';
import {useState} from "react";
import {IIndexSearchBarProp} from '../interfaces/ILauch';
import {css} from "../../css";
import {Divider, IconButton, Menu, Searchbar} from "react-native-paper";


export default function IndexSearchBar(props:IIndexSearchBarProp){

    let sortType = "desc";
    const [searchKey, setSearchKey] = useState<string>('');
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <View>
            <View style={[styles.searchBar, css.flex_row, css.flex_ver_center]}>
                <IconButton size={20}  icon="filter" onPress={props.filterBtnAction} />

                <Searchbar
                    style={[css.flex_1]}
                    onChangeText={(text)=>setSearchKey(text)}
                    onSubmitEditing={(event)=>{
                        props.searchAction({searchKey, sortType})
                    }}
                    value={searchKey}
                />

                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<IconButton size={20}  icon="sort" onPress={() => openMenu()} />}>
                    <Menu.Item onPress={() => {
                        // page = 1;
                        // setIsLoadMore(true);
                        sortType = "desc";
                        props.searchAction({searchKey, sortType});
                        closeMenu();

                    }} title="发射时间由近到远" />
                    <Divider />
                    <Menu.Item onPress={() => {

                        sortType = "asc";
                        props.searchAction({searchKey, sortType});
                        closeMenu();
                    }} title="发射时间由远到近" />
                </Menu>
            </View>
            <Divider style={{marginTop:10}} />
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

});