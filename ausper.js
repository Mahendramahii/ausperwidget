widgets=[]

head  = document.getElementsByTagName('head')[0];
link  = document.createElement('link');
link.rel  = 'stylesheet';
link.type = 'text/css';
//link.href = 'pcwidget2.css';
// link.href = 'https://cdn.jsdelivr.net/gh/Mahendramahii/ausperwidget/ausper.css'
link.href='https://mahendramahii.github.io/ausperwidget/ausper.css'
// link.href = 'ausper.css'
link.media = 'all';
head.appendChild(link);

//console.log(document.getElementsByClassName('pcscript').length)
//scripts = document.getElementsByClassName('pcscript')
scripts=document.getElementsByClassName('pcscript')
//console.log(scripts)
for(let i=0;i<scripts.length;i++){
    let x={
        id:scripts[i].attributes.pid.value,
        widgetdetails:[],
        interval:null,
        selected:1,
        doc:document.getElementById(document.getElementsByClassName('pcscript')[i].attributes.pid.value),
        items:document.getElementsByClassName('pcscript')[i].attributes.items.value?parseInt(document.getElementsByClassName('pcscript')[i].attributes.items.value):0,
        query:null
    }
    widgets[i]=x
    userAction(i);
}

async function userAction(val){
    let url='https://consumer-dev.pricingculture.com/api/assets/quick_search?columns=id,name,asset_url,platform,platform_asset_id,asset_type,security_type,security_sub_type,asset_status,media,price&page_size=12'
    // if(widgets[val].id) url+='&platform_id=in:'+widgets[val].id
    // if(widgets[val].query) url+='&query='+widgets[val].query
    if(widgets[val].id && !isNaN(widgets[val].id)) url+='&platform_id=in:'+widgets[val].id
    if(isNaN(widgets[val].id)) url+='&query='+widgets[val].id
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'api-key':'4b8e8a9c-665c-4bd6-ab4e-a0207d2142b4',
        'secret':'KrN$TttZdl2acg$80rm*'
      }
    });
    let myJson = await response.json(); //extract JSON from the http response
    if(val==scripts.length-1){
        widgets[val].widgetdetails=myJson.objects
        let assetdiv=`<div class="slideshow-container" style="height:100%;width:100%;">
            <div style="font-size:24px;text-align:center;margin-top:20px;font-weight:bold;">WIDGET ${val+1}</div>
            <div class="table-responsive" style="padding:20px;color:#fff;">
            <table class="table">
            <thead class="thead-light">
              <tr>
                <th scope="col">Asset ID</th>
                <th scope="col">Name</th>
                <th scope="col">Platform Name</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>`
            for(let i=0;i<widgets[val].widgetdetails.length;i++){
                let divdata=`<tr>
                    <td>${widgets[val].widgetdetails[i].id?widgets[val].widgetdetails[i].id:'-NA-'}</td>
                    <td><a href="${widgets[val].widgetdetails[i].asset_url}" target="_blank" style="text-decoration:none;color:#000;">${widgets[val].widgetdetails[i].name}</a></td>
                    <td>${widgets[val].widgetdetails[i].platform && widgets[val].widgetdetails[i].platform.name?widgets[val].widgetdetails[i].platform.name:'-NA-'}</td>
                    <td>${widgets[val].widgetdetails[i].asset_status?widgets[val].widgetdetails[i].asset_status:'-NA-'}</td>
                </tr>`
                assetdiv+=divdata 
            }
            assetdiv+=`</tbody>
        </table>
      </div>
      </div>`
      widgets[val].doc.innerHTML=assetdiv
    }
    else{
        widgets[val].widgetdetails=sliceIntoChunks(myJson.objects,widgets[val].items)
        let assetdiv=`<div class="slideshow-container" style="height:100%;width:100%;">
        <div style="font-size:24px;text-align:center;margin-top:20px;font-weight:bold;">WIDGET ${val+1}</div>`     
        for(let i=0;i<widgets[val].widgetdetails.length;i++){
        let divdata=`<div class="mySlides${val}" id="slide${val}${i}" style="text-align:center;display:none;">
        <div>${i+1}/${widgets[val].widgetdetails.length}</div>
        <div style="display:flex;justify-content:center">`
        for(let j=0;j<widgets[val].widgetdetails[i].length;j++){
            let seconddivdata=`<div>
                                    <div style="height:200px;margin-top:15px;">
                                        <img src=${widgets[val].widgetdetails[i][j].media && widgets[val].widgetdetails[i][j].media.length>0 && widgets[val].widgetdetails[i][j].media[0].media_src?widgets[val].widgetdetails[i][j].media[0].media_src:'https://i.ibb.co/GsPGN27/default-image.jpg'} alt="No Image" style="height:100%;width:100%;object-fit:contain;">
                                    </div>
                                    <div style="margin-top:15px;">
                                        <div style="font-size:16px;padding-bottom:10px;color:red;padding:0px 10%;">${widgets[val].widgetdetails[i][j].name}</div>
                                        <div style="color:blue;">${widgets[val].widgetdetails[i][j].platform.name}</div>
                                        <div style="color:green;">$${((parseFloat(widgets[val].widgetdetails[i][j].price)).toFixed(2))}</div>
                                    </div>
                                </div>`
            divdata+=seconddivdata
        }
        divdata+=`</div>
        </div>`
        assetdiv+=divdata 
        }
        assetdiv+=`
        <div class="prev" onclick="change2(${val},'minus')">&#10094;</div>
        <div class="next" onclick="change2(${val},'add')">&#10095;</div>
        </div>`
        widgets[val].doc.innerHTML=assetdiv
        slideAuto(val)
        widgets[val].interval=setInterval(()=>slideAuto(val),3000) 
    }
}

function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

function slideAuto(val){
    change(val,'add')
  }
  
function resetSlide(val){
    clearInterval(widgets[val].interval)
    widgets[val].interval=setInterval(()=>slideAuto(val),3000)
  }
  
function change(index,type){
    let widget=widgets[index]
    if(type=='add') widget.selected=widget.selected+1
    if(type=='minus') widget.selected=widget.selected-1
    //console.log(widget,widget.widgetdetails.length,widget.selected > widget.widgetdetails.length)
    if(widget.selected > widget.widgetdetails.length) widget.selected=1
    if(widget.selected < 1) widget.selected=widget.widgetdetails.length
    let slides = document.getElementsByClassName("mySlides"+index);
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    // console.log(widget.selected,slides.length,widget.selected-1)
    slides[widget.selected-1].style.display = "block";
    resetSlide(index)
  }

