import {IListItem} from "../src/interfaces/ILauch";

export const toLauchItem = (item:any)=>{
    let obj:IListItem = {id: item["id"]};
    obj.name = item["name"];
    obj.launch_date_unix = item["date_unix"];
    obj.launch_success = item["success"];
    obj.details = item["details"];
    if(item["links"]){
        if(item["links"]["flickr"] && item["links"]["flickr"]["original"]){
            const original = item["links"]["flickr"]["original"];
            obj.image_url = original.length > 0? original[0]:"";
        }

        obj.article_url = item["links"]["article"]?item["links"]["article"]:'';
        obj.video_url = item["links"]["video_link"]?item["links"]["video_link"]:'';
    }

    return obj
}

export const toLauchItemArray = (newData:any)=>{
    const list:[] = newData["docs"];
    let data_list:Array<IListItem> = [];
    list.forEach((item:any)=>{
        let obj = toLauchItem(item);
        data_list.push(obj);
    })

    return data_list;
}
