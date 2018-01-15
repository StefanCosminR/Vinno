var config = {
    apiKey: "AIzaSyD-xBReIsLbsbWy9NtIsnUPxRWiY6OVzOM",
    authDomain: "dawnc-ea146.firebaseapp.com",
    databaseURL: "https://dawnc-ea146.firebaseio.com",
    projectId: "dawnc-ea146",
    storageBucket: "dawnc-ea146.appspot.com",
    messagingSenderId: "731731735733"
};
firebase.initializeApp(config);

var database    = firebase.database();
var storage     = firebase.storage();
var storageRef  = storage.ref();
var auth        = firebase.auth();
var isAnonymous = false;
var uid         = "";

auth.signInAnonymously();
auth.onAuthStateChanged(firebaseUser => {
    if (firebaseUser)
    {
        isAnonymous = firebaseUser.isAnonymous;
        uid         = firebaseUser.uid;
    }
});

let content_titles = [];
let titles   = [];
let websites = [];
let descriptions = [];
let start_times = [];
let end_times = [];
let tags = [];
let images = [];
let music = [];
let coordinates = [];

function readAllAnnotationsFromFirebase()
{
    let annotation_ref = database.ref("annotations/");

    annotation_ref.once('value').then(function(data) {
        let all_objects = data.val();

        if (all_objects)
        {
            let keys = Object.keys(all_objects[uid]);

            for (let i = 0; i < keys.length; i++)
            {
                let this_key = keys[i];

                content_titles.push(all_objects[uid][this_key].content_title);
                titles.push(all_objects[uid][this_key].title);
                websites.push(all_objects[uid][this_key].website);
                start_times.push(all_objects[uid][this_key].start_time);
                end_times.push(all_objects[uid][this_key].end_time);
                tags.push(all_objects[uid][this_key].tags_list);
                descriptions.push(all_objects[uid][this_key].description);
                images.push(all_objects[uid][this_key].images_list);
                music.push(all_objects[uid][this_key].music_list);
                coordinates.push(all_objects[uid][this_key].coordinates);
            }

            // console.log("Content titles: " + content_titles);
            // console.log("Titles: " + titles);
            // console.log("Descriptions: " + descriptions);
            // console.log("Start times: " + start_times);
            // console.log("End times: " + end_times);
            // console.log("Tags: " + tags);
            // console.log("Images: " + images);
            // console.log("Music: " + music);
            // console.log("Websites:" + websites);
        }
    });
}

function exportToCsv()
{
    console.log("Exporting to csv...");

    var csvString = "";
    // var csvString = 'Website, content title, title, description, start time, end time, tags, images, music, cordinates\n';

    for (let i = 0; i < websites.length; i++)
    {
        csvString += websites[i] + ",";
        csvString += content_titles[i] + ",";
        if(titles[i] != undefined)
        {
            csvString += titles[i] + ",";
        }
        else
        {
            csvString += "";
        }
        if(descriptions[i] != undefined)
        {
            csvString += descriptions[i] + ",";
        }
        else
        {
            csvString += "";
        }
        csvString += start_times[i] + ",";
        csvString += end_times[i] + ",";

        //Tags + images + music + coordinates
        if(tags[i] != undefined)
        {
            let tags_list = tags[i];
            for(let j = 0; j < tags_list.length; j++)
            {
                if(j != tags_list.length - 1)
                {
                    csvString += tags_list[j] + ";";
                }
                else
                {
                    csvString += tags_list[j] + ",";
                }
            }
        }
        else
        {
          csvString += "[],";
        }

        if(images[i] != undefined)
        {
            console.log("Images for record " + i +": ");
            let images_list = images[i];
            for(let j = 0; j < images_list.length; j++)
            {
                if(j != images_list.length - 1)
                {
                    csvString += images_list[j] + ";";
                    console.log(images_list[j] + ", ");
                }
                else
                {
                    csvString += images_list[j] + ",";
                    console.log(images_list[j] + ", ");
                }
            }
        }
        else
        {
          csvString += "[],";
        }

        if(music[i] != undefined)
        {
            console.log("Music for record " + i +": ");
            let music_list = music[i];
            for(let j = 0; j < music_list.length; j++)
            {
                if( j != music_list.length - 1)
                {
                    csvString += music_list[j] + ";";
                    console.log(music_list[j] + ", ");
                }
                else {
                    csvString += music_list[j] + ",";
                    console.log(music_list[j] + ", ");
                }
            }
        }
        else
        {
          csvString += "[],";
        }

        if(coordinates[i] != undefined)
        {
            let coordinates_list = coordinates[i];
            console.log("coordinates for record " + i + ": ");
            for(let j = 0; j < coordinates_list.length; j++)
            {
                if(coordinates_list[j] != "")
                {
                    if(j != coordinates_list.length - 1)
                    {
                        csvString += coordinates_list[j] + ";";
                        console.log(coordinates_list[j] + ", ");
                    }
                    else if(i != websites.length - 1)
                    {
                        csvString += coordinates_list[j] + ",";
                        console.log(coordinates_list[j]);
                    }
                    else
                    {
                        csvString += coordinates_list[j];
                    }
                }
                else
                {
                    if(j != coordinates_list.length - 1)
                    {
                        csvString += "47.151726;";
                    }
                    else if(i != websites.length - 1)
                    {
                        csvString += "27.587914,";
                    }
                    else
                    {
                        csvString += "27.587914";
                    }
                }
            }
        }
        else
        {
          csvString += "[0,0]";
        }

        csvString += "\ ";
    }

    var a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
    a.target = '_blank';
    a.download = 'annotations.csv';
    a.click();
}

function exportToJson()
{
    console.log("Exporting to json...");
    //
    // var jsonString = "";
    // // var csvString = 'Website, content title, title, description, start time, end time, tags, images, music, cordinates\n';
    //
    // for (let i = 0; i < websites.length; i++)
    // {
    //     jsonString += websites[i] + ",";
    //     jsonString += content_titles[i] + ",";
    //     if(titles[i] != undefined)
    //     {
    //         jsonString += titles[i] + ",";
    //     }
    //     else
    //     {
    //         jsonString += "";
    //     }
    //     if(descriptions[i] != undefined)
    //     {
    //         jsonString += descriptions[i] + ",";
    //     }
    //     else
    //     {
    //         jsonString += "";
    //     }
    //     jsonString += start_times[i] + ",";
    //     jsonString += end_times[i] + ",";
    //
    //     //Tags + images + music + coordinates
    //     if(tags[i] != undefined)
    //     {
    //         let tags_list = tags[i];
    //         for(let j = 0; j < tags_list.length; j++)
    //         {
    //             if(j != tags_list.length - 1)
    //             {
    //                 jsonString += tags_list[j] + ";";
    //             }
    //             else
    //             {
    //                 jsonString += tags_list[j] + ",";
    //             }
    //         }
    //     }
    //     else
    //     {
    //       jsonString += "[],";
    //     }
    //
    //     if(images[i] != undefined)
    //     {
    //         console.log("Images for record " + i +": ");
    //         let images_list = images[i];
    //         for(let j = 0; j < images_list.length; j++)
    //         {
    //             if(j != images_list.length - 1)
    //             {
    //                 jsonString += images_list[j] + ";";
    //                 console.log(images_list[j] + ", ");
    //             }
    //             else
    //             {
    //                 jsonString += images_list[j] + ",";
    //                 console.log(images_list[j] + ", ");
    //             }
    //         }
    //     }
    //     else
    //     {
    //       jsonString += "[],";
    //     }
    //
    //     if(music[i] != undefined)
    //     {
    //         console.log("Music for record " + i +": ");
    //         let music_list = music[i];
    //         for(let j = 0; j < music_list.length; j++)
    //         {
    //             if( j != music_list.length - 1)
    //             {
    //                 jsonString += music_list[j] + ";";
    //                 console.log(music_list[j] + ", ");
    //             }
    //             else {
    //                 jsonString += music_list[j] + ",";
    //                 console.log(music_list[j] + ", ");
    //             }
    //         }
    //     }
    //     else
    //     {
    //       jsonString += "[],";
    //     }
    //
    //     if(coordinates[i] != undefined)
    //     {
    //         let coordinates_list = coordinates[i];
    //         console.log("coordinates for record " + i + ": ");
    //         for(let j = 0; j < coordinates_list.length; j++)
    //         {
    //             if(coordinates_list[j] != "")
    //             {
    //                 if(j != coordinates_list.length - 1)
    //                 {
    //                     jsonString += coordinates_list[j] + ";";
    //                     console.log(coordinates_list[j] + ", ");
    //                 }
    //                 else if(i != websites.length - 1)
    //                 {
    //                     jsonString += coordinates_list[j] + ",";
    //                     console.log(coordinates_list[j]);
    //                 }
    //                 else
    //                 {
    //                     jsonString += coordinates_list[j];
    //                 }
    //             }
    //             else
    //             {
    //                 if(j != coordinates_list.length - 1)
    //                 {
    //                     jsonString += "47.151726;";
    //                 }
    //                 else if(i != websites.length - 1)
    //                 {
    //                     jsonString += "27.587914,";
    //                 }
    //                 else
    //                 {
    //                     jsonString += "27.587914";
    //                 }
    //             }
    //         }
    //     }
    //     else
    //     {
    //       jsonString += "[0,0]";
    //     }
    //
    // }
    //
    // var a = document.createElement('a');
    // a.href = 'data:text/csv;charset=utf-8,' + encodeURI(jsonString);
    // a.target = '_blank';
    // a.download = 'annotations.json';
    // a.click();
}

function createChildNode(data, tagName)
{
    return "<" + tagName + ">" + data + "</" + tagName + ">\ ";
}

function exportToXml()
{
    console.log("Exporting to xml...");

    var xmlString = "<annotations>\ ";

    for (let i = 0; i < websites.length; i++)
    {

        xmlString += "\t<annotation>\ ";

        xmlString += "\t\t" + createChildNode(websites[i], "website");
        xmlString += "\t\t" + createChildNode(content_titles[i], "content-title");
        xmlString += "\t\t" + createChildNode(titles[i], "title");
        xmlString += "\t\t" + createChildNode(descriptions[i], "description");

        xmlString += "\t\t" + createChildNode(start_times[i], "start-time");
        xmlString += "\t\t" + createChildNode(end_times[i], "end-time");

        //Tags + images + music + coordinates
        if(tags[i] != undefined)
        {
            let tags_list = tags[i];
            xmlString += "\t\t<tags>\ ";
            for(let j = 0; j < tags_list.length; j++)
            {
                xmlString += "\t\t\t" + createChildNode(tags_list[j], "tag");
            }
            xmlString += "\t\t</tags>\ ";
        }
        else
        {
            xmlString += "\t\t<tags>\ ";
            xmlString += "\t\t</tags>\ ";
        }

        if(images[i] != undefined)
        {
            let images_list = images[i];
            xmlString += "\t\t<images>\ ";
            for(let j = 0; j < images_list.length; j++)
            {
                let link = images_list[j].split('&')[0];
                xmlString += "\t\t\t" + createChildNode(link, "image");
            }
            xmlString += "\t\t</images>\ ";
        }
        else
        {
          xmlString += "\t\t<images>\ ";
          xmlString += "\t\t</images>\ ";
        }

        if(music[i] != undefined)
        {
            let music_list = music[i];
            xmlString += "\t\t<media-contents>\ ";
            for(let j = 0; j < music_list.length; j++)
            {
                let link = music_list[j].split('&')[0];
                xmlString += "\t\t\t" + createChildNode(link, "media-content");
            }
            xmlString += "\t\t</media-contents>\ ";
        }
        else
        {
            xmlString += "\t\t<media-contents>\ ";
            xmlString += "\t\t</media-contents>\ ";
        }

        if(coordinates[i] != undefined)
        {
            let coordinates_list = coordinates[i];
            xmlString += "\t\t<coordinates>\ ";
            if(coordinates_list[0] != "" && coordinates_list[1] != "")
            {
                xmlString += "\t\t\t" + createChildNode(coordinates_list[0], "latitude");
                xmlString += "\t\t\t" + createChildNode(coordinates_list[1], "longitude");
            }
            else
            {
                xmlString += "\t\t\t" + createChildNode("47.151726", "latitude");
                xmlString += "\t\t\t" + createChildNode("27.587914", "longitude");
            }
            xmlString += "\t\t</coordinates>\ ";
        }
        else
        {
            xmlString += "\t\t<coordinates>\ ";
            xmlString += "\t\t</coordinates>\ ";
        }

        xmlString += "\t</annotation>\ ";
    }

    xmlString += "</annotations>";

    var a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURI(xmlString);
    a.target = '_blank';
    a.download = 'annotations.xml';
    a.click();
}

function main_function()
{

    readAllAnnotationsFromFirebase();

    let csv = document.getElementById("exportToCsv");
    let json = document.getElementById("exportToJson");
    let xml = document.getElementById("exportToXml");

    csv.onclick = exportToCsv;
    json.onclick = exportToJson;
    xml.onclick = exportToXml;

}

main_function();
