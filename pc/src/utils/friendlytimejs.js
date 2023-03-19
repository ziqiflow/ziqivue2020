
export const FriendlyTime = function(str, now){
    if(!str)return '';
    var currentTime = new Date(now);
    var arr = str.split(/\s+/gi);
    var temp = 0, arr1, arr2, oldTime, delta;
    var getIntValue = function(ss, defaultValue){
        try{
            return parseInt(ss, 10);
        }catch (e){
            return defaultValue;
        }
    };
    var getWidthString = function(num){
        return num < 10 ? ("0" + num) : num;
    };
    if(arr.length >= 2){
        arr1 = arr[0].split(/[\/\-]/gi);
        arr2 = arr[1].split(":");
        oldTime = new Date();
        oldTime.setYear(getIntValue(arr1[0], currentTime.getFullYear()));
        oldTime.setMonth(getIntValue(arr1[1], currentTime.getMonth() + 1) - 1);
        oldTime.setDate(getIntValue(arr1[2], currentTime.getDate()));

        oldTime.setHours(getIntValue(arr2[0], currentTime.getHours()));
        oldTime.setMinutes(getIntValue(arr2[1], currentTime.getMinutes()));
        oldTime.setSeconds(getIntValue(arr2[2], currentTime.getSeconds()));

        delta = currentTime.getTime() - oldTime.getTime();

        if(delta <= 6000){
            return "1分钟内";
        }
        else if(delta < 60 * 60 * 1000){
            return Math.floor(delta / (60 * 1000)) + "分钟前";
        }
        else if(delta < 24 * 60 * 60 * 1000){
            return Math.floor(delta / (60 * 60 * 1000)) + "小时前";
        }
        else if(delta < 3 * 24 * 60 * 60 * 1000){
            return Math.floor(delta / (24 * 60 * 60 * 1000)) + "天前";
        }
        else if(currentTime.getFullYear() != oldTime.getFullYear()){
            return [getWidthString(oldTime.getFullYear()), getWidthString(oldTime.getMonth() + 1), getWidthString(oldTime.getDate())].join("-")
        }
        else{
            return [getWidthString(oldTime.getMonth() + 1), getWidthString(oldTime.getDate())].join("-");
        }
    }
    return "";
}