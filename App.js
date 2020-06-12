/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconFeather from 'react-native-vector-icons/Feather';
import { Slider } from 'react-native-elements';
import keys from './awskeys';

import GoogleCast, { CastButton } from 'react-native-google-cast'

import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TouchableOpacity,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import awskeys from './awskeys';

const App: () => React$Node = () => {

  const defaultImage = require('./assets/start300x225.jpg');
  const [workoutCount, setworkoutCount] = useState(0);
  const [photoUrls, setphotoUrls] = useState([]);
  const [currentImage, setcurrentImage] = useState(defaultImage);

  // Establishing connection to Chromecast
GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_STARTING, () => {
  console.log("session starting");
})

// Connection established
GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_STARTED, () => {
  /* callback */
  console.log("started");
})

// Connection failed
GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_START_FAILED, error => {
  console.log(error)
})

// Connection suspended (your application went to background or disconnected)
GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_SUSPENDED, () => {
  /* callback */
  console.log("suspended");
})

// Attempting to reconnect
GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_RESUMING, () => {
  /* callback */
})

// Reconnected
GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_RESUMED, () => {
  /* callback */
})

// Disconnecting
GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_ENDING, () => {
  /* callback */
  console.log("ended");
})

// Disconnected (error provides explanation if ended forcefully)
GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_ENDED, error => {
  /* callback */
  console.log("ended" + error);
})

  // Play the casting, only if the device is connected and was playing something before in the actual sesion
  playCast = () => GoogleCast.play();

  // Pause the currently casting
  pauseCast = () => GoogleCast.pause();

  // Show the Expanded Control Panel
  shwoControls = () => GoogleCast.launchExpandedControls();

  // Set the region 
  startCast = () => {
  GoogleCast.castMedia({
    mediaUrl:
      'http://192.168.1.100:8000/stream.mjpg',
    imageUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/images/480x270/BigBuckBunny.jpg',
    title: 'Big Buck Bunny',
    subtitle:
      'A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.',
    studio: 'Blender Foundation',
    streamDuration: 596, // seconds
    contentType: 'image/jpeg', // Optional, default is "video/mp4"
    playPosition: 10, // seconds
    customData: {
      // Optional, your custom object that will be passed to as customData to reciever
      customKey: 'customValue',
    },
  }).then(console.log('Playing.. '))
  .catch(e => console.log('An error has ocurred, reason: ', e));
};

  recordClick = () =>  {
   
    

    AWS.config.update({region: 'us-east-2'});

  var sqs = new AWS.SQS(
    {apiVersion: '2012-11-05',
    accessKeyId:keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey
    });

    var bucketName = 'picar-workoutimages';
    // Create a new service object
var s3 = new AWS.S3({
  params: {Bucket: bucketName},
  accessKeyId:keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey
});

s3.listObjects({Delimiter: '/'}, function(err, data) {
  if (err) {
    setworkoutCount(-1);
  } else {
    setworkoutCount(-2);
    var albumName
    var albums = data.CommonPrefixes.map(function(commonPrefix) {
      var prefix = commonPrefix.Prefix;
      albumName = decodeURIComponent(prefix.replace('/', ''));
    });
    setworkoutCount(albums.length);

    var albumPhotosKey = encodeURIComponent(albumName) + '/';
  s3.listObjects({Prefix: albumPhotosKey}, function(err, data) {
    if (err) {
      return alert('There was an error viewing your album: ' + err.message);
    }
    // 'this' references the AWS.Response instance that represents the response
    var href = this.request.httpRequest.endpoint.href;
    var bucketUrl = href + bucketName + '/';
    var photos = [];
    data.Contents.map(function(photo) {
      var photoKey = photo.Key;
      var url = bucketUrl + encodeURIComponent(photoKey);
      photos.push(url);
      console.log(url);
      setcurrentImage({uri: url})
      console.log("current url =>" + url);
    });

    setphotoUrls(photoUrls.concat(photos));
    console.log(photoUrls);

    setworkoutCount(photos.length);
  });

}
  });



    var params = {
      MessageBody: 'Record', /* required */
      QueueUrl: 'https://sqs.us-east-2.amazonaws.com/102809568981/RaspiCommands.fifo', /* required */
      
      MessageAttributes: {
        "Title": {
          DataType: "String",
          StringValue: "The Whistler"
        },
        "Author": {
          DataType: "String",
          StringValue: "John Grisham"
        },
        "WeeksOn": {
          DataType: "Number",
          StringValue: "6"
        }
      },
      MessageDeduplicationId: "Command",  // Required for FIFO queues
      MessageGroupId: "Pi"  // Required for FIFO queues
      
    };
    sqs.sendMessage(params, function(err, data) {
     // if (err) alert(err, "Error"+ err.stack); // an error occurred
     // else     alert(data);           // successful response
    });
  }

  return (
    <>
      <View style={styles.container}>
        
        <View style={styles.recordContainer}>
        <TouchableOpacity onPress={this.recordClick}>
          <View style={styles.button}>
           <Text >
            <Icon name="circle" size={30} color="#900" />
            </Text>
          </View>
        </TouchableOpacity>
        <CastButton style={{ width: 24, height: 24 }} />
        <TouchableOpacity onPress={this.startCast}>
          <View style={styles.button}>
            <Text >
            <IconFeather name="cast" size={30} color="#900" />
            </Text>
          </View>
        </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
        <Image source={currentImage}
                  style={{width: 400, height: 400}} />
          <View style={{flex: 1, justifyContent: "center"}}>
          
         
</View>
<View style={{ flex: 1, margin: 30, alignItems: 'stretch', justifyContent: 'center', width: 300 }}>
  <Slider
    value={0}
    maximumValue={photoUrls.Length}
    step = {0.1}
    onValueChange={val => 
      {
        index = Math.round(val * 10);
        console.log("new url =>" + index + "  "+ photoUrls[index]);
        setcurrentImage({uri: photoUrls[index]});
      }}
  />
  <Text>{currentImage.uri}</Text>
</View>

          </View>

      <View style={styles.analyzeContainer}>
      <TouchableOpacity onPress={this.recordClick}>
          <View style={styles.button}>
            <Icon name="compass" size={30} color="#900" />
          </View>
         
        </TouchableOpacity>
        
      </View>
      
          </View>
    </>
  );
};

const styles = StyleSheet.create({
  container:{ flex: 1, justifyContent: "center"},
  recordContainer: {
    backgroundColor: Colors.dark,
    flex:1,
    flexDirection: 'row',
    marginTop: 80,
    justifyContent: "center"
  },
  analyzeContainer: {
    flex:1,
    margin: 20,
    backgroundColor: Colors.lighter, 
    alignItems: "center"
  },
  imageContainer:{ flex: 5, justifyContent: "center"},
  button: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:40,
    height:40,
    backgroundColor:'#fff',
    borderRadius:50,
    margin:40
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white'
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
