const Webex = require ('webex')
let roomIdglobal
let roomlist
const meetingStreamsRemotelVideo = document.querySelector('#remote-video');
const meetingStreamsLocalVideo = document.querySelector('#local-video');

function loadrooms(params) {
  try{
  webex.rooms.listWithReadStatus(10).then(function(rooms){
    console.log(rooms.items) 
    document.getElementById("spaces").innerHTML = ""; 
    rooms.items.forEach(element => {
     var tag = document.createElement("p");
     tag.textContent="RoomID: " + element.id + " Type: " + element.type + " Name: " + element.title
     var element = document.getElementById("spaces");
     element.appendChild(tag);
    }); 
   })
  }catch(e){
    console.log(e)
  } 
}
function getCurrentMeeting() {
  const meetings = webex.meetings.getAllMeetings();

  return meetings[Object.keys(meetings)[0]];
}
function leavemeeting(){
mtid=getCurrentMeeting()

}

function webexvideoregsiter(){
  webex.meetings.register().then(()=>{
    console.log("Registerred")
  }) 
  .catch((error)=>{
    console.log("Epic fail" + error)
    alert ("EPIC FAIL, could not register device"+error)
  });
  webex.meetings.on('meeting:added',(mtid) =>{
    const {type} = mtid;
    console.log(mtid)
    if(type=='INCOMING'){
        console.log("devices##########")
        mtid.meeting.getDevices().then((devices)=>{
         console.log(devices)
        console.log("Añadir stream OK")
        mtid.meeting.joinWithMedia({mediaSettings:{sendAudio: true,
          sendVideo: true,
          receiveAudio: true},
          audioVideoOptions:{audioVideoOptions: {
            audio: devices[0].deviceId,
            video: devices[2].deviceId
          }}}).then((streams)=>{
            mtid.meeting.on('media:ready',(media)=>{
              console.log('get event streams#remote')
              console.log(media)
              switch (media.type) {
                case 'remoteVideo':
                  meetingStreamsRemotelVideo.srcObject = media.stream;
                  break;
                case 'remoteAudio':
                  meetingStreamsRemoteAudio.srcObject = media.stream;
                  break;
              }
            });

          console.log("answer meeting#ID Stream")
          console.log(streams)
          meetingStreamsLocalVideo.srcObject=streams.local[0]
        });
        })     
        

      }
  });
 
}
const webex = window.webex=Webex.init({
    config: {
      credentials: {
        client_id: 'C1f65302d6bb972a97541f05529cb0b6fa92bf13f703a3dfe81e8716159a2a7b4',
        redirect_uri: 'http://localhost:9000',
        emailID:'mqiuelcapde+jwt@gmail.com',
        scope: 'spark:all spark:kms',
      }
    }
  });
  webex.once('ready', () => {
      //:w
      //webex.authorization.initiateLogin();
      console.log('loop')
       if (webex.canAuthorize) {
         webexvideoregsiter()
        webex.messages.listen()
        .then(() => {
          console.log('listening to message events');
          webex.messages.on('created', (message) => {
            console.log('message created event:');
            console.log(message);
            var tag = document.createElement("p");
            tag.textContent=message.data.text
            var element = document.getElementById("msg");
            element.appendChild(tag);
            roomIdglobal=message.data.roomId
            loadrooms()
          });
          webex.messages.on('deleted', (message) => {
            console.log('message deleted event:');
            console.log(message);
          });
        })
          webex.rooms.listWithReadStatus(10).then(function(rooms){
           console.log(rooms.items) 
            rooms.items.forEach(element => {
            var tag = document.createElement("p");
            tag.textContent="RoomID: " + element.id + " Type: " + element.type + " Name: " + element.title
            var element = document.getElementById("spaces");
            element.appendChild(tag);
           }); 
          })
        alert('Webex funciona')
      }else{
        webex.authorization.initiateLogin();
      }
      

    });
    window.addEventListener('unload',async(e)=>{
      if(webex.canAuthorize){
        await webex.logout()
          console.log('logged out')
        
      }
    })
    document.getElementById('send').addEventListener('click', (event) => {
      // Don't reload the page when we submit the form.
      event.preventDefault();
      const textmsg = document.getElementById("textchat");
       
      webex.messages.create({
        roomId: roomIdglobal,
        text:textmsg.value
      })
    });
console.log("meetings")
  meeting=getCurrentMeeting()
  meeting.on('media:ready',(media)=>{
  switch (media.type) {
    case 'remoteVideo':
      meetingStreamsRemotelVideo.srcObject = media.stream;
      break;
    case 'remoteAudio':
      meetingStreamsRemoteAudio.srcObject = media.stream;
      break;
  }
});
