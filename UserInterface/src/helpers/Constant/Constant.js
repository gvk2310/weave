//Multicolor theme palette
export const COLORS =  ['#9657D5','#CB72D8','#DC67CE', '#E769A8', '#EE97E3','#F3A6CD','#D7A267','#DCC467',
'#DCDC67','#B7DC75','#ED88BB','#AC61C3','#8FD399','#67CABD','#87C6E2','#67B7DC','#68A8D9','#A063B5','#DC84DD',
'#6998D6','#6B89D2','#75A5EB','#B95FD2','#707ED6','#7188DC','#6967B2','#6C79CF','#6D6ACC','#6765A6','#9365A6',
'#646399','#60607F','#E370B3',' #A367DC', '#7A96E2'];

export const NODES = ['#A367DC','#7A96E2'];

export const STATUS = ['#A9E206','#FF0E00', '#F6D403'];

export const moveLeft = () => {
    document.getElementById('checkNodes').scrollLeft += -280;
}

export const moveRight = () => {
    document.getElementById('checkNodes').scrollLeft += 280;
}